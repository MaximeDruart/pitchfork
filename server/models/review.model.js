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
    review: String,
    role: String,
    score: Number,
  },
  {
    strictQuery: "throw",
  }
)

const Review = mongoose.model("Review", reviewSchema)

module.exports = {
  model: Review,
  schema: reviewSchema,
}
