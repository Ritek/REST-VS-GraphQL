const express = require("express");
const router = express.Router();
const Grades = require('../mongo_schema/Grades');
const {redis} = require('../redis');

const { getStudent, getGrades, getClass, getTeacher } = require("./fetchData");
const { updateGrades } = require("./mutateData");

router.get("/grades/:id/query", async (req, res) => {
    console.log(req.query);

    let grades = await getGrades(req.params.id); 
    if (req.query.student) grades.student = await getStudent(req.params.id, "-_id");
    if (req.query.class && req.query.student) grades.student.class = await getClass(grades.student.class, "-_id");
    if (req.query.teacher && req.query.class && req.query.student) grades.student.class.teacher = await getTeacher(grades.student.class.id, "-_id");

    res.send( grades );
});

router.post("/grades/:id/update", async (req, res) => {
    let result = await updateGrades(req.params.id, req.body);
    
    res.send(result);
});

module.exports = router;