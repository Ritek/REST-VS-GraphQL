const Grades = require('../mongo_schema/Grades');
const Student = require('../mongo_schema/Student');

const {redis} = require('../redis');

const updateGrades = async (id, newData) => {
    let result = await Grades.updateOne({id: id}, { $set: newData });
    await redis.deleteOne(`grades-${id}`);

    return result;
}

const deleteStudent = async (id) => {
    let result = await Student.findOne({id: id}, async (err, doc) => {
        await doc.remove();
    });
    await redis.deleteOne(`student-${id}`);

    return result;
}

module.exports = {
    updateGrades,
    deleteStudent,
}