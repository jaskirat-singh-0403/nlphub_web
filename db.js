const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("./Members.db",(err)=>{
    if(err){
        console.log(err)
    }
    console.log("Connected to database")
})
module.exports= db