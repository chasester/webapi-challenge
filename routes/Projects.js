const express = require('express');
const db = require('../data/helpers/projectModel');
const db_action = require('../data/helpers/actionModel');

const router = express.Router();
const validator = require('../utls/validateRoutes');

router.post('/', validator.validateProject, 
    (req, res, next) => 
    {
        db.insert(req.project)
        .then(result => {req.params.id = result.id; next()})
        .catch(error => res.status(500).json({error: error, message: "name must be unique"}))
    } ,
    validator.validateProjectId, 
    (req,res) => res.status(201).json(req.project)
);

router.post('/:id/actions', 
    validator.validateProjectId, validator.validateAction, 
    (req, res) => 
    {
        req.data.project_id = req.project.id;
        db_action.insert(req.data)
        .then(() => {
            db.getProjectActions(req.project.id)
            .then(result => res.status(200).json(result))
            .catch((err) => res.status(500).json({error: err, message: "Could not fetch any action from this project."}));
        })
        .catch(() => res.send("interal error"))
    }
);

router.get('/', (req, res) => {
    db.get()
    .then(result => 
    {
        if(!result || result.length === 0) return res.status(500).json({message: "no projects exist"});
        res.status(200).json(result);
    })
    .catch((err) => res.status(500).json({error: err, message: "Could not fetch any data from projects table."}));
});

router.get('/:id', validator.validateProjectId, (req, res) => {
    res.status(200).json(req.project);
});

router.get('/:id/actions', validator.validateProjectId, (req, res) => {
    db.getProjectActions(req.project.id)
    .then(result => res.status(200).json(result))
    .catch((err) => res.status(500).json({error: err, message: "Could not fetch any action from this project."}));
});

router.delete('/:id', validator.validateProjectId, (req, res) => {
    db.remove(req.project.id)
    .then(()=> res.status(202).json({message: "item deleted"}))
    .catch((err) => req.status(500).json({error: err, message: "item requested to be deleted but may not have been deleted"}));
});

router.put('/:id', validator.validateProjectId, validator.validateProject, 
    (req, res, next) =>
    {
        //req.project.id = req.params.id;
        db.update(req.params.id, req.project)
        .then(() => next())
        .catch(err => res.status(500).json({error: err, message: "item requested to be added but may or may not have been added"}))
    },
    validator.validateProjectId,
    (req,res) =>{res.status(200).json(req.project);}
);

//custom middleware

/* function validator.validateProjectId(req, res, next) {
    if(!req.params || !req.params.id || !parseInt(req.params.id) || req.params.id < 1) return res.status(400).json({error: "id is not defined"});
    db.getById(req.params.id)
    .then(result =>
    {
        if(!result || result.length==0) return res.status(400).json({error: "this id does not exist"})
        req.project = result;
        next();
    })
    .catch(error => res.status(500).json({error: error, message: "internal error of data"}) )
};

function validateproject(req, res, next) { 
    let project =
    {
        name: req.body.name !== "" ? req.body.name : undefined
    }

    let str = validateObject(project);
    if(str !== "") res.status(400).json({error: `missed data: needs ${str}`});
    req.project = project;
    next();
};
 */
module.exports = router;
