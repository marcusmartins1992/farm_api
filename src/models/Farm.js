const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  nome: String,
  distancia_km: Number,
});

module.exports = mongoose.model('Farm', farmSchema);
