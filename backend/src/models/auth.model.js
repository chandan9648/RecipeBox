const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String,
     required: true,
      },
  email: {
     type: String,
     required: true,
     unique: true,
     lowercase: true
    },
  password: {
    type: String,
    required: function () {
      return this.provider === 'local';
    },
    minlength: 6
  },
  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  googleSub: {
    type: String,
    unique: true,
    sparse: true,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "seller", "admin"],
    default: "user"
  }
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;