const Student = require('../mongo_schema/Student');
const Teacher = require('../mongo_schema/Teacher');
const Class = require('../mongo_schema/Class');
const { populate } = require('../mongo_schema/Student');
const { makeExecutableSchema } = require('graphql-tools')

const RootResolver = {
    student: async (args) => {
       
        //console.log('roots: ', roots);
        //console.log('args: ', args);
        /* console.log('context: ', context.fieldNodes);
        console.log('info: ', info);  */


/*         let student = await Student.findOne({id: args.id}).populate({path: 'class', populate: {path: 'teacher'}}).exec().then(result => {
            console.log(result);
            let temp = result.toObject();
            console.log(typeof(temp));
            return temp;
        }).catch(error => {
            console.log(error);
            return null;
        });

        return student; 
*/

/*         let student = await Student.findOne({id: args.id}).then(async result => {
            //console.log(result);
            let temp = await Class.findOne({id: result.class_id}).then(result2 => {
                //console.log(result2);
                return result2;
            });

            result.class = temp;

            return result;
        }).catch(error => {
            console.log('error: ', error);
            return null;
        });

        console.log(student); */
        let student = await Student.findOne({id: args.id}).then(result => {
            return result;
        }).catch(error => {
            return null;
        })
        return student;
    },

/*     teacher: async (args) => {
        console.log(args);
        let teacher = await Teacher.findOne({id: args.id}).then(result => {
            return result.toObject();
        }).catch(error => {
            console.log(error);
            return null;
        });

        return teacher;
    },

    class: async (args) => {
        console.log('class resolver!');
        let clas = await Class.findOne({id: args.id}).then(result => {
            return result.toObject();
        }).catch(error => {
            console.log(error);
            return null;
        });

        return clas;
    } */

}

module.exports = RootResolver;