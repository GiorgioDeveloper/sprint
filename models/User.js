const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: { type: String, required: true },
    postActivity: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
    profileImg: { type: Schema.Types.ObjectId, ref: "Photo" }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
