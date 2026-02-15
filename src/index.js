
import "dotenv/config";
import http from 'http'
import express from "express";
import { matchRouter } from "./routes/matches.js";
import { attachWebSocketServe } from "./ws/server.js";
console.log("DB URL exists:", !!process.env.DATABASE_URL);

const app= express();
const PORT= Number(process.env.PORT || 8000) ;
const HOST=process.env.HOST || '0.0.0.0';

app.use(express.json())

const server=http.createServer(app);
app.get('/',(req,res)=>{
  res.send("hello i am server")
})

app.use('/matches',matchRouter)

const {broadCastMatchCreated}=attachWebSocketServe(server);
app.locals.broadCastMatchCreated=broadCastMatchCreated;

server.listen(PORT,HOST,()=>{
  const baseUrl=HOST==="0.0.0.0"? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
    console.log(`server is running on port ${baseUrl}`)
})