const express = require('express');
//const db_project = require('../data/helpers/projectModel');
const db = require('../data/helpers/actionModel');

const router = express.Router();
const validator = require('../utls/validateRoutes');

router.get('/', (req, res) => {
    db.get()
    .then(result => 
    {
        if(!result || result.length === 0) return res.status(500).json({message: "no posts exist"});
        res.status(200).json(result);
    })
    .catch((err) => req.status(500).json({error: err, message: "Could not fetch any data from posts table."}));
});

router.get('/:id',  validator.validateActionId, (req, res) => {
    res.status(200).json(req.data);
});

router.delete('/:id', validator.validateActionId, (req, res) => {
    db.remove(req.params.id)
    .then(()=> res.status(202).json({message: "item deleted"}))
    .catch((err) => req.status(500).json({error: err, message: "item requested to be deleted but may not have been deleted"}));
});

router.put('/:id', validator.validateActionId, validator.validateAction, (req, res, next) => 
    {
        req.data.id = req.params.id;
        db.update(req.params.id, req.data)
        .then(() => next())
        .catch(err => res.status(500).json({error: err, message: "item requested to be added but may or may not have been added"}))
    },
    validator.validateActionId,
    (req,res) =>{res.status(200).json(req.data);}
);

// custom middleware

/* function validator.validateActionId(req, res, next) {
    if(!req.params || !req.params.id || !parseInt(req.params.id) || req.params.id < 1) return res.status(400).json({error: "id is not defined"});
    db.getById(req.params.id)
    .then(result =>
    {
        if(!result || result.length==0) return res.status(400).json({error: "this id does not exist"})
        req.data = result;
        next();
    })
    .catch(error => res.status(500).json({error: error, message: "internal error of data"}) )

}; */
module.exports = router;


