const Collection = require('../models/collection')
const Resource = require('../models/resource')
const User = require('../models/user')

module.exports = {
  create,
  getMyCollections,
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
  console.log(req.params.id)
  Collection.find({creator: req.params.id})
  .then((collections) => {
    console.log(collections)
    res.json(collections)
  })
  .catch((err) => {
    res.json(err)
  })
}