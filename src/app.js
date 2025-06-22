import express from "express";
import {createServer} from "node:http";
import {Server} from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import { connectToSocket } from "./controllers/socketManager.js";
const app=express();
const server=createServer(app);
const io=connectToSocket(server);
const port=8000;


app.set("port",(process.env.PORT || 8000));
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true}));

app.use("/api/v1/users",userRoutes);

app.set("mongo_user");



const start=async()=>{
    const connectionDB= await mongoose.connect("mongodb+srv://zaminrashid9:C6PdCUKq88G3pgUg@cluster0.cil2lvw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("MONGO Connected DB Host: "+connectionDB.connection.host);
server.listen(app.get("port"),()=>{
    console.log("Listening at port "+port);
})
}

start();