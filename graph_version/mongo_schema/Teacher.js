const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const teacherSchema = new mongoose.Schema({
    id: Number,
    first_name: String,
    last_name: String,
    email: String,
    subject: String,
}, { collection: 'teachers' });

/* teacherSchema.virtual('class', {
    ref: 'Class',
    localField: 'id',
    foreignField: 'id',
    justOne: true
}); */

/* 
var autoPopulate = function(next) {
    this.populate('class');
    next();
};

teacherSchema.pre('findOne', autoPopulate);
teacherSchema.pre('find', autoPopulate);
*/

teacherSchema.set('toObject', { virtuals: true });
teacherSchema.set('toJSON', { virtuals: true });

teacherSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Teacher', teacherSchema);