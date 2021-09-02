const express = require("express");
const router = express.Router();
const Teacher = require('../mongo_schema/Teacher');

const { getClass, getTeacher, getTeachersAll, getSomeGrades, getAllGrades, getAllClasses } = require("./fetchData");
const Student = require('../mongo_schema/Student');

const getClassStudents = async (id) => {
    return await Student.find({class: id}).lean().then(result => {
        return result;
    }).catch(err => {
        return null;
    });    
}

router.get("/teacher/:id/query", async (req, res) => {
    console.log(req.query);

    let teacher = await getTeacher(req.params.id);
    if (req.query.class == 'true') teacher.class = await getClass(req.params.id);
    if (req.query.student == 'true') teacher.class.students = await getClassStudents(teacher.id);
    if (req.query.grades == 'true') {       
        for (let i=0;i<teacher.class.students.length;i++) teacher.class.students[i] = teacher.class.students[i].toObject();
        let ids = teacher.class.students.map(student => student.id);
        let grades = await getSomeGrades(ids);
        for (let i=0;i<teacher.class.students.length;i++) teacher.class.students[i].grades = grades.find(x => x.id == teacher.class.students[i].id);
    }

    res.send( teacher );
});

router.get("/teachers/query", async (req, res) => {
    //console.log(req.query);

    let teachers = await getTeachersAll();

    if (req.query.class == 'true') {
        let classes = await getAllClasses();
        for (let i=0;i<teachers.length;i++) {
            teachers[i].class = classes[i];
            if (req.query.student == 'true') teachers[i].class.students = await getClassStudents(teachers[i].id);
        }
    }

    if (req.query.class == 'true' && req.query.grades == 'true') {
        let grades = await getAllGrades();
        for (let i=0;i<teachers.length;i++) {
            for (let j=0;j<teachers[i].class.students.length;j++) {
                teachers[i].class.students[j] = teachers[i].class.students[j];
                teachers[i].class.students[j].grades = grades.find(x => x.id == teachers[i].class.students[j].id);
            }
        }
    }

    res.send( teachers );
});

/* router.get("/teachers/query2", async (req, res) => {
    console.log(req.query);

    let popClass = undefined;
    if (req.query.class == 'true') popClass = {path: 'classObj'};
    if (req.query.students == 'true' && popClass != undefined) popClass.populate = {path: 'studentObj'};
    if (req.query.grades == 'true' && popClass.populate != undefined) popClass.populate.populate = {path: 'gradesObj'};

    let teachers = await Teacher.find().populate(popClass);

    res.send( teachers );
}); */

module.exports = router;