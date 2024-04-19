const PORT = 4000;
const cors = require('cors')
const express = require("express");
const router = require('./src/routes/router')
const app = express();
app.use(cors());
app.use(express.json());
app.use(router);


app.listen(PORT, ()=>{
    console.log(`Aplicação rodando na porta ${PORT}`)
})

app.get('/', (req, res)=>{
    res.send("olá mundo")
})