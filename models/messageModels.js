const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  from_user: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    lowercase: true
  },
  date_sent:{
    type: Date,
    default: Date.now,
    required: true
  }

});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;