import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    default: ""
  },
  email: {
    type: String,
  },
  role: {
    type: String,
    default: "user"
  },
  email_verify_token: {
    type: String,
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
  },
  reset_password_token: {
    type: String
  },
  reset_password_expires: {
    type: String
  },
  about: {
    type: String
  },
  profile_picture: {
    type: String
  },
  profile_cover_picture: {
    type: String
  }
}, {
  timestamps: true
});



const User = mongoose.model('User', userSchema);

module.exports = User;