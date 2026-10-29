import mongoose from "mongoose"
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            trim: true,
            required: true,
            minLength: 8,
            maxLength: 100,
        },

    },{timestamps:true},
)

const userModel= mongoose.model("User", userSchema)

export default userModel