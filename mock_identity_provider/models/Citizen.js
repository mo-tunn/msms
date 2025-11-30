const mongoose = require('mongoose');

const CitizenSchema = new mongoose.Schema({
  tcKimlikNo: {
    type: String,
    required: true,
    unique: true
  },
  ad: {
    type: String,
    required: true
  },
  soyad: {
    type: String,
    required: true
  },
  dogumYili: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Citizen', CitizenSchema);
