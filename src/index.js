import express, { json } from "express";

const app =express();
const port=8000;
app.use(express.json())
app.get('/',(req,res)=>{
  res.send("hello i am server")
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})