const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/Canteen")
.then(()=>{
    console.log("mongodb connected");
})
.catch(()=>{
    console.log("Failed connection");
})

const LogInSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})



const collection=new mongoose.model("LogIn",LogInSchema)

module.exports=collection
