const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Request = require("./Request");

const replySchema = Schema(
  {
    content: { type: String, required: true },
    user: { type: Schema.ObjectId, required: true, ref: "User" },
    request: { type: Schema.ObjectId, required: true, ref: "Blog" },
  },
  { timestamps: true }
);

replySchema.statics.calculateReplies = async function (requestId) {
  const repliesCount = await this.find({ request: requestId }).countDocuments();
  await Request.findByIdAndUpdate(requestId, { repliesCount: repliesCount });
};

replySchema.post("save", async function () {
  await this.constructor.calculateReplies(this.request);
});

replySchema.pre(/^findOneAnd/, async function (next) {
  this.doc = await this.findOne();
  next();
});

replySchema.post(/^findOneAnd/, async function (next) {
  await this.doc.constructor.calculateReplies(this.doc.blog);
});

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;
