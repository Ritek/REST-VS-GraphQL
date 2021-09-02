const express = require("express");
const router = express.Router();

const { getClass, getTeacher, getGrades, getSomeGrades, getAllGrades } = require("./fetchData");
const Student = require('../mongo_schema/Student');

const {redis} = require('../redis');

const getClassStudents = async (id) => {
    if (process.env.USE_CACHE == 'true') {
        let value = await redis.getOne("class_students-" + id).then( result => { return JSON.parse(result); });
        if (value != null) {
            console.log('returned from cache');
            return value;
        }
    }

    let clas = await Student.find({class: id}).lean().then(result => {
        return result;
    }).catch(err => {
        return null;
    });
    
    if (process.env.USE_CACHE == 'true') await redis.setOne("class_students-" + id, JSON.stringify(clas), 'NX', 'EX', process.env.CACHE_LENGTH );

    return clas;
}

router.get("/class/:id/query", async (req, res) => {
    console.log(req.query);

    let clas = await getClass(req.params.id);
    if (req.query.student == 'true') clas.students = await getClassStudents(req.params.id); 
    if (req.query.student == 'true' && req.query.grades == 'true') {
        let ids = clas.students.map(student => student.id);
        let grades = await getSomeGrades(ids);
        for (let i=0;i<clas.students.length;i++) clas.students[i].grades = grades.find(x => x.id == clas.students[i].id);
    }
    if (req.query.teacher == 'true') clas.teacher = await getTeacher(clas.id);

    res.send( clas );
});

module.exports = router;