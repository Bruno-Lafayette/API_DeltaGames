const express = require("express")
const app = express()

require('dotenv').config()

app.use(express.urlencoded({extended: false}))
app.use(express.json())

const postsRouter = require('./routes/posts.router')
const authRouter = require('./routes/auth.router')
const cartRouter = require("./routes/cart.router")

app.use("/api/v1/products", postsRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/cart", cartRouter)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log("Server is running....")
})