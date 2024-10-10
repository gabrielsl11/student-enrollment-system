// IMPORTAÇÃO DOS MÓDULOS

const { engine } = require('express-handlebars')
const express = require('express')
const mysql = require('mysql2')
const path = require('path')
const app = express()

// CONFIGURAÇÕES

// Conexão com o banco de dados
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'school'
})

// Verificando a conexão com o banco de dados
conn.connect((err) => {
    if (err) {
        console.log(`ERROR TO CONNECT: ${err}`)
    } else {
        console.log(`SUCCESSFULLY CONNECTED`)
    }
})

// Mecanismo de visualização do aplicativo (template engine)
app.engine('handlebars', engine({}))
app.set('view engine', 'handlebars')
app.set('views', './views')

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'assets')))

// Lidar com dados enviados por formulários via POST e JSON.
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// INSERÇÃO DE ROTAS

// Rota principal (Índice)
app.get('/', (req, res) => {
    let sqlStudents = `SELECT * FROM students`;
    let sqlCourses = `SELECT * FROM courses`;

    conn.query(sqlCourses, (err, courses) => {
        conn.query(sqlStudents, (err, students) => {
            res.render('index', {
                courses,
                students,
            });
        });
    });
});

// Realizando buscas
app.get('/results', (req, res) => {
    let search = req.query.search

    let sqlCourses = `SELECT * FROM courses WHERE title LIKE ? OR description LIKE ? OR duration LIKE ?`

    let searchTerm = `%${search}%`

    conn.query(sqlCourses, [searchTerm, searchTerm, searchTerm], (err, courses) => {
        if (err) {
            console.log(err)
        } else {
            let sqlStudents = `SELECT * FROM students WHERE name LIKE ? OR email LIKE ? OR date_of_birth LIKE ? OR course_title LIKE ?`

            conn.query(sqlStudents, [searchTerm, searchTerm, searchTerm, searchTerm], (err, students) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('results', {
                        courses,
                        students,
                        search
                    })
                }
            })
        }
    })
})

// Matricular estudante
app.get('/enroll', (req, res) => {
    let sql = `SELECT * FROM courses`

    conn.query(sql, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            res.render('enroll', {
                courses: results,
            })
        }
    })
})

// Matriculando estudante
app.post('/enroll', (req, res) => {
    let name = req.body.name
    let email = req.body.email
    let date_of_birth = req.body.date_of_birth
    let course_name = req.body.course_name
    let sql = `INSERT INTO students (name, email, date_of_birth, course_title) VALUES (?, ?, ?, ?)`

    conn.query(sql, [name, email, date_of_birth, course_name], (err, results) => {
        if (err) {
            res.redirect('/?enrollStudentError')
        } else {
            res.redirect('/?enrollStudentOk')
        }
    })
})

// Atualizar estudante
app.get('/updateStudent/:id', (req, res) => {
    let sql = `SELECT * FROM students WHERE id = ?`

    conn.query(sql, [req.params.id], (err, student) => {
        if (err) { console.log(err) } else {
            let sql = `SELECT * FROM courses`
            conn.query(sql, (err, courses) => {
                if (err) { console.log(err) } else {
                    res.render('updateStudent', {
                        student,
                        courses
                    })
                }
            })
        }
    })
})

// Atualizando estudante
app.post('/updateStudent', (req, res) => {
    let sql = `UPDATE students SET name = ?, email = ?, date_of_birth = ?, course_title = ? WHERE id = ?`

    conn.query(sql, [req.body.name, req.body.email, req.body.date_of_birth, req.body.course_title, req.body.id], (err, results) => {
        if (err) {
            res.redirect('/?updateStudentError')
        } else {
            res.redirect('/?updateStudentOk')
        }
    })
})

// Apagar estudante
app.get('/deleteStudent/:id', ((req, res) => {
    let sql = `DELETE FROM students WHERE id = ?`

    conn.query(sql, [req.params.id], (err, results) => {
        if (err) {
            res.redirect('/?deleteStudentError')
        } else {
            res.redirect('/?deleteStudentOk')
        }
    })
}))

// Criar curso
app.get('/create', (req, res) => {
    res.render('create')
})

// Criando curso
app.post('/create', (req, res) => {
    let title = req.body.title
    let description = req.body.description
    let duration = req.body.duration
    let sql = `INSERT INTO courses (title, description, duration) VALUES (?, ?, ?)`

    conn.query(sql, [title, description, duration], (err, results) => {
        if (err) {
            res.redirect('/?createCourseError')
        } else {
            res.redirect('/?createCourseOk')
        }
    })
})

// Atualizar curso
app.get('/updateCourse/:id', (req, res) => {
    let sql = `SELECT * FROM courses WHERE id = ?`

    conn.query(sql, [req.params.id], (err, results) => {
        if (err) { console.log(err) } else {
            res.render('updateCourse', {
                course: results
            })
        }
    })
})

// Atualizando curso
app.post('/updateCourse', (req, res) => {
    let sql = `UPDATE courses SET title = ?, description = ?, duration = ? WHERE id = ?`

    conn.query(sql, [req.body.title, req.body.description, req.body.duration, req.body.id], (err, results) => {
        if (err) {
            res.redirect('/?updateCourseError')
        } else {
            res.redirect('/?updateCourseOk')
        }
    })
})

// Apagar curso
app.get('/deleteCourse/:id', ((req, res) => {
    let sql = `DELETE FROM courses WHERE id = ?`

    conn.query(sql, [req.params.id], (err, results) => {
        if (err) {
            res.redirect('/?deleteCourseError')
        } else {
            res.redirect('/?deleteCourseOk')
        }
    })
}))

// INICIALIZANDO O SERVIDOR

const PORT = 8080
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON http://localhost:${PORT}`)
})