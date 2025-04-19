const { Client } = require('pg')
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'opd_db',
  password: 'password',
  port: 5432,
})

client.connect(function(err) {
  if (err) throw err;
  console.log("Database connected!");
});

client.query(`Select * from users`, (err, res)=>{
    if (!err){
        users = res.rows;
        exports.client = users;
    }
    else{
        console.log(err.message)
    }
})


client.query(`Select * from products`, (err, res)=>{
    if (!err){
        items = res.rows;
        exports.client = items;
    }
    else{
        console.log(err.message)
    }
})


client.query(`Select * from categories`, (err, res)=>{
    if (!err){
        categories = res.rows;
        exports.client = categories;
    }
    else{
        console.log(err.message)
    }
})

client.query(`Select * from data_sources`, (err, res)=>{
    if (!err){
        data_sources = res.rows;
        exports.client = data_sources;
    }
    else{
        console.log(err.message)
    }
})

client.query(`Select * from favorites`, (err, res)=>{
    if (!err){
        favorites = res.rows;
        exports.client = favorites;
    }
    else{
        console.log(err.message)
    }
})

client.query(`Select * from scrape_logs`, (err, res)=>{
    if (!err){
        scrape_logs = res.rows;
        exports.client = scrape_logs;
    }
    else{
        console.log(err.message)
    }
})

client.query(`Select * from shops`, (err, res)=>{
    if (!err){
        shops = res.rows;
        exports.client = shops;
    }
    else{
        console.log(err.message)
    }
})

client.end;