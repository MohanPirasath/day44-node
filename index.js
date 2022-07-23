import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import {ObjectId} from "mongodb"



dotenv.config();

const app=express();

app.use(express.json())
app.use(cors())


const PORT=process.env.PORT

// const MONGOURL="mongodb://localhost"
const MONGO_URL=process.env.MONGO_URL


 async function Connection(){
    const Client=new MongoClient(MONGO_URL);
    await Client.connect();
    console.log("Mongo Connected")
    return(Client)
}
 export const Client= await Connection();

app.get("/",function(req,res){
    res.send("Password reset ")
})


app.post("/checkuser",async function(req,res){
    const username = req.body.username

   const userexist= await Client.db("FoodToken").collection("users").findOne({username:username})

    if(userexist){
        res.send("User exist")
    }else{
        res.send("User not found")
    }

})

app.post("/Restpassword",async function(req,res){
    const { username,Password }= req.body
    // console.log(username,Password)
    const userexist= await Client.db("FoodToken").collection("users").findOne({username:username})

    if(userexist){
     const id = userexist._id
     const readyhashedpassword= await genhashedpassword(Password)
     const data1 = await Client.db("FoodToken").collection("users").updateOne({_id:ObjectId(id)},{$set:{
        username:username,
        password:readyhashedpassword
     }})
        res.send("password updated")
    }else{
        res.send("something went worng")
    }


})


async function genhashedpassword(password) {
    const rounds = 10;
    const salt = await bcrypt.genSalt(rounds);
    // console.log(salt,"this is salt")
    const hashedpassword = await bcrypt.hash(password, salt);
    // console.log("hassed",hashedpassword);
    return hashedpassword;
  }


app.listen(PORT,()=>console.log(`App started in ${PORT}`))