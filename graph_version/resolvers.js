const mongoose = require('mongoose');
const Student = require('./mongo_schema/Student')
const Class = require('./mongo_schema/Class')
const Teacher = require('./mongo_schema/Teacher');
const Grades = require('./mongo_schema/Grades');
const studentLoader = require('./studentLoader');
const gradesLoader = require('./gradesLoader');

const resolvers = {
  Query: {
    student: async(_, args, {req, redis}) => {
      let value = await redis.getOne("student-" + args.id).then( result => { return JSON.parse(result); });
      if (value != null) {
        return value;
      }
      
      let student = await Student.findOne({id: args.id}).then(result => {
        return result;
      }).catch(error => {
        return null;
      });

      if (process.env.USE_CACHE == 'true') await redis.setOne("student-" + args.id, JSON.stringify(student), 'NX', 'EX', process.env.CACHE_LENGTH );

      return student;
    },
    students: async(_, args, {req, redis}) => {
      let students = await Student.paginate({}, {offset: args.offset, limit: args.limit}).then(result => {
        return result;
      }).catch(error => {
        return null;
      });

      return students.docs;
    },
    studentsAll: async() => {
      let students = await Student.find({}).then(result => {
        return result;
      }).catch(error => {
        return null;
      });

      return students;
    },
    studentsConn: async(_, args, {req, redis}) => {
      let edges = await Student.paginate({}, {offset: args.offset || 1, limit: args.limit || 10}).then(result => {
        return result;
      }).catch(error => {
        return null;
      });

      return {
        edges: edges.docs,
        pageInfo: {
          totalCount: edges.totalDocs,
          totalPages: edges.totalPages,
          nextPage: edges.nextPage,
          prevPage: edges.prevPage
        }
      }
    },
    studentsDataLoader: async(_, args, {name, req, redis}) => {
      let ids = Array.from({length: args.limit}, (_, i) => i + args.offset);
      const students = await studentLoader.loadMany(ids);

      return students;
    },


    class: async(_, args, {req, redis}) => {
      let value = await redis.getOne("class-" + args.id).then( result => { return JSON.parse(result); });
      if (value != null) return value;

      let clas = await Class.findOne({id: args.id}).then(result => {
        return result;
      }).catch(error => {
        return null;
      });

      if (process.env.USE_CACHE == 'true') await redis.setOne("class-" + args.id, JSON.stringify(clas), 'NX', 'EX', process.env.CACHE_LENGTH );

      return clas;
    },


    teacher: async(_, args, {name, req, redis}) => {
      let value = await redis.getOne("teacher-" + args.id).then( result => { return JSON.parse(result); });
      if (value != null) return value;

      let teacher = await Teacher.findOne({id: args.id}).then(result => {
        return result;
      }).catch(error => {
        return null;
      });

      if (process.env.USE_CACHE == 'true') await redis.setOne("teacher-" + args.id, JSON.stringify(teacher), 'NX', 'EX', process.env.CACHE_LENGTH );

      return teacher;
    },
    getEverything: async(_, args, {req, redis}) => {
      let teachers = await Teacher.find({}).then(result => {
        return result;
      }).catch(error => {
        return null;
      });

      return teachers;
    },

    grades: async(_, args, {req, redis}) => {
      let value = await redis.getOne("grades-" + args.id).then( result => { return JSON.parse(result); });
      if (value != null) return value;

      let grades = await Grades.findOne({id: args.id}).then(result => {
        return result;
      }).catch(error => {
        return null;
      });

      if (process.env.USE_CACHE == 'true') await redis.setOne("grades-" + args.id, JSON.stringify(grades), 'NX', 'EX', process.env.CACHE_LENGTH );

      return grades;
    }
  },

  Student: {
    async class(parent, args, {name, req, redis}) {
      let value = await redis.getOne("class-" + parent.class).then( result => { return JSON.parse(result); });
      if (value != null) return value;

      let clas = await Class.findOne({id: parent.class}).then(result => {
        return result;
      }).catch(error => {
        return null;
      });

      if (process.env.USE_CACHE == 'true') await redis.setOne("class-" + args.id, JSON.stringify(clas), 'NX', 'EX', process.env.CACHE_LENGTH );

      return clas;
    },
    async grades(parent, args, {req, redis}) {
      let value = await redis.getOne("grades-" + parent.grades).then( result => { return JSON.parse(result); });
      if (value != null) return value;

      //console.log('grades', parent.grades);
      let grades = await Grades.findOne({id: parent.id}).then(result => {
        return result;
      }).catch(error => {
          return null;
      });

      if (process.env.USE_CACHE == 'true') await redis.setOne("grades-" + parent.grades, JSON.stringify(grades), 'NX', 'EX', process.env.CACHE_LENGTH );

      return grades;
    }
  },
  Student2: {
    async grades(parent, args, {name, req, redis}) {
      const grades = await gradesLoader.load(parent.grades);

      return grades;
    }
  },

  Teacher: {
    async class(parent, args, {name, req, redis}) {
      let value = await redis.getOne("class-" + parent.id).then( result => { return JSON.parse(result); });
      if (value != null) return value;

      let clas = await Class.findOne({id: parent.id}).then(result => {
        return result;
      }).catch(error => {
          return null;
      });

      if (process.env.USE_CACHE == 'true') await redis.setOne("class-" + parent.grades, JSON.stringify(clas), 'NX', 'EX', process.env.CACHE_LENGTH );

      return clas;
    }
  },

  Class: {
    async teacher(parent, args, {name, req, redis}) {
      let value = await redis.getOne("teacher-" + parent.id).then( result => { return JSON.parse(result); });
      if (value != null) return value;

      let teacher = await Teacher.findOne({id: parent.id}).then(result => {
          return result;
      }).catch(error => {
          return null;
      });

      if (process.env.USE_CACHE == 'true') await redis.setOne("teacher-" + parent.grades, JSON.stringify(teacher), 'NX', 'EX', process.env.CACHE_LENGTH );

      return teacher;
    },
    async students(parent, args, {req, redis}) {
      let value = await redis.getOne("class_students-" + parent.id).then( result => { return JSON.parse(result); });
      if (value != null) return value;

      let students = await Student.find({class: parent.id}).then(result => {
          return result;
      }).catch(error => {
          return null;
      });

      if (process.env.USE_CACHE == 'true') await redis.setOne("student-" + parent.grades, JSON.stringify(students), 'NX', 'EX', process.env.CACHE_LENGTH );

      return students;
    }
  },

  Mutation: {
    newStudent: async ( _, {input} ) => {

      let newStudent = input;
      let newGrades = input.grades;
      newStudent.grades = input.id;
      newGrades.id = input.id;

      try {
        const student = new Student(newStudent);
        const grades = new Grades(newGrades);

        let savedStudent = await student.save();
        if (newStudent.grades != undefined) saveGrades = await grades.save();
      } catch (err) {
        if (err.code == 11000) throw new Error(`Duplicate key id of ${newStudent.id}`);
        else throw new Error(err);
      }

      return "Student created!";
    },
    updateGrades: async (_, {input}, {redis} ) => {
      let temp = {...input};
      delete temp.id;

      let result = await Grades.updateOne({id: input.id}, { $set: temp });
      await redis.deleteOne(`grades-${input.id}`);

      return result;
    },
    deleteStudent: async (_, {id}, {redis} ) => {  
      await Student.findOne({id: id}).then(async (doc, err) => {
        await doc.remove();
      });
      await redis.deleteOne(`student-${id}`);

      return "Student deleted!"
    }
  }
}

module.exports = resolvers;