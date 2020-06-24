const mongoose = require("mongoose")

const reviewerSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    reviewCount: Number,
    averageScore: Number,
    preferedGenre: String,
    preferedWords: [String],
    reviewIds: [mongoose.Schema.Types.ObjectId],
  },
  {
    strictQuery: "throw",
  }
)

const Reviewer = mongoose.model("Reviewer", reviewerSchema)
module.exports = Reviewer
