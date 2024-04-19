var knex = require('knex')({
  client: 'mysql2',
  connection: {
    host       : '144.22.157.228',
    port       : 3306,
    user       : 'delta',
    database   : 'Delta',
    password   : 'delta'
  }  
})
module.exports = knex