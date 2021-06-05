const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = mongoose.Schema(
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

// userSchema.plugin(require("./plugins/isDeletedFalse"));

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  // delete obj.emailVerified;
  // delete obj.emailVerificationCode;
  // delete obj.isDeleted;
  return obj;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.statics.findOrCreate = function findOrCreate(profile, cb) {
  const userObj = new this();
  this.findOne({ email: profile.email }, async function (err, result) {
    if (!result) {
      // create user
      // 1. make new password
      let newPassword = "" + Math.floor(Math.random() * 1000000000);
      newPassword = await bcrypt.hash(newPassword, saltRounds);

      // 2. save user
      userObj.name = profile.name;
      userObj.email = profile.email;
      userObj.password = newPassword;

      // 3. callback
      await userObj.save(cb);
    } else {
      // send user info back to passport
      cb(err, result);
    }
  });
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "14d",
  });
  return accessToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
