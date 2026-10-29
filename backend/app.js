import express from"express"
import dotenv from "dotenv"
dotenv.config()
import "./config/connectDB.js"
import publicRegister from "./controllers/public/register.js"
import publicLogin from "./controllers/public/login.js"
import authMiddleware from "./middleware/auth.js"
import privateTodo from "./controllers/private/todo.js"
import cors from "cors"

const app= express()
app.use(cors({
    origin:"http://localhost:5500"
}))

const port = process.env.PORT||5000
app.use(express.json())
app.get("/health", async(req,res)=>{
    res.status(200).json({msg:"This APi is running"})
})



app.use("/register",publicRegister)
app.use("/login", publicLogin)
app.use("/todo", authMiddleware,privateTodo)


app.listen(port, ()=>{
    console.log(`The server is running at http://localhost/:${port}`)
})