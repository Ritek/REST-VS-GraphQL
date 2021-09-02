module.exports = `
type Query {
  grades(id: Int): Grades
  student(id: Int): Student
  class(id: Int): Class
  teacher(id: Int): Teacher

  students(offset: Int!, limit: Int!): [Student]
  studentsAll: [Student]
  studentsDataLoader(offset: Int!, limit: Int!): [Student2]

  studentsConn(offset: Int!, limit: Int!): StudentConnection
  getEverything: [Teacher]
}
type Student {
  id: Int
  class: Class
  grades: Grades
  first_name: String
  last_name: String
  gender: String
  email: String
}
type Student2 {
  id: Int
  class: Class
  grades: Grades
  first_name: String
  last_name: String
  gender: String
  email: String
}

type StudentConnection {
  edges: [Student]
  pageInfo: PageInfo
}

type PageInfo {
  totalCount: Int
  totalPages: Int
  nextPage: Int
  prevPage: Int
}



type Class {
  id: Int
  year: Int
  second_language: String
  teacher: Teacher
  students: [Student]
}


type Teacher {
  id: Int
  class: Class
  first_name: String
  last_name: String
  email: String
  subject: String
}
type TeacherConnection {
  edges: [Teacher]
  pageInfo: PageInfo
}


type Grades {
  id: Int,
  mathematics: Float,
  science: Float,
  chemistry: Float,
  geography: Float,
  first_language: Float,
  second_language: Float,
  art: Float
}
input GradesInput {
  id: Int,
  mathematics: Float,
  science: Float,
  chemistry: Float,
  geography: Float,
  first_language: Float,
  second_language: Float,
  art: Float
}
input StudentInput {
  id: Int!
  class: Int!
  first_name: String!
  last_name: String!
  gender: String!
  email: String!
  grades: GradesInput
}
type UpdateStatus {
  n: Int
  nModified: Int
  ok: Int
}
type Mutation {
  newStudent(input: StudentInput!): String
  updateGrades(input: GradesInput): UpdateStatus
  deleteStudent(id: Int!): String
}
`;