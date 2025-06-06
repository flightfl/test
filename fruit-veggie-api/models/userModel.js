const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produce'
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;