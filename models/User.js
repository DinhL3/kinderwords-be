const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "User must have a name"],
      trim: true,
      minLength: 1,
    },
    email: {
      type: String,
      required: [true, "User must have an email"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "User must have a password"],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(require("./plugins/isDeletedFalse"));

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  // delete obj.emailVerified;
  // delete obj.emailVerificationCode;
  // delete obj.isDeleted;
  return obj;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
