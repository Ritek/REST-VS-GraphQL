const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    id: Number,
    year: Number,
    second_language: String,
}, { collection: 'classes' });

module.exports = mongoose.model('Class', classSchema);