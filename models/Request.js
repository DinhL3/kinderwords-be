const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = Schema(
  {
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    repliesCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

requestSchema.plugin(require("./plugins/isDeletedFalse"));

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;
