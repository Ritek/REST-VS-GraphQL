const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const teacherSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        validate: {
            validator: Number.isInteger,
            message: 'Key id has to be an iteger'
        }
    },
    first_name: {
        type: String,
        required: [true, 'Field first_name is required!'],
        min: [3, "Field first_name has to be at lest 3 characters long!"],
        max: [12, "Field first_name has to be shorter than 12 characters!"],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z\s]+$/.test(v);
            },
            message: "Not a valid name!"
        }
    },
    last_name: {
        type: String,
        required: [true, 'Field last_name is required!'],
        min: [3, "Field last_name has to be at lest 3 characters long!"],
        max: [12, "Field last_name has to be shorter than 12 characters!"],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z\s]+$/.test(v);
            },
            message: "Not a valid email!"
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        min: [5, "Email has to be at lest 5 characters long!"],
        max: [15, "Email has to be shorter than 15 characters!"],
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "Not a valid email!"
        }
    },
    subject: {
        type: String,
        required: [true, 'Subject is required!'],
        validate: {
            validator: function(v) {
                return ['mathematics', 'science', 'chemistry', 'geography', 'first_language', 'second_language'].includes(v);
            },
            message: "Not a valid subject! List of valid subjects: [mathematics, science, chemistry, geography, first_language, second_language]",
        }
    }
}, { collection: 'teachers' });

teacherSchema.virtual('classObj', {
    ref: "Class",
    localField: 'id',
    foreignField: 'id',
    justOne: true
});

teacherSchema.set('toObject', { virtuals: true });
teacherSchema.set('toJSON', { virtuals: true });

teacherSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Teacher', teacherSchema);