const pool = require("../database/index")

const cartController = {
    addProduct: async (req, res) => {
        try {
            const { id, product, qtd } = req.body;
    
            // Verificar se o produto já está no carrinho
            const checkIfExistsSql = "SELECT * FROM CARRINHO_ITEM WHERE USUARIO_ID = ? AND PRODUTO_ID = ?";
            const [existingRows, existingFields] = await pool.query(checkIfExistsSql, [id, product]);
    
            if (existingRows.length > 0) {
                // Se o produto já estiver no carrinho, atualize a quantidade
                const updateSql = "UPDATE CARRINHO_ITEM SET ITEM_QTD = ? WHERE USUARIO_ID = ? AND PRODUTO_ID = ?";
                await pool.query(updateSql, [qtd, id, product]);
                res.json({ message: "Quantidade do produto atualizada com sucesso." });
            } else {
                // Se o produto não estiver no carrinho, insira uma nova linha
                const insertSql = "INSERT INTO CARRINHO_ITEM (USUARIO_ID, PRODUTO_ID, ITEM_QTD) VALUES (?,?,?)";
                await pool.query(insertSql, [id, product, qtd]);
                res.json({ message: "Produto adicionado ao carrinho com sucesso." });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
            console.log(error.message);
        }
    }
    ,

    editCart: async (req, res) => {
        try {
            const { id, product, qtd } = req.body;
    
            // Verificar se o produto já está no carrinho
            const checkIfExistsSql = "SELECT * FROM CARRINHO_ITEM WHERE USUARIO_ID = ? AND PRODUTO_ID = ?";
            const [existingRows, existingFields] = await pool.query(checkIfExistsSql, [id, product]);
    
            // Se o produto não estiver no carrinho, retornar um erro
            if (existingRows.length === 0) {
                return res.status(400).json({ error: "Este produto não está no carrinho." });
            }
    
            // Iniciar uma transação
            await pool.query("START TRANSACTION");
    
            try {
                // Atualizar a quantidade do produto no carrinho
                const updateSql = "UPDATE CARRINHO_ITEM SET ITEM_QTD = ? WHERE USUARIO_ID = ? AND PRODUTO_ID = ?";
                await pool.query(updateSql, [qtd, id, product]);
    
                // Commit da transação
                await pool.query("COMMIT");
    
                res.json({ message: "Quantidade do produto atualizada com sucesso." });
            } catch (updateError) {
                // Rollback da transação em caso de erro
                await pool.query("ROLLBACK");
                throw updateError;
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
            console.log(error.message);
        }
    }
    ,

    removeProduct: async (req, res) => {
        try {
            const { id, product } = req.body;
    
            // Verificar se o produto já está no carrinho
            const checkIfExistsSql = "SELECT * FROM CARRINHO_ITEM WHERE USUARIO_ID = ? AND PRODUTO_ID = ?";
            const [existingRows, existingFields] = await pool.query(checkIfExistsSql, [id, product]);
    
            // Se o produto não estiver no carrinho, retornar um erro
            if (existingRows.length === 0) {
                return res.status(400).json({ error: "Este produto não está no carrinho." });
            }
    
            // Iniciar uma transação
            await pool.query("START TRANSACTION");
    
            try {
                // Zerar a quantidade do produto no carrinho
                const updateSql = "UPDATE CARRINHO_ITEM SET ITEM_QTD = 0 WHERE USUARIO_ID = ? AND PRODUTO_ID = ?";
                await pool.query(updateSql, [id, product]);
    
                // Commit da transação
                await pool.query("COMMIT");
    
                res.json({ message: "Produto removido do carrinho com sucesso." });
            } catch (updateError) {
                // Rollback da transação em caso de erro
                await pool.query("ROLLBACK");
                throw updateError;
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
            console.log(error.message);
        }
    },
    

    getAllProducts: async (req, res) => {
        try {
            const { id } = req.body; // Extrair o id do usuário do corpo da requisição
            const sql = "SELECT PRODUTO_ID AS product, ITEM_QTD AS qtd FROM CARRINHO_ITEM WHERE USUARIO_ID = ? AND ITEM_QTD > 0";
            const [rows] = await pool.query(sql, [id]); // Passar o id como parâmetro na consulta SQL
    
            // Mapear os resultados para o formato desejado
            const products = rows.map(row => ({
                id: row.product,
                product: row.product,
                qtd: row.qtd
            }));
    
            res.json(products); // Enviar os dados mapeados como resposta
        } catch (error) {
            res.status(500).json({ error: error.message });
            console.log(error.message);
        }
    }
    

}

module.exports = cartController