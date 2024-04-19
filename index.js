const PORT = 5000;
const cors = require('cors')
const express = require("express");
const router = require('./src/routes/router')
const app = express();
app.use(cors());
app.use(express.json());
app.use(router);


app.use("/", (req, res)=>{
    res.send("Bem vindo ao Delta Games API")
})

app.listen(PORT, ()=>{
    console.log(`Aplicação rodando na porta ${PORT}`)
})
