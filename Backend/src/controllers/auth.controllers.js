const userModel=require("../models/user.model");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");





/**
 * @name registerUserController
 * @description register a new user expects username,emailid,password in request params
 * @access public
 */
async function registerUserController(req,res) {

    // Destructure the request body to get desired elemnts from request.body 
    const { username, email, password}=req.body;

    // IF any one the thing is not in request body then tell to resend the requet 
    if(!username || !email || !password ){
        return res.status(400).json({
            message: 'Either username or email or password not present',
        })
    }

    // Check if any user already  exist with username or email
    const isUserAlreadyExist= await userModel.findOne({
        $or:[{ username },{ email }]
    });


    if(isUserAlreadyExist){
        return res.status(400).json({
            message: "User Already exist with the above email or username "
        })
    }

    // If user is already not registred we need to register it after encrypting its password

    const hash= await bcrypt.hash(password,10);

    const user= await userModel.create({
        username,
        email,
        password :hash
    })

    const token=jwt.sign(
        {id:user._id, username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(201).json({
        message:"User is registered",
        token,
        user:{
            id:user._id,
            username: user.username,
            email: user.email
        }
    })


}





/**
 * @name loginUserController
 * @description Used to login the user which is already registred will need the email and password
 * @access public 
 */
async function loginUserController(req,res) {

    // get the email and Passowrd from the request body
    const { email,password}=req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    // Check if user exist with given email or not 
    const user= await userModel.findOne({email});

    if(!user){
        return res.status(401).json({
            message:"User not found with this email"
        });
    }

    const isPasswordValid=await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
       return res.status(401).json({
            message:"Invalid password"
       });
    }

     const token=jwt.sign(
        {
            id:user._id,
            username:user.username
        },
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message:"User signed in successfully",
        token,
        user:{
            id:user._id,
            username: user.username,
            email: user.email
        }
    })

    
}




/**
 * @name logoutUserController
 * @description Used to logout the user
 * @access public 
 */
async function logoutUserController(req,res) {
    let token=req.cookies?.token;

    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1];
        }
    }

    if (token) {
        try {
            await tokenBlacklistModel.create({
                token
            });
        } catch (e) {
            // Ignore duplicate token in blacklist
        }
    }

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });

    res.status(200).json({
        message: "user logged out successfully"
    });
}




/**
 * @name getUserController
 * @description Used  get  the  current logged in user
 * @access public 
 */
async function getUserController(req,res) {
    const user= await userModel.findById(req.user.id);
    res.status(201).json({
        message: "user fetched successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name demoLoginController
 * @description Used to log in as a demo/recruiter account without requiring manual registration
 * @access public
 */
async function demoLoginController(req, res) {
    try {
        const demoEmail = "demo.recruiter@prepai.dev";
        const demoUsername = "DemoRecruiter";
        const demoPassword = "DemoUser@PrepAI123!";

        let user = await userModel.findOne({ email: demoEmail });

        if (!user) {
            const hash = await bcrypt.hash(demoPassword, 10);
            user = await userModel.create({
                username: demoUsername,
                email: demoEmail,
                password: hash
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Demo user signed in successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to login as demo user",
            error: error.message
        });
    }
}

module.exports={
    registerUserController,
    loginUserController,
    logoutUserController,
    getUserController,
    demoLoginController
}