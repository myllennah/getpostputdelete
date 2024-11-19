const express = require('express');
const bodyParser = require('body-parser');

// middleware para usar PUT e DELETE com POST
const methodOverride = require('method-override');

const app = express();
const port = 5000;

//import db connection
const db = require("./db");

// use express.json for json parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// config express / ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// allows express to understand PUT and DELETE via '_method'
app.use(methodOverride('_method'));

//servir public
app.use(express.static('public'));

// rota index
app.get('/', (req, res) => {
    db.query('SELECT* FROM users', (err, results) => {
        if(err){
            console.error('Erro ao consultar usuários', err);
            return res.status(500).json({error: 'Erro ao consultar usuários.'});
        }
        res.render('index', { users: results });
    })
});

//rota form new user
app.get('/add', (req, res) => {
    res.render('add');
});

// rota create new user (post)
app.post('/add', (req, res) => {
    const {name, age} = req.body;
    console.log('Dados recebidos: ', req.body);

    db.query('INSERT INTO users(name, age) VALUES(?,?)', [name, age], (err, result) =>{
        if(err){
            console.log('Erro ao adicionar usuário', err);
            return res.status(500).json({error: 'Erro ao adicionar usuário'});
        }
        res.redirect('/');
    });
});

// rota form edit user
app.get('/edit/:id', (req, res) => {
    const {id} = req.params;

    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if(err){
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ error: 'Erro ao buscar usuário'});
        }
        if(results.length === 0){
            return res.status(404).json({error: 'Usuário não encontrado'});
        }
        res.render('edit', { user: results[0] });
    });
});

app.put('/edit/:id', (req, res) => {
    const { id } = req.params;
    const {name, age} = req.body;

    //validaçao dos dados
    if (!name || !age) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.'});
    }

    db.query('UPDATE users SET name = ?, age = ? WHERE id = ?', [name, age, id], (err, result) => {
        if(err) {
            console.error('Erro ao atualizar usuário: ', err);
            return res.status(500).json({ error: 'Erro ao atualizar o usuário'});
        }
        if (result.affectedRows === 0) {
            return res.status(404).jason({ error: 'Usuário não encontrado'});
        }
        res.redirect('/');
    }); 
});

// rota delete
app.delete('/delete/:id', (req,res) =>{
    const { id } = req.params;
    //log de depuração
    console.log(`Tentando excluir usuário com id: ${id}`);

    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if(err){
            console.error('Erro ao excluir usuário', err);
            return res.status(500).json({ error: 'Erro ao excluir usuário'});
        }
        if(result.affectedRows === 0){
            return res.status(404).json({ error: 'Usuário não encontrado'})
        }
        res.redirect('/');
    });
});

// iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});