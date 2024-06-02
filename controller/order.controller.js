const pool = require("../database/index");

const orderController = {
    create: async (req, res) => {
        const connection = await pool.getConnection();
        try {
            const { usuario_id, endereco_id, status_id, pedido_data, itens } = req.body;

            // Começar uma transação
            await connection.beginTransaction();

            // Inserir o pedido na tabela PEDIDO
            const insertPedidoSql = `
                INSERT INTO PEDIDO (USUARIO_ID, ENDERECO_ID, STATUS_ID, PEDIDO_DATA)
                VALUES (?, ?, ?, ?)
            `;
            const [pedidoResult] = await connection.query(insertPedidoSql, [usuario_id, endereco_id, status_id, pedido_data]);

            const pedidoId = pedidoResult.insertId;

            // Inserir os itens do pedido na tabela PEDIDO_ITEM
            const insertItemSql = `
                INSERT INTO PEDIDO_ITEM (PRODUTO_ID, PEDIDO_ID, ITEM_QTD, ITEM_PRECO)
                VALUES (?, ?, ?, ?)
            `;

            for (const item of itens) {
                const { produto_id, item_qtd, item_preco } = item;
                await connection.query(insertItemSql, [produto_id, pedidoId, item_qtd, item_preco]);
            
                const updateStockSql = `
                    UPDATE PRODUTO_ESTOQUE SET PRODUTO_QTD = PRODUTO_QTD - ? WHERE PRODUTO_ID = ?
                `;
                await connection.query(updateStockSql, [item_qtd, produto_id]);
        
            }

            // Commit da transação
            await connection.commit();
            res.json({ message: `Compra efetuada com sucesso. Número do pedido: ${pedidoId}`, pedidoId });
        } catch (error) {
            // Rollback da transação em caso de erro
            await connection.rollback();
            res.status(500).json({ message: error.message });
            console.log(error.message);
        } finally {
            connection.release();
        }
    },

    getOrdersByUserId: async (req, res) => {
        try {
            const { usuario_id } = req.params;
    
            // Query para buscar pedidos do usuário
            const selectPedidosSql = `
                SELECT 
                    p.PEDIDO_ID, 
                    p.USUARIO_ID, 
                    p.ENDERECO_ID, 
                    p.STATUS_ID, 
                    ps.STATUS_DESC,
                    p.PEDIDO_DATA 
                FROM PEDIDO p
                JOIN PEDIDO_STATUS ps ON p.STATUS_ID = ps.STATUS_ID
                WHERE p.USUARIO_ID = ?
            `;
    
            const [pedidos] = await pool.query(selectPedidosSql, [usuario_id]);
    
            // Buscar os itens de cada pedido
            for (const pedido of pedidos) {
                const selectItensSql = `
                    SELECT 
                        pi.PRODUTO_ID, 
                        pi.PEDIDO_ID, 
                        pi.ITEM_QTD, 
                        pi.ITEM_PRECO
                    FROM PEDIDO_ITEM pi
                    WHERE pi.PEDIDO_ID = ?
                `;
                const [itens] = await pool.query(selectItensSql, [pedido.PEDIDO_ID]);
                pedido.itens = itens;
            }
    
            res.json(pedidos);
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.log(error.message);
        }
    }
    
};

module.exports = orderController;