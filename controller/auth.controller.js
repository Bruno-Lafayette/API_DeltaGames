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
            const { email, password, name, cpf } = req.body
            const [user, ] = await pool.query("select * from USUARIO where USUARIO_EMAIL = ?", [email])
            if (user[0]) return res.json({ error: "Email already exists!" })
            
            const hash = await bcrypt.hash(password, 10)
            console.log(email, password, name, cpf)
            const sql = "insert into USUARIO (USUARIO_NOME, USUARIO_EMAIL, USUARIO_SENHA, USUARIO_CPF) values (?, ?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [name, email, hash, cpf])

            if (rows.affectedRows) {
                return res.json({ message: "Ok" })
            } else {
                return res.json({ error: "Error" })
            }
            
        } catch (error) {
            console.log(error)
            res.json({
                error: error.message
            })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const [user, ] = await pool.query("select * from USUARIO where USUARIO_EMAIL = ?", [email])
            if (!user[0]) return res.json({ error: "Invalid email!" })
            
            const { USUARIO_SENHA: hash, 
                USUARIO_ID: id, 
                USUARIO_NOME: name, 
                USUARIO_EMAIL: user_email, 
                USUARIO_CPF: cpf } = user[0]

            const check = await bcrypt.compare(password, hash)

            if (check) {
                const accessToken = jwt.sign({ userId: id }, '3812932sjad34&*@', { expiresIn: '1h' });
                return res.json({ 
                    // accessToken,
                    // data: { 
                    //     userId: id,
                    //     name,
                    //     email
                    // }
                    id, name, user_email, cpf
                 })

            }

            return res.json({ error: "Wrong password!" })
            
        } catch (error) {
            console.log(error)
            res.json({
                error: error.message
            })
        }
    },
}

module.exports = authController