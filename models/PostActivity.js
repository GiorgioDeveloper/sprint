const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    sport: String,
    description: String,
    distance: Number,
    hours: Number,
    minutes: Number,
    location: String,

    //post has one user (one to one relationship)
    author: { type: Schema.Types.ObjectId, ref: "User" },
    photo: { type: Schema.Types.ObjectId, ref: "Photo" }
  }, //define relation with user
  {
    timestamps: true
  }
);

const PostActivity = mongoose.model("Activity", postSchema);

module.exports = PostActivity;
