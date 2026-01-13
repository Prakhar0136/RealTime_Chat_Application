import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import {generateToken} from '../lib/utils.js'
import {sendWelcomeEmail} from '../emails/emailHandlers.js'
import {ENV} from '../lib/env.js' 
import cloudinary from '../lib/cloudinary.js'


export const signup = async (req,res)=>{
    const {fullName,email,password} = req.body;
try{
    if(!fullName || !email || !password){
        return res.status(400).json({message:"all fields are required"})   
    }
    if(password.length <6){
        return res.status(400).json({message:"password must be at least 6 characters"})
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({message:"invalid email format"})
    }  

    const user =  await User.findOne({email}) 
    if(user) return res.status(400).json({message:"email already exists"}) 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = new User({
        fullName,
        email,
        password:hashedPassword,
    })

    if(newUser){
        generateToken(newUser._id,res)
        await newUser.save();

        const savedUser = await newUser.save()
        generateToken(savedUser._id,res)

        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic,
        })

        try{
            await sendWelcomeEmail(savedUser.email,savedUser.fullName,ENV.CLIENT_URL)
        }
        catch(error){
            console.error("Failed to send welcome email:",error)
        }
    }
    else{
        res.status(400).json({message:"invalid user data"})
    }
}
catch(error){
    console.log("error in signup controller",error)
    res.status(500).json({message:"internal server error"})
}
}

export const login = async (req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return  res.status(400).json({message:"all fields are required"})
    }
    
    try{
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message:"invalid credentials"})
        
            const isPasswordCorrect = await bcrypt.compare(password,user.password)
            if(!isPasswordCorrect) return res.status(400).json({message:"invalid credentials"})
            
            generateToken(user._id,res)
            res.status(200).json({
                _id:user._id,
                fullName:user.fullName,
                email:user.email,
                profilePic:user.profilePic,
            })
    }
    catch(error){
        console.error("error in login controller",error )
        res.status(500).json({message:"internal server error"})
    }
}

export const logout = (_,res)=>{
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"logged out successfully"})
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    console.log("1. Request received for user:", userId);
    
    if (!profilePic) {
      console.log("Error: No profilePic provided");
      return res.status(400).json({ message: "Profile pic is required" });
    }

    console.log("2. Starting Cloudinary upload...");
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        resource_type: "auto",
        timeout: 120000 
    });
    console.log("3. Upload successful:", uploadResponse.secure_url);

    console.log("4. Updating Database...");
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    console.log("5. Success!");
    res.status(200).json(updatedUser);

  } catch (error) {
   
    console.error("CRITICAL ERROR in updateProfile:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
