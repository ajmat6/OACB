const express = require('express');
const router = express.Router(); // for routing
const jwt = require('jsonwebtoken'); // importing jwt for sending token to the user
const bcrypt = require('bcrypt') // importing brcrypt for password hashing
const User = require('../models/User'); // importing User model
const fetchuser = require('../middleware/fetchuser.js') // importing fetchuser middleware
const {body, validationResult} = require('express-validator'); // express validator for validation the user
const {validateSignupRequest, validateSigninRequest, isRequestValidated} = require('../validators/validate'); // importing validators
const shortid = require('shortid');
const { userMiddleware, adminMiddleware } = require('../middleware/userMiddleware.js');
const { default: mongoose } = require('mongoose');
const upload = require('../middleware/uploadMiddleware');
const VerificationToken = require('../models/verification');
const { generateOTP, mailTransport, emailTemplate, resetPasswordTemplate } = require('../utils/mail');
const ResetPassword = require('../models/resetPassword');
const crypto = require('crypto'); // used for genderating random token for reset password
const { createRandomBytes } = require('../utils/helper');

// API end point for signup: POST Request -> to create an account:
router.post('/signup', validateSignupRequest, isRequestValidated, async (req,res) => { /// using validateRequest(array) and isRequestValidated as midddleware defined in validators folder
    try
    {
        const alreadyUser = await User.findOne({email: req.body.email})
        
        if(alreadyUser) return res.status(400).json({
            message: "User already exist"
        })
    
        const {
            name,
            username,
            email,
            password
        } = req.body;

        // password hashing:
        const salt = await bcrypt.genSalt(10); // generating salt of 10 characters
        const hash_password = await bcrypt.hash(password, salt) // hashing password with generated salt
    
        const _user = await new User({
            name,
            username,
            email,
            hash_password,
            username,
            role: 'user'
        })

        // generating OTP for email verification and storing hashed OTP in backend for comparison:
        const OTP = generateOTP(); 
        const verificationToken = await new VerificationToken({
            user: _user._id,
            token: OTP
        })
    
        await verificationToken.save();
        await _user.save();

        mailTransport().sendMail({
            from: 'oldaryaconnect@gmail.com',
            to: _user.email,
            subject: "Verify your Email!",
            html: emailTemplate(OTP)
        })

        //Token data that we want to send to the user (here id of the user)
        const data = {
            user:{
                id: _user._id,
                role: _user.role
            }
        }

        const authToken = jwt.sign(data, process.env.JWT_SECRET);

        res.status(201).json({
            token: authToken,
            user: {
                name,
                username,
                email,
                role: 'user',
                _id: _user._id,
                profilePic: ''
            }
        })
    }
    
    catch (error) {
        console.log(error.message); //method to print the error (error.message)
        res.status(500).send("Some Internal Server Error Occured! Please try again after some time");
    }
})


// API end point for signin: POST Request -> to login
router.post('/signin', validateSigninRequest, isRequestValidated, async (req,res) => {
    try
    {
        // Find user if exist:
        const user = await User.findOne({email: req.body.email});
    
        // if user not exist:
        if(!user || user.role !== 'user')
        {
            return res.status(400).json({
                message: "Please enter valid credentials!"
            })
        }

        const comparePassword = await bcrypt.compare(req.body.password, user.hash_password);

        if(!comparePassword)
        {
            return res.status(400).json({
                message: "Please enter valid credentials"
            })
        }


        const data = {
            user: {
                id: user._id,
                role: user.role // assigning role to validate in fetching the category
            }
        }

        const token = jwt.sign(data, process.env.JWT_SECRET, {expiresIn: '24hr'});

        // sending response to the user: Here fullName will be set by virtual
        const { name, username, email, role, _id} = user;

        res.status(200).json({
            token,
            user: {
                name,
                username,
                email,
                role,
                _id,
                gender: user.gender ? user.gender: '',
                contact: user.contact ? user.contact : '',
                profilePic: user.profilePicture ? user.profilePicture : '',
            }
        })
    }

    catch (error) {
        console.log(error.message); //method to print the error (error.message)
        res.status(500).send("Some Internal Server Error Occured! Please try again after some times");
    }
})

router.post('/user/verify-email', async (req, res) => {
    try
    {
        if(!req.body.otp || !req.body.userId) return res.status(400).json({message: "Please Enter valid Credentials"});
        else
        {
            req.body.user = req.body.userId;
            const user = await User.findById(req.body.userId);
            if(!user) return res.status(401).json({message: "No user found!, Please try again"})
            if(user.verified) return res.status(401).json({message: "Account already verified!"})

            const verifyToken = await VerificationToken.findOne({user: req.body.userId})
            if(!verifyToken) res.status(401).json({message: "Some error occured, Please try again!"})

            const isMatched = await verifyToken.compareToken(req.body.otp); 
            if(!isMatched) res.status(401).json({message: "Please Enter Valid OTP"});

            // verifying the user:
            user.verified = true;

            // delete token from database if user is verified and save user:
            await VerificationToken.findOneAndDelete(verifyToken._id);
            await user.save();

            const data = {
                user: {
                    id: user._id,
                    role: user.role // assigning role to validate in fetching the category
                }
            }
    
            const token = jwt.sign(data, process.env.JWT_SECRET, {expiresIn: '24hr'});
    
            // sending response to the user: Here fullName will be set by virtual
            const { name, username, email, role, _id} = user;

            return res.status(200).json({
                token,
                user: {
                    name,
                    username,
                    email,
                    role,
                    _id,
                    gender: user.gender ? user.gender: '',
                    contact: user.contact ? user.contact : '',
                    profilePic: user.profilePicture ? user.profilePicture : '',
                }
            })
        }
    }
    catch (error) {
        console.log(error.message); //method to print the error (error.message)
        res.status(500).send("Some Internal Server Error Occured! Please try again after some time");
    }
})

// API end point to handle users request for password change:
router.post('/user/forgot-password', async (req, res) => {
    try
    {
        const email = req.body.email;
        if(!email) return res.status(400).json({message: "Please provide Email!"});

        // checking for email exist:
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).json({message: "This email is not registered!"});

        // check if there is already a resetPassoword token in resetPassword collection with that email:
        // if present than user can try after one hour for that token:
        const alreadyReset = await ResetPassword.findOne({user: user._id});
        if(alreadyReset) return res.status(400).json({message: "Try Again After 1 Hour"});

        const token = await createRandomBytes();

        const resetPassoword = new ResetPassword({ user: user._id, token })
        await resetPassoword.save();

        mailTransport().sendMail({
            from: 'oldaryaconnect@gmail.com',
            to: email,
            subject: "Reset password request for your oldaryaconnect account!",
            html: resetPasswordTemplate(`${process.env.FRONTEND_URL}/forgot-password/token=${token}/id=${user._id}`) // sending url for reset password:
        })

        // if email is sent to the requested email, showing message to the user of it:
        return res.status(200).json({message: "Check your entered email box for the reset password link!"});
    }
    catch (error) {
        console.log(error.message); //method to print the error (error.message)
        res.status(500).send("Some Internal Server Error Occured! Please try again after some time");
    }
})

// API end point of actually changing user's password:
router.post('/user/reset-password', async (req, res) => {
    try
    {
        const {token, userId} = req.body;

        // find user if there is any of that id:
        const user = await User.findById(userId);
        if(!user) return res.status(400).json({message: "User against this request is not found"});

        // find if there is a token in resetToken collection of that user:
        const resetToken = await ResetPassword.findOne({user: user._id});
        if(!resetToken) return res.status(400).json({message: "Please verify your email first for token!"});

        // if token available of that user, than match it with stored token:
        const matchToken = await resetToken.compareToken(token);
        if(!matchToken) return res.status(400).json({message: "Token not valid! Please try again!"});

        // now here you can change the user's password:
        // compare request password with already stored password:
        const comparePassword = await bcrypt.compare(req.body.password, user.hash_password);
        if(comparePassword) return res.status(400).json({message: "New Password cannot be same as old one"})

        // password hashing:
        const salt = await bcrypt.genSalt(10); // generating salt of 10 characters
        const hash_password = await bcrypt.hash(req.body.password, salt) // hashing password with generated salt
        user.hash_password = hash_password;
        await user.save();

        // delete reset password token:
        ResetPassword.findOneAndDelete({user: user._id});

        // sending final success response of password change:
        res.status(200).json({message: "Password Successfully Changed!"});
    }
    catch (error) {
        console.log(error.message); //method to print the error (error.message)
        res.status(500).send("Some Internal Server Error Occured! Please try again after some time");
    }
})

// API end point to sign out an admin:
router.post('/signout', async (req ,res) => {
    try
    {
       res.clearCookie('token') // clearing cookie named token
       res.status(200).json({
        message: "Sign Out Successfully"
       })
    }

    catch
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some times");
    }
})


// API end point for signin: POST Request -> to login
router.post('/profile', fetchuser, async (req, res) => {
    try
    {
        // finding user by its ID:
        const userId = req.user.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    } 
    catch (error)
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some times");    
    }
})

// API end point to update users info:
router.post('/user/update', fetchuser, userMiddleware, upload.single('profilePicture'), async (req, res) => {
    try
    {
        if(req.body)
        {
            const userId = new mongoose.Types.ObjectId(req.user.id);
            const updateFields = {};

            if(req.body.name) updateFields.name = req.body.name;
            if(req.body.username) updateFields.username = req.body.username;
            if(req.body.gender) updateFields.gender = req.body.gender;
            if(req.body.email) updateFields.email = req.body.email;
            if(req.body.contact) updateFields.contact = req.body.contact;

            // if images are also there for edit in request body:
            if(req.file)
            {
                console.log(req.file)
                updateFields.profilePicture = req.file.filename
            }

            const updatedInfo = await User.findOneAndUpdate({_id: userId}, {
                "$set": updateFields
            }, {new: true})
        
        
            res.status(200).json({
                user: {
                    name: updatedInfo.name,
                    username: updatedInfo.username,
                    email: updatedInfo.email,
                    role: updatedInfo.role,
                    _id: updatedInfo._id,
                    gender: updatedInfo.gender ? updatedInfo.gender : "",
                    contact: updatedInfo.contact ? updatedInfo.contact : "",
                    profilePic: updatedInfo.profilePicture ? updatedInfo.profilePicture : ""
                }
            })
        }
    
        else
        {
            return res.status(400).json({error: "Params required"})
        }
    }

    catch (error)
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some times");    
    }
})

router.post('/google/login', async (req, res) => {
    const {idToken} = req.body;
    console.log(idToken);
})


// Authentication for the admin:


// API end point for signup: POST Request -> to create an account:
router.post('/admin/signup', validateSignupRequest, isRequestValidated, async (req,res) => {
    
    // Finding the user:
    try
    {
        const alreadyUser = await User.findOne({email: req.body.email})
        
        // if user already exist then show this message:
        if(alreadyUser) return res.status(400).json({
            message: "Admin already exist"
        })
    
        // if user is not present then create its account:
    
        // Destructuring and extracting elements from the req.body:
        const {
            name,
            username,
            email,
            password
        } = req.body;

        // password hashing:
        const salt = await bcrypt.genSalt(10); // generating salt of 10 characters
        const hash_password = await bcrypt.hash(password, salt)
    
        const _user = await new User({
            name,
            username,
            email,
            hash_password,
            role: 'admin'
        })
    
        // Saving the document(a particular of the users collection) in the DB:
        await _user.save();

        //Token data that we want to send to the user (here id of the user)
        const data = {
            user:{
                id: _user._id,
                role: _user.role
            }
        }

        const authToken = jwt.sign(data, process.env.JWT_SECRET);

        // sending cookie to the browser: (name of cookie , value of cookie, object which is taking cookie expiry time)
        res.cookie('token', authToken, {expiresIn: '24hr'});

        res.status(200).json({
            token: authToken,
            user: _user,
            message: "User Created Succesfully"
        })
    }
    
    catch (error) {
        console.log(error.message); //method to print the error (error.message)
        res.status(500).send("Some Internal Server Error Occured! Please try again after some times");
    }

})


// API end point for signin: POST Request -> to login
router.post('/admin/signin', validateSigninRequest, isRequestValidated, async (req,res) => {

    try
    {
        // Find user if exist:
        const user = await User.findOne({email: req.body.email});
    
        // if user not exist:
        if(!user || user.role !== 'admin')
        {
            return res.status(400).json({
                message: "Please enter valid credentials!"
            })
        }

        // password check:
        const comparePassword = await bcrypt.compare(req.body.password, user.hash_password);

        // if password are not equal:
        if(!comparePassword)
        {
            return res.status(400).json({
                message: "Please enter valid credentials"
            })
        }


        const data = {
            user: {
                id: user._id,
                role: user.role
            }
        }

        const token = jwt.sign(data, process.env.JWT_SECRET, {expiresIn: '24hr'});

        // sending response to the user: Here fullName will be set by virtual
        const { name, username, email, role, _id} = user;

        res.status(200).json({
            token,
            user: {
                name,
                username,
                email,
                role,
                _id
            }
        })
    }
    catch (error) {
        console.log(error.message); //method to print the error (error.message)
        res.status(500).send("Some Internal Server Error Occured! Please try again after some times");
    }
})

// API end point to sign out an admin:
router.post('/admin/signout', async (req ,res) => {
    try
    {
       res.clearCookie('token') // clearing cookie named token
       res.status(200).json({
        message: "Sign Out Successfully"
       })
    }

    catch
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some times");
    }
})


router.get('/getUsers', fetchuser, adminMiddleware, async (req, res) => {
    const allUsers = await User.find({});
    if(allUsers) return res.status(200).json(allUsers);
    else return res.status(400).json({message: "No users Found"})
})

module.exports = router;