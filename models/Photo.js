const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema(
  {
    photoNameId: String,
    path: String,
    authour: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true
  }
);

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;
