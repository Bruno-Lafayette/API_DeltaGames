const pool = require("../database/index")

const addressController = {
    addEnd: async (req, res) => {
        try {
            const { usuario_id, nome, logradouro, numero, complemento, cep, localidade, uf } = req.body;

            const insertSql = `
                INSERT INTO ENDERECO 
                (USUARIO_ID, ENDERECO_NOME, ENDERECO_LOGRADOURO, ENDERECO_NUMERO, ENDERECO_COMPLEMENTO, ENDERECO_CEP, ENDERECO_CIDADE, ENDERECO_ESTADO) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await pool.query(insertSql, [usuario_id, nome, logradouro, numero, complemento, cep, localidade, uf]);
            res.json({ message: "Endereço adicionado com sucesso." });
        } catch (error) {
            res.status(500).json({ error: error.message });
            console.log(error.message);
        }
    },

    editEnd: async (req, res) => {
        try {
            const { endereco_id, nome, logradouro, numero, complemento, cep, localidade, uf } = req.body;

            const updateSql = `
                UPDATE ENDERECO 
                SET ENDERECO_NOME = ?, ENDERECO_LOGRADOURO = ?, ENDERECO_NUMERO = ?, ENDERECO_COMPLEMENTO = ?, ENDERECO_CEP = ?, ENDERECO_CIDADE = ?, ENDERECO_ESTADO = ?
                WHERE ENDERECO_ID = ?
            `;

            await pool.query(updateSql, [nome, logradouro, numero, complemento, cep, localidade, uf, endereco_id]);
            res.json({ message: "Endereço atualizado com sucesso." });
        } catch (error) {
            res.status(500).json({ error: error.message });
            console.log(error.message);
        }
    },

    removeEnd: async (req, res) => {
        try {
            const { endereco_id } = req.body;

            const deleteSql = "DELETE FROM ENDERECO WHERE ENDERECO_ID = ?";

            await pool.query(deleteSql, [endereco_id]);
            res.json({ message: "Endereço removido com sucesso." });
        } catch (error) {
            res.status(500).json({ error: error.message });
            console.log(error.message);
        }
    },

    getAllEnds: async (req, res) => {
        try {
            const { usuario_id } = req.body;

            const selectSql = "SELECT * FROM ENDERECO WHERE USUARIO_ID = ?";

            const [rows] = await pool.query(selectSql, [usuario_id]);

            const enderecos = rows.map(row => ({
                endereco_id: row.ENDERECO_ID,
                nome: row.ENDERECO_NOME,
                logradouro: row.ENDERECO_LOGRADOURO,
                numero: row.ENDERECO_NUMERO,
                complemento: row.ENDERECO_COMPLEMENTO,
                cep: row.ENDERECO_CEP,
                localidade: row.ENDERECO_CIDADE,
                uf: row.ENDERECO_ESTADO
            }));

            res.json(enderecos);
        } catch (error) {
            res.status(500).json({ error: error.message });
            console.log(error.message);
        }
    }
}

module.exports = addressController;
