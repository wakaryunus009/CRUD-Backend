const User = require("../models/userSchema");

//register user
exports.register = async(req, res)=>{
    try {

        const {name, email, password} = req.body;

        const prevUser = await User.findOne({email})

        if(prevUser){
            return res.json({
                message: "Email already exists"
            })
        }

        const user = await User.create({name, email, password});

        res.status(201).json({
            message: "REgistered",
            user
        })
    } catch (error) {
        res.status(500).json({
            error
        })       
    }
}

//login user
exports.login = async (req, res)=>{
    try {

        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.json({
                message: "User not found"
            })
        }

        const isMatch = await user.ComparePassword(password);

        if(!isMatch){
            return res.json({
                message: "Invalid login credentials"
            })
        }

        const token = await user.genarateToken();
        let options = {
            expires: new Date(Date.now() + 1000*60*60*24*10),
            httpOnly: true
        }

        res.status(200).cookie("token", token, options).json({
            message: "Login successfull"
        })
        
    } catch (error) {
        res.status(500).json({
            error
        })        
    }
}


//get profile
exports.profile = async(req, res)=>{
    try {

        // const user = await User.findById(req.user._id);

        res.status(200).json({
            user: req.user
        })

    } catch (error) {
        res.json({
            error
        })        
    }
}

//update user
exports.updateProfile = async(req, res)=>{
    try {

        const {name, email, password} = req.body;

        //fetch user by id
        const user = await User.findById(req.user._id);

        if(name){
            user.name = name;
        }
        if(email){
            user.email = email;
        }

        if(password){
            user.password = password;
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated !"
        })
        
    } catch (error) {
        res.status(500).json({
            error: error.message
        })        
    }
}

//delete user
exports.deleteProfile = async(req, res)=>{
    try {

        const user = req.user;

        let options = {
            expires: new Date(Date.now()),
            httpOnly: true
        }

        await user.remove();

        res.status(200).cookie("token", null, options).json({
            message: "profile deleted",
        })
        
    } catch (error) {
        res.status(500).json({
            error: error.message
        })        
    }
}