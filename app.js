require("dotenv").config();
const express=require('express');
const app=express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());


const connectingToMongodb=require('./connection');
const path = require('path');
const port=3000;

app.set("view engine","ejs");
app.set("views", path.resolve("views"))
const routepath=require('./routes/auth');
const staticroutepath=require('./staticroutes');
app.use(express.json())
app.use(express.urlencoded({extended:false}));

connectingToMongodb("mongodb://127.0.0.1:27017/task2")
  .then(() => {
    console.log("MongoDB connected");
    
    // Temporary code to create the database by inserting a fake document
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    db.collection('temp').insertOne({ fake: true, message: "This is a temporary document to make the database appear" }, (err, result) => {
      if (err) {
        console.log("Error inserting fake document:", err);
      } else {
        console.log("Fake document inserted - database should now appear in mongosh");
        
        // Now delete the fake document
        db.collection('temp').deleteOne({ fake: true }, (err, result) => {
          if (err) {
            console.log("Error deleting fake document:", err);
          } else {
            console.log("Fake document deleted");
          }
        });
      }
    });
  })
  .catch((err) => {
    console.log("DB connection error:", err);
  });


app.use('/authorize',routepath);










app.use('/',staticroutepath);








app.listen(port,()=>{
    console.log(`server listening on ${port}`);
})