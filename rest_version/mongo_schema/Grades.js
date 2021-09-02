const mongoose = require('mongoose');

const gradesSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        validate: {
            validator: Number.isInteger,
            message: 'Key id has to be an iteger'
        }
    },
    mathematics: {
        type: Number,
        min: [2, "Grade has to be bigger or equal 2!"],
        max: [5, "Grade has to be smaller or equal 5!"],
    },
    science: {
        type: Number,
        min: [2, "Grade has to be bigger or equal 2!"],
        max: [5, "Grade has to be smaller or equal 5!"],
    },
    chemistry: {
        type: Number,
        min: [2, "Grade has to be bigger or equal 2!"],
        max: [5, "Grade has to be smaller or equal 5!"],
    },
    geography: {
        type: Number,
        min: [2, "Grade has to be bigger or equal 2!"],
        max: [5, "Grade has to be smaller or equal 5!"],
    },
    first_language: {
        type: Number,
        min: [2, "Grade has to be bigger or equal 2!"],
        max: [5, "Grade has to be smaller or equal 5!"],
    },
    second_language: {
        type: Number,
        min: [2, "Grade has to be bigger or equal 2!"],
        max: [5, "Grade has to be smaller or equal 5!"],
    },
    art: {
        type: Number,
        min: [2, "Grade has to be bigger or equal 2!"],
        max: [5, "Grade has to be smaller or equal 5!"],
    },
}, { collection: 'grades' });

gradesSchema.virtual('studentObj', {
    ref: 'Student',
    localField: 'id',
    foreignField: 'id',
    justOne: true
});

gradesSchema.set('toObject', { virtuals: true });
gradesSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Grades', gradesSchema);