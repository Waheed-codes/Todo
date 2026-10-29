import express from "express"
import userModel from "../../model/User.js"
import bcrypt from "bcrypt"

const router = express.Router()
router.post("/create-user", async(req,res)=>{
    try {
        let {email,password}= req.body
        let existingUser= await userModel.findOne({
            email
        });
        if(existingUser){
            return res.status(400).json({msg:"User already exists"})
        }

        let hashedPassword= await bcrypt.hash(password,10)

        let newuser= await userModel.create({email,
            password:hashedPassword
    })
        res.status(201).json
        ({msg:"User created successfully"})
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({msg:"Internal Server Error"})
    }
})


export default router