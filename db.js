// import mysql2
const mysql = require('mysql2');

// conexao db mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'cadastroapi'
});

// conexao db
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados: ' +err.stack);
        return;
    }

    console.log('Conectado ao banco de dados com id ' +connection.threadId);
});

module.exports = connection;