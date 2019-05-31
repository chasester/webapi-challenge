const validateObject = require("./validateObject");
const db_action = require("../data/helpers/actionModel");
const db_project = require("../data/helpers/projectModel");

function validateAction(req, res, next) {
    let post =
    {
        description: req.body.description ? req.body.description.substring(0,128) : undefined,
        notes: req.body.notes
    }

    let str = validateObject(post);
    if(str !== "") res.status(400).json({error: `missed data: needs ${str}`});
    req.data = post;
    next();
};

function validateProject(req, res, next) {
    let post =
    {
        name: req.body.name,
        description: req.body.name,
        completed: false
    }
    let str = validateObject(post);
    if(str !== "") res.status(400).json({error: `missed data: needs ${str}`});
    req.project = post;
    next();
};

function validateActionId(req, res, next) {
    if(!req.params || !req.params.id || !parseInt(req.params.id) || req.params.id < 1) return res.status(400).json({error: "id is not defined"});
    db_action.get(req.params.id)
    .then(result =>
    {
        if(!result || result.length==0) return res.status(400).json({error: "this id does not exist"})
        req.data = result;
        next();
    })
    .catch(error => res.status(500).json({error: error, message: "internal error of data"}) )
};

function validateProjectId(req, res, next) {
    if(!req.params || !req.params.id || !parseInt(req.params.id) || req.params.id < 1) return res.status(400).json({error: "id is not defined"});
    db_project.get(req.params.id)
    .then(result =>
    {
        if(!result || result.length==0) return res.status(400).json({error: "this id does not exist"})
        req.project = result;
        next();
    })
    .catch(error => res.status(500).json({error: error, message: "internal error of data"}) )
};



module.exports = {validateAction, validateProject, validateProjectId, validateActionId};