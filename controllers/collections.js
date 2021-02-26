const Collection = require('../models/collection')
const Resource = require('../models/resource')
const User = require('../models/user')

module.exports = {
  create,
  getMyCollections,
  addNewResource,
}

//Create a new collection
function create(req, res){
  console.log(req.user)
  req.body.createdByName = req.user.name
  // req.body.createdByAvatar = req.user.avatar
  req.body.creator = req.user._id
  console.log(`This is the current form data: ${req.body}`)
  Collection.create(req.body)
  .then((collection) => {
    res.json(collection)
  })
  .catch((err) => {
    res.json(err)
  })
}

function getMyCollections(req, res){
  Collection.find({creator: req.params.id})
  .populate("resources")
  .then((collections) => {
    res.json(collections)
  })
  .catch((err) => {
    res.json(err)
  })
}

function addNewResource(req, res){
  Collection.findById(req.body.collection)
  .then((collection2) => {
    collection2.resources.push(req.body.resource)
    collection2.save()
    Collection.populate(collection2, { path: "resources"})
    .then((collection) => {
      res.json(collection)
    })
  }) 
  .catch((err) => {
    res.json(err)
  })
}