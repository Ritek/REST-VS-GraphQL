const express = require("express");
const router = express.Router();

const Student = require('../mongo_schema/Student');
const Grades = require('../mongo_schema/Grades');

const { getStudent, getGrades, getClass, getTeacher, getStudentsPaginate, getStudents, getSomeGrades } = require("./fetchData");
const { deleteStudent } = require("./mutateData");

router.get("/student/:id/query", async (req, res) => {
    console.log(req.params.id);
    console.log(req.query);

    let student = await getStudent(req.params.id);
    if (req.query.grades == 'true') student.grades = await getGrades(req.params.id);
    if (req.query.class == 'true') student.class = await getClass(student.class);
    if (req.query.teacher == 'true') student.class.teacher = await getTeacher(student.class.id);

    res.send( student );
});

router.get("/students/query", async (req, res) => {
    let offset = req.query.offset - 1;
    let limit = req.query.limit;

    if (offset < 0) return res.status(400).send("Offset has to be larger than 0!");

    let students = await getStudentsPaginate(offset, limit);
    let {docs, ...rest} = students;

    if (req.query.grades == 'true') {
        ids = [];
        docs.forEach(student => ids.push(student.id));

        grades = await getSomeGrades(ids);
        console.log(grades);
        for (let i=0;i<docs.length;i++) {
            docs[i] = docs[i].toObject();
            docs[i].grades = grades.find(x => x.id == docs[i].id);
        }
    }

    res.send( docs );
});

router.get("/students_conn/query", async (req, res) => {
    let offset = req.query.offset - 1;
    let limit = req.query.limit;

    if (offset < 0) return res.status(400).send("Offset has to be larger than 0!");

    let students = await getStudentsPaginate(offset, limit);
    let {totalDocs, totalPages, nextPage, prevPage, docs} = students;

    if (req.query.grades == 'true') {
        ids = [];
        docs.forEach(student => ids.push(student.id));
        
        grades = await getSomeGrades(ids);
        console.log(grades);
        for (let i=0;i<docs.length;i++) {
            docs[i] = docs[i].toObject();
            docs[i].grades = grades.find(x => x.id == docs[i].id);
        }
    }

    let obj = {
        edges: docs,
        pageInfo: {
            totalCount: totalDocs,
            totalPages: totalPages,
            nextPage: nextPage,
            prevPage: prevPage
        }
    }

    res.send( obj );
});

router.get("/students_all/query", async (req, res) => {
    let students = await getStudents();
    res.send( students );
});

router.post("/student/new", async (req, res) => {
    //console.log(req.body);

    let newStudent = req.body;
    let newGrades = null;
    if ( req.body.grades !== undefined && typeof req.body.grades == 'object') {
        newGrades = req.body.grades;
        newGrades.id = newStudent.id;
        newStudent.grades = newStudent.id;
    } else {
        res.status(400).send("There was a problem with grades object");
    }

    try {
        const student = new Student(newStudent);
        const grades = new Grades(newGrades);

        let savedStudent = await student.save();
        if (newStudent.grades != undefined) saveGrades = await grades.save();
      } catch (err) {
        if (err.code == 11000) {
            return res.status(400).send(`Duplicate key id of ${newStudent.id}`);
        }
        else return res.status(400).send("Could not finish operation!");
      }

    res.status(200).send("New student added");
});

router.delete("/student/:id/delete", async (req, res) => {
    try {
        let result = await deleteStudent(req.params.id);
    } catch(err) {
        return res.status(400).send("Could not delete student!");
    }

    res.status(200).send("Student deleted!");
});

module.exports = router;