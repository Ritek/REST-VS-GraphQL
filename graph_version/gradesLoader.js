const DataLoader = require('dataloader');
const Grades = require('./mongo_schema/Grades');

const gradesLoader = new DataLoader(async keys => {
    const result = await Grades.find({ id: {$in: keys} }).exec();
    const lookup = result.reduce((acc, row) => {
        acc[row.id] = row;
        return acc;
    }, {});

    return keys.map(id => lookup[id] || new Error(`No result for ${key}`));
});

module.exports = gradesLoader;