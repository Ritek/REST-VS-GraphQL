const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: [true, 'Class has to have an id!'],
        validate: {
            validator: Number.isInteger,
            message: 'Key id has to be an iteger'
        }
    },
    year: {
        type: Number,
        required: [true, 'Class has to have a year!'],
        validate: {
            validator: Number.isInteger,
            message: 'Key year has to be an iteger'
        }
    },
    second_language: {
        type: String,
        required: [true, 'Class has to have a second language!'],
        enum: ['German', 'French', 'Spanish'],
    }
}, { collection: 'classes' });

classSchema.virtual('teacherObj', {
    ref: 'Teacher',
    localField: 'id',
    foreignField: 'id',
    justOne: true
});

classSchema.virtual('studentObj', {
    ref: 'Student',
    localField: 'id',
    foreignField: 'class',
    justOne: false
});

classSchema.set('toObject', { virtuals: true });
classSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Class', classSchema);