// list dependencies
var express = require('express');
var router = express.Router();

// add db & model dependencies
var mongoose = require('mongoose');
var entity = require('../models/entity');

// add formidable & other utils for upload
var formidable = require('formidable');
var util = require('util');
var fs = require('fs-extra');

// interpret GET /index - landing page */
router.get('/index', function (req, res, next) {

    // retrieve all entities using the entity model; returns either an error or list of entities
    entity.find(function (err, index) {
        // if we have an error
        if (err) {
            res.render('error', { error: err });
        }
        else {
            // no error, show the views/entities.jade and pass the query results to that view
            res.render('index', { index: index });
            console.log(index);
        }
    });
});


// Appling GET /entities - show entity listing */
router.get('/entities', function (req, res, next) {

    // Find all entities using the entity model; returns either an error or list of entities
    entity.find(function (err, entities) {
        // if we have an error
        if (err) {
            res.render('error', { error: err });
        }
        else {
            // no error, show the views/entities.jade and pass the query results to that view
            res.render('entities', { entities: entities });
            console.log(entities);
        }
    });
});

// GET /entities/add - show entity input form
router.get('/entities/add', function (req, res, next) {
    res.render('add');
});

// API GET entities request handler
router.get('/api/entities', function (req, res, next) {
    entity.find(function (err, entities) {
        if (err) {
            res.send(err);
        } 
        else {
            res.send(entities);
        }
    });
});
  
// POST /entities/add - save new entity
router.post('/entities/add', function (req, res, next) {

	var form = new formidable.IncomingForm();
	var uploadForm;

	form.parse(req, function (err, fields, files) {
		uploadForm = {
			Title: fields.title,
			Industry: fields.industry,
			City: fields.city,
			Province: fields.province,
			Birth: fields.birth,
			Website: fields.website,
			imageUrl: files.fileUploadImage.name	
		}
	});
    
    form.on('end', function(fields, files) {
   
        var temp_path = this.openedFiles[0].path;
        
        var file_name = this.openedFiles[0].name;
        
        var new_location = 'public/user_uploads/'; 
        console.log(new_location + file_name);
        
        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.log(err);
            }
            else {
				console.log(uploadForm);
                entity.create(uploadForm, function (err, Upload) {
                    if (err) {
                        console.log(err);
                        res.render('error', { error: err });
                    }
                    else {
                        res.render('added');
                    }
                }); //end create    
            } //end else
        }); // end fs.copy
    }); // end form.on
}); // end post

// interpret GET /added  */
router.get('/added', function (req, res, next) {

    // retrieve all entities using the entity model; returns either an error or list of entities
    entity.find(function (err, added) {
        // if we have an error
        if (err) {
            res.render('error', { error: err });
        }
        else {
            // no error, show the views/entities.jade and pass the query results to that view
            res.render('added', { added: added });
            console.log(added);
        }
    });
});

/* GET entity delete request - : indicates id is a variable */    
router.get('/entities/delete/:id', function (req, res, next) {
    //store the id from the url into a variable
    var id = req.params.id;

    //use our entity model to delete
    entity.remove({ _id: id }, function (err, entity) {
        if (err) {
            res.send('entity ' + id + ' not found');
        }
        else {
            res.statusCode = 302;
            res.setHeader('Location', 'http://' + req.headers['host'] + '/entities');
            res.end();
        }
    });
});

// GET intepret GET /entities/edit/:id - show single entity edit form */
router.get('/entities/edit/:id', function (req, res, next) {
    //store the id from the url in a variable
    var id = req.params.id;

    //use the entity model to look up the entity with this id    
    entity.findById(id, function (err, entity) {
        if (err) {
            res.send('entity ' + id + ' not found');
        }
        else {
            res.render('edit', { entity: entity });
        }
    });
});

// POST /entities/edit/:id - update selected entity */
router.post('/entities/edit/:id', function (req, res, next) {
	
	// Update begins here
	
	var form = new formidable.IncomingForm();
	var editForm;

	form.parse(req, function (err, fields, files) {
		editForm = {
			Title: fields.title,
			Industry: fields.industry,
			City: fields.city,
			Province: fields.province,
			Birth: fields.birth,
			Website: fields.website,
			imageUrl: files.fileUploadImage.name	
		}
	});
	
	form.on('end', function(fields, files) {
   
        var temp_path = this.openedFiles[0].path;
        
        var file_name = this.openedFiles[0].name;
        
        var new_location = 'public/user_uploads/'; 
        console.log(new_location + file_name);
        
        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.log(err);
            }
            else {
				console.log(editForm);
                entity.update(editForm, function (err, Upload) {
                    if (err) {
                        console.log(err);
                        res.render('error', { error: err });
                    }
                    else {
                        res.render('edited');
                    }
                }); //end update    
            } //end else
        }); // end fs.copy
    }); // end form.on
}); // end post


// make controller public
module.exports = router;
