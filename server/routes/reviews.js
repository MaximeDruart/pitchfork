const router = require("express").Router()
const Review = require("../models/review.model").model
const Reviewer = require("../models/reviewer.model")
const banWords = require("../config/banWords.js")

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
router.post("/find", (req, res) => {
  if (req.body.filters.date) req.body.filters.date = { $regex: new RegExp(req.body.filters.date) }
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

/**
 * CREATING THE REVIEWER DATA
 * ------------------------------------------------------------------------------------
 */

// Recursivity seems to be the most stable solution for handling asynchronous request in a loop

const crupReviewersRec = (reviews, index = 0, res) => {
  if (reviews.length - 1 === index) return res.json({ done: "crup done !" })
  Reviewer.findOne({ name: reviews[index].author })
    .then((reviewerFound) => {
      if (reviewerFound) {
        Reviewer.update(
          { name: reviews[index].author },
          {
            $inc: { reviewCount: 1 },
            $push: { reviewIds: reviews[index].id },
            averageScore: reviewerFound.averageScore + reviews[index].score,
            // idk how we'll do preferedGenre and preferedWords but that's a later concern
          }
        )
          .then(() => crupReviewersRec(reviews, index + 1, res))
          .catch((error) => crupReviewersRec(reviews, index + 1, res))
        // else if reviewer doesn't exist yet create it
      } else {
        Reviewer.create({
          name: reviews[index].author,
          reviewCount: 1,
          averageScore: reviews[index].score / 1, // doesn't really matter as it's equal to 1 but just to know
          preferedGenre: "undefined",
          preferedWords: ["undefined"],
          reviewIds: [reviews[index].id],
        })
          .then(() => {
            return crupReviewersRec(reviews, index + 1, res)
          })
          .catch((error) => {
            return crupReviewersRec(reviews, index + 1, res)
          })
      }
    })
    .catch((error) => {
      console.log(error)
      return crupReviewersRec(reviews, index + 1, res)
    })
}

router.get("/createReviewers", (req, res) => {
  console.log("request started")
  Review.find({}, { review: 0 }).then((reviews) => {
    console.log("reviews found, starting update...")
    crupReviewersRec(reviews, 0, res)
  })
})

const getMostUsedWordInString = (string, numberOfWords = 10) => {
  var wordCounts = {}
  var words = string.toLowerCase().split(/\b/)
  for (var i = 0; i < words.length; i++) {
    wordCounts[words[i]] = (wordCounts[words[i]] || 0) + 1
  }
  // removing words with less than 4 chars
  let mostUsedWords = []
  for (const prop in wordCounts) {
    if (prop.length <= 4 || banWords.includes(prop)) delete wordCounts[prop]
  }
  // going from object to array
  for (const prop in wordCounts) mostUsedWords.push([prop, wordCounts[prop]])
  // sorting
  mostUsedWords.sort((a, b) => b[1] - a[1])

  // only keeping the words
  mostUsedWords = mostUsedWords.map((subArr) => subArr[0])
  // only keeping the 5 most used
  return mostUsedWords.slice(0, numberOfWords)
}

const rec = (reviewers, index = 0, res) => {
  console.log("running function", index)
  if (reviewers.length - 1 === index) return res.json({ done: "done" })

  const reviewer = reviewers[index]
  // For favorite genre
  Review.find({ _id: { $in: reviewer.reviewIds } }, { review: 1, genre: 1 }).then((reviews) => {
    // getting the most used words
    let revedGenres = {}
    const combinedReviewTxt =
      reviews.length > 1 ? reviews.reduce((acc, rev) => acc + " " + rev.review) : reviews[0].review
    const mostUsedWords = getMostUsedWordInString(combinedReviewTxt)

    // getting the prefered genre
    reviews.forEach((review) => {
      if (revedGenres[review.genre]) {
        revedGenres[review.genre] += 1
      } else revedGenres[review.genre] = 1
    })
    let mostRevedGenre = ["genre", 0]
    for (const prop in revedGenres) {
      if (mostRevedGenre[1] < revedGenres[prop]) mostRevedGenre = [prop, revedGenres[prop]]
    }

    // getting the average score

    Reviewer.updateOne(
      { name: reviewer.name },
      {
        preferedWords: mostUsedWords,
        preferedGenre: mostRevedGenre[0],
        // averageScore: reviewer.averageScore / reviewer.reviewCount,
      }
    ).then(() => rec(reviewers, index + 1, res))
  })
}

router.get("/updateinfos", (req, res) => {
  Reviewer.find({}, { name: 1, reviewIds: 1, averageScore: 1, reviewCount: 1 }).then((reviewers) => {
    rec(reviewers, 0, res)
  })
})

router.get("/find/reviewer", (req, res) => {
  Reviewer.find(req.body.filters, getExclusionObject(req.body.exclusions))
    .then((reviewers) =>
      reviewers.length > 0 ? res.json(reviewers) : res.status(404).json("No reviewers found for filters")
    )
    .catch((err) => res.status(400).json({ err }))
})

// R

const rec3 = (reviews, artistsLocal = [], index = 0, res) => {
  if (reviews.length - 1 === index) return res.json({ done: "fafaz" })

  const review = reviews[index]
  if (artistsLocal.includes(review.artist)) {
    Review.deleteOne({ album: review.album }).then(() => rec3(reviews, artistsLocal, index + 1, res))
  } else {
    artistsLocal.push(review.artist)
    return rec3(reviews, artistsLocal, index + 1, res)
  }
}

router.get("/find/dupartists", (req, res) => {
  Review.find({}, { artist: 1, album: 1 }).then((reviews) => {
    rec3(reviews, [], 0, res)
  })
})

module.exports = router
