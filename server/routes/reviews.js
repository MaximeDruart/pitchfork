const router = require("express").Router()
let Review = require("../models/review.model")

// if bool is true, returning an object that will exclude the descripiton in the data returned, otherwise return an empty object.
const getExclusionObject = (fields) => {
  if (Array.isArray(fields)) {
    let obj = {}
    fields.forEach((field) => (obj[field] = 0))
    return obj
  } else if (typeof fields === "string") return Object.fromEntries([[fields, 0]])
  return {}
}

/**
TAKES
  {
    "filters" : {
      // any fields that are in the models are valid
      "genre" : "Rock",
      "author" : "Joe Tangari",
      "date" : "2068" // only needs to include year, can include precise date
    }, 
	  "exclusions" : "review"
  }

RETURNS review objects filtered
*/
router.get("/find", (req, res) => {
  req.body.filters.date = { $regex: new RegExp(req.body.filters.date) }
  Review.find(req.body.filters, getExclusionObject(req.body.exclusions))
    .then((reviews) => (reviews.length > 0 ? res.json(reviews) : res.status(404).json("No reviews found for filters")))
    .catch((err) => res.status(400).json({ err }))
})

/**
UNTESTED
*/
router.get("/find/id", (req, res) => {
  Review.findById(req.body.id, getExclusionObject(req.body.exclusions))
    .then((review) => res.json(review))
    .catch((err) => res.status(404).json({ error: `No review found for id : ${req.body.id}` }))
})

/**
TAKES
  {
    "year" : "2019", // year is string type
	  "exclusions" : "review"
  }

RETURNS review objects filtered
*/
router.get("/find/year", (req, res) => {
  Review.find({ $text: { $search: req.body.year } }, getExclusionObject(req.body.exclusions))
    .then((reviews) => {
      reviews.length > 0 ? res.json(reviews) : res.status(404).json(`No reviews found for year : ${req.body.year}`)
    })
    .catch((error) => res.status(400).json({ error }))
})

/**
TAKES
  {
    "genre" : "Rock",
	  "exclusions" : "review"
  }

RETURNS review objects filtered
*/
router.get("/find/genre", (req, res) => {
  Review.find({ genre: req.body.genre }, getExclusionObject(req.body.exclusions))
    .then((reviews) => {
      reviews.length > 0 ? res.json(reviews) : res.status(404).json(`No reviews found for genre : ${req.body.genre}`)
    })
    .catch((err) => res.status(400).json({ err }))
})

// use only if you want your pc to die
router.get("/find/all", (req, res) => {
  Review.find({}, getExclusionObject(req.body.exclusions))
    .then((reviews) => res.json(reviews))
    .catch((err) => res.status(404).json(err))
})

router.get("/test/count", (req, res) => {
  Review.estimatedDocumentCount()
    .then((data) => res.json(data))
    .catch((err) => res.status(404).json(err))
})
module.exports = router
