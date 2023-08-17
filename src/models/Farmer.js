const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  name: String,
  email: String,
  idFarm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' } // Referência à fazenda associada
});

module.exports = mongoose.model('Farmer', farmerSchema);
