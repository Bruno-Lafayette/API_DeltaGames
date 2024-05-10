const pool = require("../database/index")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authController = {

    getUsers: async (req, res)=> {
        try {
            const [rows] = await pool.query("select * from USUARIO")
            res.json({
                rows
            }) 
        } catch (error) {
            res.json({
                error: error.message
            })        
        }
    },

    register: async (req, res) => {
        try {
            const { userEmail, password, name, cpf } = req.body
            const [user, ] = await pool.query("select * from USUARIO where USUARIO_EMAIL = ?", [userEmail])
            if (user[0]) return res.json({ message: "Email already exists!" })
            
            const hash = await bcrypt.hash(password, 10)
            console.log(email, password, name, cpf)
            const sql = "insert into USUARIO (USUARIO_NOME, USUARIO_EMAIL, USUARIO_SENHA, USUARIO_CPF) values (?, ?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [name, userEmail, hash, cpf])

            if (rows.affectedRows) {
                return res.json({ message: "Ok" })
            } else {
                return res.json({ message: "Error" })
            }
            
        } catch (error) {
            console.log(error)
            res.json({
                message: error.message
            })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const [user, ] = await pool.query("select * from USUARIO where USUARIO_EMAIL = ?", [email])
            if (!user[0]) return res.json({ message: "Usuario ou senha incorreto"  })
            
            const { 
                USUARIO_SENHA: hash, 
                USUARIO_ID: id, 
                USUARIO_NOME: name, 
                USUARIO_EMAIL: userEmail, 
                USUARIO_CPF: cpf } = user[0]

            const check = await bcrypt.compare(password, hash)

            if (check) {
                const accessToken = jwt.sign({ userId: id }, '3812932sjad34&*@', { expiresIn: '1h' });
                return res.json({ 
                    id, name, userEmail, cpf, password
                 })

            }
            return res.json({ message: "Usuario ou senha incorreto" })
        } catch (error) {
            console.log(error)
            res.json({
                message: error.message
            })
        }
    },
}

module.exports = authController