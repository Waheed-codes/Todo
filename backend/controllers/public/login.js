import express from "express"
import bcrypt from "bcrypt"
import userModel from "../../model/User.js"
import tokenize from "../../utils/token.js"

const router= express.Router()

router.post("/login-user", async(req,res)=>{
    try {
        let {email,password}= req.body
        let existingUser= await userModel.findOne({email})

        if(!existingUser){
            return res.status(404).json({msg:"User does not exists"})
        }

        let isValidPassword = await bcrypt.compare(password,existingUser.password)

        if(!isValidPassword){
            return res.status(401).json({msg:"Invalid Credentials"})

        }

        let token =await tokenize({id:existingUser._id})

        res.status(200).json({token:token,msg:"Log in successfull"})
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
})
export default router