require('dotenv').config();
const express = require("express");
const student = require('./api/student');
const grades = require('./api/grades');
const clas = require('./api/class'); 
const teacher = require('./api/teacher'); 

const mongoose = require('mongoose');

const app = express();
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(student);
app.use(grades);
app.use(clas);
app.use(teacher);

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.listen(3000);
  console.log("Server running on http://localhost:3000/");
});