const pool = require("../database/index")

const produtosController = {
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("SELECT p.PRODUTO_ID, p.PRODUTO_NOME, p.PRODUTO_DESC, p.PRODUTO_PRECO, p.PRODUTO_DESCONTO, p.CATEGORIA_ID, c.CATEGORIA_NOME, JSON_ARRAYAGG(i.IMAGEM_URL) AS IMAGENS_URL, e.PRODUTO_QTD FROM PRODUTO p JOIN CATEGORIA c ON p.CATEGORIA_ID = c.CATEGORIA_ID JOIN PRODUTO_IMAGEM i ON p.PRODUTO_ID = i.PRODUTO_ID LEFT JOIN PRODUTO_ESTOQUE e ON p.PRODUTO_ID = e.PRODUTO_ID WHERE p.PRODUTO_ATIVO = 1 AND e.PRODUTO_QTD > 0 GROUP BY p.PRODUTO_ID, p.PRODUTO_NOME, p.PRODUTO_DESC, p.PRODUTO_PRECO, p.PRODUTO_DESCONTO, p.CATEGORIA_ID, c.CATEGORIA_NOME, e.PRODUTO_QTD;");
            console.log(rows[0].PRODUTO_NOME)
            res.json(rows)
        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("select * from PRODUTO where id = ?", [id])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    },
    create: async (req, res) => {
        try {
            const { title, content } = req.body
            const sql = "insert into posts (title, content) values (?, ?)"
            const [rows, fields] = await pool.query(sql, [title, content])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    },
    update: async (req, res) => {
        try {
            const { title, content } = req.body
            const { id } = req.params
            const sql = "update posts set title = ?, content = ? where id = ?"
            const [rows, fields] = await pool.query(sql, [title, content, id])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    }, 
    delete: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("delete from posts where id = ?", [id])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    }

}

module.exports = produtosController