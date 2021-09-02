const DataLoader = require('dataloader');
const Student = require('./mongo_schema/Student');

const studentLoader = new DataLoader(async keys => {
    const result = await Student.find({ id: {$in: keys} }).exec();
    const lookup = result.reduce((acc, row) => {
        acc[row.id] = row;
        return acc;
    }, {});

    return keys.map(id => lookup[id] || new Error(`No result for ${key}`));
}); 

module.exports = studentLoader;