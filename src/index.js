
import "dotenv/config";

import express, { json } from "express";
console.log("DB URL exists:", !!process.env.DATABASE_URL);

const app =express();
const port=8000;
app.use(express.json())
app.get('/',(req,res)=>{
  res.send("hello i am server")
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})