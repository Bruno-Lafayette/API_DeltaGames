const database = require('../database/connect');

class ProductController{
    
    // getProducts(request, response){
    //     database.select("*").table("PRODUTO").then(Products=>{
    //         console.log(Products);
    //         response.json(Products);                    
    //     }).catch(error=>{
    //         console.log(error);
    //         response.send(error)
    //     })
    // }

    getProducts(request, response) {
        database.select(
            'p.PRODUTO_ID', 
            'p.PRODUTO_NOME', 
            'p.PRODUTO_DESC', 
            'p.PRODUTO_PRECO', 
            'p.PRODUTO_DESCONTO', 
            'p.CATEGORIA_ID', 
            'c.CATEGORIA_NOME', 
            'i.IMAGEM_ID', 
            'i.IMAGEM_URL'
        )
        .from('PRODUTO as p')
        .join('CATEGORIA as c', 'p.CATEGORIA_ID', 'c.CATEGORIA_ID')
        .join('PRODUTO_IMAGEM as i', 'p.PRODUTO_ID', 'i.PRODUTO_ID')
        .then(products => {
            console.log(products);
            response.json(products);                    
        })
        .catch(error => {
            console.log(error);
            response.send(error);
        });
    }

}

module.exports = new ProductController()