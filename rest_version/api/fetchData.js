const Grades = require('../mongo_schema/Grades');
const Student = require("../mongo_schema/Student");
const Class = require("../mongo_schema/Class");
const Teacher = require("../mongo_schema/Teacher");

const {redis} = require('../redis');

const getFromRedis = async (key) => {
    if (process.env.USE_CACHE == 'true') {
        let value = await redis.getOne(key).then( result => { return JSON.parse(result); });
        if (value != null) {
            console.log('returned from cache');
            return value;
        } else return null;
    } else return null;
}

const getStudent = async (id) => {
    let value = await getFromRedis("student-" +id);
    if (value) return value;

    const student = await Student.findOne({id: id}).then(result => {
        return result.toObject();
    }).catch(err => {
        return null;
    })
    
    console.log('student returned from database!');
    if (process.env.USE_CACHE == 'true') await redis.setOne("student-" + id, JSON.stringify(student), 'NX', 'EX', process.env.CACHE_LENGTH );

    return student;
}

const getStudents = async () => {
    let students = await Student.find().sort({id: 1}).then(result => {
        return result;
    }).catch(error => {
        return null;
    });

    return students;
}

const getStudentsPaginate = async (offset = 0, limit = 10) => {
    let students = await Student.paginate({}, { offset, limit }).then(result => {
        return result;
    }).catch(error => {
        return null;
    });

    return students;
}

const getClass = async (id) => {
    let value = await getFromRedis("class-" + id);
    if (value) return value;

    let clas = await Class.findOne({id: id}).then(result => {
        return result.toObject();
    }).catch(err => {
        return null;
    });

    console.log('class returned from database!');
    if (process.env.USE_CACHE == 'true') await redis.setOne("class-" + id, JSON.stringify(clas), 'NX', 'EX', process.env.CACHE_LENGTH );

    return clas;
}

const getAllClasses = async () => {
    let classes = await Class.find().sort({id: 1}).then(result => {
        return result;
    }).catch(err => {
        return null;
    });

    return classes;
}

const getGrades = async (id) => {
    console.log('getGrades');
    let value = await getFromRedis("grades-" +id);
    if (value) return value;   

    let grades = await Grades.findOne({id: id}).then(result => {
        return result.toObject();
    }).catch(err => {
        return null;
    });

    console.log('grades returned from database!');
    if (process.env.USE_CACHE == 'true') await redis.setOne("grades-" + id, JSON.stringify(grades), 'NX', 'EX', process.env.CACHE_LENGTH );

    return grades;
}

const getAllGrades = async () => {
    let grades = await Grades.find({}).sort({ id: 1 }).then(result => {
        return result;
    }).catch(err => {
        return null;
    });

    return grades;
}

const getSomeGrades = async(array) => {
    let grades = await Grades.find({id: {$in: array}}).lean().then(result => {
        return result;
    }).catch(err => {
        return null;
    });
    
    return grades;
} 

const getTeacher = async (id) => {
    let value = await getFromRedis("teacher-" +id);
    if (value) return value;  

    let teacher = await Teacher.findOne({id: id}).then(result => {
        return result.toObject();
    }).catch(err => {
        return null;
    });

    console.log('teacher returned from database!');
    if (process.env.USE_CACHE == 'true') await redis.setOne("teacher-" + id, JSON.stringify(teacher), 'NX', 'EX', process.env.CACHE_LENGTH );

    return teacher;
}

const getTeachersConn = async (offset = 1, limit = 10) => { 
    let teachers = await Teacher.paginate({offset, limit}).then(result => {
        console.log(result);
        return result;
    }).catch(err => {
        return null;
    });

    return teachers;
}

const getTeachersAll = async () => { 
    let teachers = await Teacher.find().populate({
        path: 'classObj', populate: {
            path: 'studentObj', populate: 'gradesObj'
        }
    }).then(async result => {
        return result;
    }).catch(err => {
        return null;
    });

    return teachers;
}

module.exports = {
    getStudent,
    getStudents,
    getStudentsPaginate,

    getGrades,
    getSomeGrades,
    getAllGrades,

    getClass,
    getAllClasses,

    getTeacher,
    getTeachersConn,
    getTeachersAll
}