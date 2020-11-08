import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({

  name: {
    type: String,
    default: ""
  },
  useremail: {
    type: String,
  },
  phone: {
    type: String,
  },
  country: {
    type: String,
  },
  contactType: {
    type: String,
  },
  messageData: {
    type: String,
  },
  StartDate: {
    type: String,
  },
  EndDate: {
    type: String,
  },
  room: {
    type: String,
  },

  guest: {
    type: String,
  },

  tourType: {
    type: String,
  },


  
}, {
  timestamps: true
});



const Query = mongoose.model('Query', querySchema);

module.exports = Query;