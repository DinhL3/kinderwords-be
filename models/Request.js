const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = Schema(
  {
    content: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    repliesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

requestSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  // delete obj.emailVerified;
  // delete obj.emailVerificationCode;
  // delete obj.isDeleted;
  return obj;
};

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;
