const router = require("express").Router()

const Reviewer = require("../models/reviewer.model")
const banWords = require("../config/banWords.js")

const getExclusionObject = require("../config/utils")

router.post("/find", (req, res) => {
  Reviewer.find(req.body.filters, getExclusionObject(req.body.exclusions))
    .then((reviewers) =>
      reviewers.length > 0 ? res.json(reviewers) : res.status(404).json("No reviewers found for filters")
    )
    .catch((err) => res.status(400).json({ err }))
})

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

const slugify = require("slugify")

const rec4 = (reviewers, index = 0, res) => {
  if (reviewers.length - 1 === index) return res.json({ done: "Added slug to all reviewers" })

  const slug = slugify(reviewers[index].name.toLowerCase())
  console.log(slug)
  Reviewer.findOneAndUpdate(
    { name: reviewers[index].name },
    {
      $set: { slug },
    }
  ).then(() => {
    rec4(reviewers, index + 1, res)
  })
}

router.get("/slugify", (req, res) => {
  Reviewer.find().then((reviewers) => {
    rec4(reviewers, 0, res)
  })
})

module.exports = router
