const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
  codigo_fazenda: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  data: { type: Date, required: true },
  volume_litros: { type: Number, required: true },
  preco: { type: Number, required: true }
});

module.exports = mongoose.model('Production', productionSchema);
