const pool = require("../database/index")

const cartController = {
    addProduct: async (req, res) => {
        try {    
            const {id, product, qtd} = req.body
            const sql = "INSERT INTO CARRINHO_ITEM (USUARIO_ID, PRODUTO_ID, ITEM_QTD) VALUES (?,?,?)"
            const [rows, fields] = await pool.query(sql, [id, product, qtd])
            res.json({rows})
            console.log("funcionou porra")
        }catch(error){
            res.json({
                error: error.message
            })
            console.log(error.message)
        }
    },

    editCart: async(req, res) => {
        try {

        }catch(error){
            res.json({
                error: error.message
            })
        }

    },

    removeProduct: async(req, res) => {
        try {

        }catch(error){
            res.json({
                error: error.message
            })
        }
    },
    

    getAllProducts: async(req, res) => {
        try {
            const [rows] = await pool.query("select * from CARRINHO_ITEM")
            res.json({
                rows
            }) 
        }catch(error){
            res.json({
                error: error.message
            })
        }

    }

}

module.exports = cartController