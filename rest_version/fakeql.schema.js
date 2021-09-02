const Student = require('./mongo_schema/Student');
const Grades = require('./mongo_schema/Grades');
const Class = require('./mongo_schema/Class');
const Teacher = require('./mongo_schema/Teacher');

schemas = {
    student: Student,
    grades: Grades,
    class: Class,
    teacher: Teacher
};

const checkKeys = (keys, name) => {
    console.log(name);
    console.log(keys);
    const keyArray = Object.keys(keys);

    const schemaKeys = Object.keys(schemas[name].schema.paths);
    let x = keyArray.every( key => schemaKeys.includes(key) );

    return x;
}

const getData = async (keys, schema) => {
    let x = await schemas[schema].findOne().then(result => {
        return result;
    });

    return x;
}

const fakeql = async (obj) => {
    let objectTypes = Object.keys(obj);

    let temp = objectTypes.every( object => checkKeys(obj[object], object) );
    if (!temp) return null;

    let root = {};
    
    for (const object of objectTypes) {
        root[object] = await getData(obj[object], object) 
    }
    console.log('root:', root);
    return root
}

module.exports = fakeql;