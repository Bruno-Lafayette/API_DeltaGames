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
            }

            // Commit da transação
            await connection.commit();
            res.json({ message: "Pedido criado com sucesso.", pedidoId });
        } catch (error) {
            // Rollback da transação em caso de erro
            await connection.rollback();
            res.status(500).json({ message: error.message });
            console.log(error.message);
        } finally {
            connection.release();
        }
    }
};

module.exports = orderController;
