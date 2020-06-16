const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
  {
    album: String,
    artist: String,
    author: String,
    bnm: String,
    date: {
      type: String,
      text: true,
    },
    genre: String,
    id: Number,
    review: String,
    role: String,
    score: Number,
  },
  {
    strictQuery: "throw",
  }
)

//  {"_id":{"$oid":"5ee7b5f2381d074c8346a8a9"},"album":"Transportation EPs","artist":"Chandra","author":"Andy Beta","bnm":{"$numberInt":"0"},"date":"January 10 2019","genre":"Rock","id":{"$numberInt":"3"},"link":"https://pitchfork.com/reviews/albums/chandra-transportation-eps/","review":"rev","role":"Contributor","score":{"$numberDouble":"7.8"}}

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review
