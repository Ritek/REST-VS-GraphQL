const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const Grades = require('./Grades');

const studentSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator: Number.isInteger,
            message: 'Value has to be an iteger'
        }
    },
    class: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: 'Value has to be an iteger'
        }
    },
    grades: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: 'Value has to be an iteger'
        }
    },
    first_name: {
        type: String,
        required: [true, 'Name is required!'],
        min: [3, "Name has to be at lest 3 characters long!"],
        max: [12, "Name has to be shorter than 12 characters!"],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z\s]+$/.test(v);
            },
            message: "Not a valid name!"
        }
    },
    last_name: {
        type: String,
        required: [true, 'Surname is required!'],
        min: [3, "Surname has to be at lest 3 characters long!"],
        max: [12, "Surname has to be shorter than 12 characters!"],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z\s]+$/.test(v);
            },
            message: "Not a valid surname!"
        }
    },
    gender: {
        type: String,
        required: [true, 'Gender is required!'],
        validate: {
            validator: function(v) {
                return ['male', 'female'].includes(v);
            },
            message: "Not a valid gender!"
        }
    },
    email: {
        type: String,
        required: [true, 'Surname is required!'],
        min: [5, "Email has to be at lest 5 characters long!"],
        max: [15, "Email has to be shorter than 15 characters!"],
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "Not a valid email!"
        }
    },
}, { collection: 'students' });

studentSchema.pre('remove', {document: true, query: false}, async function() {
    console.log(this.id);
    await Grades.deleteOne({id: this.id});
});

studentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Student', studentSchema);