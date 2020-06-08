const mongoose = require("mongoose");
const crypto = require("crypto");
const uudv1 = require("uuid/v1");


var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      maxlength: 55,
    },
    lastname: {
      type: String,
      maxlength: 55,
    },
    email: {
      type: String,
      maxlength: 55,
      required: true,
      unique: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array,
      default: [],
    },
    Active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uudv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function (plainpassword) {
    try {
      if (plainpassword=="") {
        return "";
      } else {
        return crypto
          .createHmac("sha256", this.salt)
          .update(plainpassword)
          .digest("hex");
      }
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
