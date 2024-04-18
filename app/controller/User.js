const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require('nodemailer');
const Userotp = require("../models/userotp")
const User = require("../models/users")
const TokenModel = require("../models/token")
const communityUserModel = require("../models/communityuser")
const bcrypt = require('bcrypt');
const walletTransictionModel = require("../models/walletTransiction");
const walletModel = require("../models/wallets")
// const uuid = require('uuid');
const Seed = require('../models/seedword');
const bip39 = require('bip39');
const bip32 = require('bip32');
const bitcoin = require('bitcoinjs-lib');
const axios = require('axios');

const crypto = require('crypto');
const communityuserModel = require("../models/communityuser");
const communityusertoken = require("../models/communityusertoken");
const categoryModel = require("../models/category");
const tagsModel = require("../models/tags");
const topicModel = require("../models/topic");
const mongoose = require('mongoose');
const { CastError } = mongoose.Error;
const BankDetails = require('../models/bankdetalis');
const { communitytoken } = require('../middleware/communityauth');
const commentModel = require("../models/comment");
const blogModel = require("../models/blogs");
const userToken = require("../models/token");
const admin = require('../middleware/firebase');
// const Infobip = require('infobip-nodejs');
const { Infobip, AuthType } = require('@infobip-api/sdk');
const fcmTokenModel = require("../models/fcmtoken");
const { fetchAndSaveNews } = require("../news/newsService");
const News = require("../models/news");
const { Console } = require("console");
const WalletTransactionBit = require("../models/wallettansactionbit");
const https = require('follow-redirects').https;
// const admin = require('firebase-admin');
// const serviceAccount = require('../../aslcrypto-firebase-adminsdk-9qs3j-e081f28ad7.json');
// const upload = require('../middleware/multer');
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     storageBucket: 'gs://aslcrypto.appspot.com', // Replace with your storage bucket URL
// });

// Create a storage instance
// const storage = admin.storage();

module.exports.get_user_otp = async (req, res) => {
    try {

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpirationMinutes = 30;
        const email = req.body.email;
        const phonenumber = req.body.phonenumber
        if (!email && !phonenumber) {
            return res.status(400).json({ status: "Fail", message: "Email or phonenumber are required" });
        }

        const datauser = await User.findOne({ email, phonenumber })

        // if (datauser) {
        //     return res.status(400).json({ status: "Fail", message: "Email or phonenumber already used" });
        // }

        // console.log("OTP", otp);
        // console.log("EMAIL", req.body.email);
        // console.log("phonenumber", req.body.phonenumber);

        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + otpExpirationMinutes);

        const otpdata = {
            email,
            phonenumber,
            otp,
            expiresAt: expirationTime
        };



        const data = await Userotp.findOne({
            $or: [
                { email: email || null },
                { phonenumber: phonenumber || null }
            ]
        });
        // console.log(data, ">>>>>>>DATA");
        if (data) {
            data.email = email
            data.phonenumber = phonenumber
            data.otp = otp
            data.expiresAt = expirationTime;
            await data.save()
        } else {
            await Userotp.create(otpdata);
        }


        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: 'wsinfo08317@gmail.com',
                pass: 'fsxotpganytczpno'
            },
            tls: {rejectUnauthorized: false}
        });

        if (email) {
            await transporter.sendMail({
                from: 'wsinfo08317@gmail.com',
                to: email,
                subject: 'Your OTP Code',
                text: `Your OTP code is: ${otp}`
            });
        }

        return res.status(200).json({ status: "Success", message: 'OTP sent successfully', data: otp });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
};

//   const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   };
//   const sendOTPViaEmail = async (email, otp) => {
//     const message = `Your OTP is: ${otp}`;

//     const emailRequest = {
//       from: 'your@email.com',
//       to: email,
//       subject: 'OTP Verification',
//       text: message,
//     };

//     const response = await infobip.email.sendEmail(emailRequest);
//     console.log(response);
//   };
// const infobip = new Infobip({
//     apiKey: 'd21dc05921222560f3d6c3426c18922a-25b4fa43-7f4e-41d4-bf57-f7ee1d019b51',
//   });



// const isProduction = false;
// const infobip = new Infobip(APIKEY, isProduction, {
//     authType: 'basic',
//     username: 'Aslcrypto', // Infobip Username used for registration
//     password: 'Avatar@12345', // Infobip Password used for registration
//     encrypted: false,
//     baseHost: '1vw421.api.infobip.com',
// });
// let infobip = new Infobip({
//     baseUrl: "https://1vw421.api.infobip.com",
//     apiKey: "d21dc05921222560f3d6c3426c18922a-25b4fa43-7f4e-41d4-bf57-f7ee1d019b51",
//     authType: AuthType.ApiKey,
//   });
// const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
// };

// const sendOTP = async (phoneNumber) => {
//     try {
//         const otpCode = generateOTP();
//         console.log("otp", otpCode);
//         const messageTemplate = `Your OTP is: ${otpCode}. Please use this code to complete your verification process. Do not share this code with anyone.`;
//         console.log("msgtem", messageTemplate);
//         console.log("infobip", infobip);

//         let response = await infobip.channels.sms.send({
//             // messages: [
//             //     {
//             //         from: "447860099299",
//             //         to: phoneNumber,
//             //         content: {
//             //             text: messageTemplate,
//             //         },
//             //     },
//             // ],
//             messages: [{
//                 destinations: [{ "to": phoneNumber }],
//                 from: "447491163443",
//                 text: messageTemplate
//                 }]
//           });
//         // console.log("Full Response:", response);

//         console.log('OTP sent successfully',response);
//         console.log('response',response.data.messages);
//         return otpCode;
//     } catch (error) {
//         console.error('Error sending OTP:', error);
//         throw error;
//     }
// };

// module.exports.get_user_otp = async (req, res) => {
//     const phoneNumber = req.body.phonenumber;
//     console.log('phone', phoneNumber);

//     if (!phoneNumber) {
//         return res.status(400).json({ error: 'Phone number is required' });
//     }

//     try {
//         const otpCode = await sendOTP(phoneNumber);
//         console.log('Generated OTP code:', otpCode);
//         return res.json({ success: true, otpCode });
//     } catch (error) {
//         console.error('Error:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// };

// module.exports.user_otp_verify = async (req, res) => {
//     try {
//         const { email, otp, phonenumber } = req.body
//         // console.log(req.body, "bodyreqnew");
//         const userverify = await Userotp.findOne({
//             $or: [
//                 { email: email || null },
//                 { phonenumber: phonenumber || '' }
//             ], otp
//         })
//         if (!email && !phonenumber) {
//             return res.status(400).json({ status: "Fail", message: "User not found" });
//         }
//         if (!otp) {
//             return res.status(400).json({ status: "Fail", message: "OTP are required" });
//         }

//         if (!userverify) {
//             return res.status(400).json({ status: "Fail", message: "Invalid OTP" });
//         }
//         console.log(userverify, "verify");

//         const currentTime = new Date();
//         if (currentTime > userverify.expiresAt) {
//             return res.status(400).json({ status: "Fail", message: "OTP has expired" });
//         }
//         let findField = {};
//         if (email) {
//             findField.email = email
//         } else {
//             findField.phonenumber = phonenumber
//         }
//         const user = await User.findOne(findField);
//         // console.log(user.signup,"user");

//        if(user.signup === true) {

//         const token = jwt.sign({ userId: user._id, email: user.email}, process.env.JWT_KEY, {expiresIn :'6h'});

//         await TokenModel.create({ token });
//         return res.status(200).json({ status: "Success", message: 'User logged in successfully', token });

//        } else {
//         return res.status(200).json({
//             status: "success", message:"OTP verify successfully", data:user
//         });
//        }
//         if (userverify) {

//             const data = await User.create({ email, phonenumber })
//             if (userverify.email) {
//                 console.log(userverify.email);
//                 data.emailstatus = true
//                 await data.save()
//                 //   console.log(datauser,"user");
//             }
//             await Userotp.findOneAndDelete({ email, otp, phonenumber })

//             return res.status(200).json({ status: "Success", message: 'OTP verify successfully', data: data });
//         }
//         else {
//             return res.status(400).json({ status: "Fail", message: 'Invalid OTP' });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ status: "Fail", message: "Internal server error" });
//     }
// }

module.exports.user_otp_verify = async (req, res) => {
    try {
        const { email, otp, phonenumber } = req.body;

        const userverify = await Userotp.findOne({
            $or: [
                { email: email || null },
                { phonenumber: phonenumber || '' }
            ],
            otp
        });

        if (!email && !phonenumber) {
            return res.status(400).json({ status: "Fail", message: "User not found" });
        }

        if (!otp) {
            return res.status(400).json({ status: "Fail", message: "OTP is required" });
        }

        if (!userverify) {
            return res.status(400).json({ status: "Fail", message: "Invalid OTP" });
        }

        const currentTime = new Date();
        if (currentTime > userverify.expiresAt) {
            return res.status(400).json({ status: "Fail", message: "OTP has expired" });
        }

        let findField = {};
        if (email) {
            findField.email = email;
        } else {
            findField.phonenumber = phonenumber;
        }

        let user = await User.findOne(findField);

        if (!user) {
            user = await User.create({ email, phonenumber });
        }

        if (userverify.email) {
            user.emailstatus = true;
            await user.save();
        }

        await Userotp.findOneAndDelete({ email, otp, phonenumber });

        if (user.signup === true) {
            const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_KEY, { expiresIn: '2160h' });
            await TokenModel.create({ token });
            return res.status(200).json({ status: "Success", message: 'User logged in successfully', token });
        } else {
            return res.status(200).json({ status: "Success", message: 'OTP verify successfully', data: user });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
};

module.exports.user_signup = async (req, res) => {
    try {

        // if (user) {


        // upload.fields([{ name: 'frontimage', maxCount: 1 }, { name: 'backimage', maxCount: 1 },{name:'selfieimage',maxCount: 1 }])(req, res, async (err) => {
        // if (err) {
        //     console.error(err);
        //     return res.status(500).json({ status: "Fail", message: "Failed to upload images" });
        // }
        // console.log(req.files,"req.files");
        // console.log("req.fille@@@@@@@@@@@@@@@",req.files);
        const { frontimage, backimage, selfieimage } = req.files;
        if (!frontimage || !backimage || !selfieimage) {
            return res.status(400).json({ status: "Fail", message: "Images are required" });
        }

        // console.log("req",req.files);
        const { email, password, phonenumber, fullname, country, DOB, address, pincode, documentupload } = req.body
        // console.log(req.body.email, "BODY");
        if (!email && !phonenumber) {
            return res.status(400).json({ status: "Fail", message: "Email or phone number is required" });
        }
        if (email && phonenumber) {
            return res.status(400).json({ status: "Fail", message: "Provide either email or phonenumber" });
        }

        const [frontImageUrl, backImageUrl, selfieImageUrl] = await Promise.all([
            uploadImageToFirebase(frontimage, 'frontimage', 'frontimage'),
            uploadImageToFirebase(backimage, 'backimage', 'backimage'),
            uploadImageToFirebase(selfieimage, 'selfieimage', 'selfieimage')
        ]);

        // console.log('front',frontimage);
        let findField = {};
        if (email) {
            findField.email = email
        } else {
            findField.phonenumber = phonenumber
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const signupdata = await User.findOne(findField);

        // console.log(signupdata, ">>>>>>>DTASIGNUP");
        // console.log(email, ">>>>>>>EMAILDTASIGNUP");
        // console.log(phonenumber, ">>>>>>>MONODTASIGNUP");
        // const user = await Userotp.find({email,phonenumber});
        if (signupdata?.signup === true) {
            return res.status(400).json({ status: "Fail", message: "User already signup" })
        }

        if (signupdata) {
            signupdata.password = hashedPassword
            signupdata.fullname = fullname
            signupdata.country = country
            signupdata.DOB = DOB
            signupdata.address = address
            signupdata.pincode = pincode
            signupdata.documentupload = documentupload
            // signupdata.frontimage = frontimage[0].filename
            // signupdata.backimage = backimage[0].filename
            // signupdata.selfieimage = selfieimage[0].filename
            signupdata.sumitedDate = new Date();
            signupdata.frontimage = frontImageUrl;
            signupdata.backimage = backImageUrl;
            signupdata.selfieimage = selfieImageUrl;
            signupdata.signup = true
            signupdata.iskyc = true
            await signupdata.save();

            // console.log(signupdata,"data");
            await walletModel.create({
                userId: signupdata._id,
            })

            return res.status(200).json({ status: "Success", message: "User signup successfully", data: signupdata })

        } else {

            return res.status(404).json({ status: "Fail", message: 'User not found' });
        }


        // const newUser = await User.create({
        //     email,
        //     phonenumber,
        //     password,
        //     fullname,
        //     country,
        //     DOB,
        //     address,
        //     pincode,
        //     documentupload,
        //     frontimage: frontimage[0].filename, 
        //     backimage: backimage[0].filename 
        // });

        // if (!newUser) {
        //     return res.status(404).json({ status: "Fail", message:'User is not created'});
        // }
        // return res.status(201).json({ status: "Success", message: 'User signup successfully'});
        // })
        // }

    } catch (err) {
        console.log(err);
        console.error('Error Stack Trace:', err.stack);
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}
const bucket = admin.storage().bucket();

async function uploadImageToFirebase(file, folderName, imageNamePrefix) {
    const sanitizedImageNamePrefix = imageNamePrefix.replace(/[\s-]/g, '_');
    const fileName = `${sanitizedImageNamePrefix}-${Date.now()}`.replace(/-/g, '_'); // Replace hyphens with underscores
    const fileRef = bucket.file(`images/${folderName}/${fileName}`);

    // console.log("file", fileName);

    try {
        if (!file.data) {
            throw new Error('Invalid file content');
        }

        const fileData = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data, 'binary');
        await fileRef.save(fileData, {
            metadata: {
                contentType: file.mimetype,
            },
        });

        await fileRef.makePublic();

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/images/${folderName}/${fileName}`;
        return publicUrl;
    } catch (error) {
        console.error('Error uploading image to Firebase Storage:', error);
        throw error;
    }
}



// async function uploadImageToFirebase(image, imageName) {
//     try {
//         const fileRef = storage.bucket().file(`images/${imageName}`);
//         await fileRef.save(image.path, {
//             contentType: image.mimetype,
//             resumable: false
//         });
//         const publicUrl = `https://storage.googleapis.com/${storage.bucket.name}/${fileRef.name}`;
//         return publicUrl;
//     } catch (error) {
//         console.error("Error uploading image to Firebase Storage:", error);
//         throw error;
//     }
// }

module.exports.user_google_login = async (req, res) => {
    const { email, fullname, frontimage, singintype } = req.body;

    try {
        // Check if the user exists
        let user = await User.findOne({ email });
        if (!user) {
            // Create a new user if not found
            user = new User({ email, fullname, frontimage, singintype });
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign({ email: user.email, id: user._id }, 'secret', { expiresIn: '2160h' });

        // Check if kycstatus is 'approve'
        if (user.kycstatus === 'approve') {
            // Return token and success message
            return res.status(200).json({ message: 'User logged in successfully', token });
        } else {
            // Return success message and user data
            return res.status(200).json({ message: 'successful', token, data: user });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports.user_login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(req.body, email, password)
        const user = await User.findOne({ email });
        // console.log(user,"user");
        if (!user) {
            return res.status(400).json({ status: "Fail", message: "User not found,please signup" });
        }

        if (!email || !password) {
            return res.status(400).json({ status: "Fail", message: "Email and password are required" });
        }
        if (user?.verify === false) {
            return res.status(401).json({ status: "Fail", message: "User not verified" });
        }


        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(404).json({ status: "Fail", message: "Invalid password" });
        }

        // const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_KEY, {
        //     expiresIn: "6h",
        // });

        // await TokenModel.create({ token })
        const userIdString = user._id.toString();
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_KEY, {
            expiresIn: "2160h"
        });

        await userToken.findOneAndUpdate(
            { userId: userIdString },
            { userId: userIdString, token: token },
            { upsert: true }
        );
        return res.status(200).json({ status: "Success", message: 'User logged in successfully', token: token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
};

module.exports.forget_password = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ status: "Fail", message: "Email are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: "Fail", message: "Email not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        // console.log(otp,"otp");
        user.resetOTP = otp;
        // console.log(user.resetOTP);
        await user.save();

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: 'wsinfo08317@gmail.com',
                pass: 'fsxotpganytczpno'
            }
        });

        if (email) {
            await transporter.sendMail({
                from: 'wsinfo08317@gmail.com',
                to: email,
                subject: 'Your OTP Code',
                text: `Your OTP code is: ${otp}`
            });
        }


        return res.status(200).json({ status: "Success", message: "OTP sent to your email", data: otp });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
};

module.exports.reset_password = async (req, res) => {
    try {
        // console.log(req.body);

        const { email, otp, newpassword, confirmpassword } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ status: "Fail", message: "Email and otp are required" });
        }
        if (!newpassword || !confirmpassword) {
            return res.status(400).json({ status: "Fail", message: "New password and confirm password are required" });
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10)
        if (newpassword !== confirmpassword) {
            return res.status(400).json({ status: "Fail", message: "New password and confirm password do not match" });
        }

        const user = await User.findOne({ email });
        console.log(user, "user");
        if (!user) {
            return res.status(404).json({ status: "Fail", message: "Email not found" });
        }

        if (user.resetOTP !== otp) {
            return res.status(400).json({ status: "Fail", message: "Invalid OTP" });
        }

        user.password = hashedPassword;
        user.resetOTP = null;
        await user.save();

        return res.status(200).json({ status: "Success", message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
};

module.exports.user_delete = async (req, res) => {
    try {
        const data = await User.findByIdAndDelete({ _id: req.params.id })
        console.log(req.params.id);
        if (!data) {
            return res.status(404).json({ status: "Fail", message: "User not found" })
        }
        return res.status(200).json({ status: true, message: "User delete successfully" });
    }
    catch (error) {
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: false, message: err });
    }
};

module.exports.user_profile_update = async (req, res) => {
    try {
        console.log("enter");
        const data = await User.findById({ _id: req.user.userId })
        console.log(data, "reqparams");
        if (!data) {
            return res.status(404).json({ status: "Fail", message: "User not found" });
        }
        const { email, phonenumber, fullname, country, DOB, address, pincode } = req.body
        if (!email || !phonenumber) {
            return res.status(404).json({ status: "Fail", message: "Email or phonenumber are required" });
        }

        console.log(req.body, "reqbody");
        if (email !== data.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ status: "Fail", message: "Email already exists" });
            }
        }
        if (phonenumber !== data.phonenumber) {
            const existingUser = await User.findOne({ phonenumber });
            if (existingUser) {
                return res.status(400).json({ status: "Fail", message: "Phonenumber already exists" });
            }
        }
        if (data) {
            data.email = email
            data.phonenumber = phonenumber
            data.fullname = fullname
            data.country = country
            data.DOB = DOB
            data.address = address
            data.pincode = pincode

            await data.save()
            return res.status(200).json({ status: "Success", message: "User profile updated successfully", data: data });

        } else {

            return res.status(404).json({ status: "Fail", message: 'User not found' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}
module.exports.get_user_data = async (req, res) => {
    try {
        const { userId } = req.user;
        //    console.log("user",req.user);

        const userData = await User.findOne({ _id: userId });

        if (!userData) {
            return res.status(404).json({ status: 'Fail', message: 'User not found' });
        }

        return res.status(200).json({ status: 'Success', data: userData });
    } catch (error) {
        console.error(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}

module.exports.news = async (req, res) => {
    try {
        const allNews = await News.find({});
        res.status(200).json(allNews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Define the POST route for creating wallet transactions
module.exports.wallet_transactionsbit = async (req, res) => {
    try {
        // Get userId from the middleware
        const userId = req.user.userId;

        // Parse and validate other request body fields
        const { coinname, transferamount } = req.body;
        if (!coinname || !transferamount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Fetch the wallet document based on the userId
        const wallet = await walletModel.findOne({ userId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        let newTransaction;
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        // Generate a new unique transactionid
        while (!isUnique && attempts < maxAttempts) {
            const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
            const transactionid = `TX${randomDigits}`;

            // Check if transactionid is already in use
            const existingTransaction = await WalletTransactionBit.findOne({ transactionid });
            if (!existingTransaction) {
                newTransaction = new WalletTransactionBit({
                    userId: userId,
                    coinname,
                    transactionid,
                    walletAddress: wallet._id,
                    status: "successfull",
                    transferamount
                });
                isUnique = true;
            }

            attempts++;
        }

        if (!isUnique) {
            return res.status(500).json({ message: 'Failed to create wallet transaction - unable to generate unique transactionid' });
        }

        // Save the transaction to the database
        await newTransaction.save();

        // Update the wallet amount by subtracting transferamount
        wallet.amount -= transferamount;
        await wallet.save();

        // Return success response
        return res.status(201).json({ message: 'Wallet transaction created successfully', transaction: newTransaction });
    } catch (err) {
        console.error('Error creating wallet transaction:', err);
        return res.status(500).json({ message: 'Failed to create wallet transaction' });
    }
};

module.exports.fetchNews = async (req, res) => {
    try {
        const response = await axios.get(
            "https://cryptocurrency-news2.p.rapidapi.com/v1/coindesk",
            {
                headers: {
                    "X-RapidAPI-Key":
                        "a0b97c1a43msh0603ff17936859bp17968cjsnd3b5d174235d",
                    "X-RapidAPI-Host": "cryptocurrency-news2.p.rapidapi.com",
                },
            }
        );

        const newsData = response?.data?.data;
        for (const newsItem of newsData) {
            // Check if a news article with the same title already exists
            const existingNews = await News.findOne({ title: newsItem?.title });
            if (!existingNews) {
                const news = new News({
                    url: newsItem?.url,
                    title: newsItem?.title,
                    description: newsItem?.description,
                    thumbnail: newsItem?.thumbnail,
                    createdAt: new Date(newsItem?.createdAt),
                });
                await news.save();
            }
        }
        console.log('news data',newsData)

        res.status(200).json({ message: "Data saved to database",data:newsData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports.community_user_signup = async (req, res) => {
    try {
        const { email, password, confirmpassword, name } = req.body;
        // console.log("req",req.body);
        const existingUser = await communityUserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ status: "Fail", message: 'User already exists' });
        }

        // const existingEmail = await communityUserModel.findOne({ email });

        // if (existingEmail) {
        //     return res.status(400).json({ status: "Fail", message: 'Email already exists' });
        // }
        // console.log("#########");
        const hasedpassword = await bcrypt.hash(password, 10)
        const data = new communityUserModel({
            email: email,
            password: hasedpassword,
            name: name
        });

        if (password !== confirmpassword) {
            return res.status(400).json({ status: "Fail", message: 'password and confirmpassword dose not metch' });
        }

        await data.save();
        console.log("data", data);
        return res.status(201).json({ status: "Success", message: 'User created successfully', data: data });

    } catch (error) {
        console.error('Error signing up user:', error);
        return res.status(500).json({ status: "Fail", message: 'Internal server error' });
    }
}

module.exports.community_user_login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await communityUserModel.findOne({ email });

        if (!email || !password) {
            return res.status(400).json({ status: "Fail", message: "Email and password are required" });
        }
        if (!user) {
            return res.status(404).json({ status: "Fail", message: "User not found" })
        }

        const isPassword = await bcrypt.compare(password, user.password);

        if (!isPassword) {
            return res.status(401).json({ status: "Fail", message: "Invalid Password" });
        }

        const userIdString = user._id.toString();
        // console.log("User ID:", user._id.toString());

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_KEY, {
            expiresIn: "2160h"
        });

        await communityusertoken.findOneAndUpdate(
            { userId: userIdString },
            { userId: userIdString, token: token },
            { upsert: true }
        );

        return res.status(200).json({ status: "success", message: "user Login successfully", token: token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "fail", message: "Internal server error" });
    }
}
// module.exports.add_category = async (req, res) => {
//     try {
//         const { category } = req.body;

//         const data = await categoryModel.create({
//             category: category
//         });
//         return res.status(200).json({ status: 'success', message: "category data add successfully", data: data })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ status: 'Fail', message: "Internal server error" });
//     }
// }
module.exports.get_category = async (req, res) => {
    try {
        const data = await categoryModel.find();

        if (data) {
            return res.status(200).json({
                status: "success", message: "category data fetch successfully", data: data
            });
        } else {
            return res.status(404).json({
                status: "fail",
                message: "Category data not found"
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "fail", message: "Internal server error" })
    }
}

module.exports.category_in_topic = async (req, res) => {
    try {
        const categoryId = req.params.id;

        let data;
        if (categoryId) {
            data = await topicModel.find({ categoryId })
                .populate('userId', 'name username username password')
                .populate('tagsId', 'tags')
                .populate('categoryId', 'category')
                .exec();
            if (data.length === 0) {
                return res.status(404).json({ status: 'Fail', message: 'No topics found for the given category' });
            }
        } else {
            data = await topicModel.find();
        }
        data = data.map(topic => {
            const modifiedTopic = {
                ...topic.toObject(),
                activity: topic.createdAt,
            };
            delete modifiedTopic.createdAt;
            return modifiedTopic;
        });

        return res.status(200).json({ status: 'success', message: "Topics found", data: data });
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: 'Fail', message: "Internal server error" });
    }
}


module.exports.add_tags = async (req, res) => {
    try {
        const { tags } = req.body;

        const data = await tagsModel.create({
            tags: tags
        })
        return res.status(200).json({
            status: "success",
            message: "Tags data add successfully", data: data
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "fail", message: "Internal server error" });
    }
}
module.exports.get_tags = async (req, res) => {
    try {
        const data = await tagsModel.find();

        if (data) {
            return res.status(200).json({
                status: "success",
                message: "tags data fetch successfully", data: data
            })
        } else {
            return res.status(404).json({
                status: "fail",
                message: "tags data not found"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'fail', message: "Internal server error" });
    }
}
module.exports.update_tags_data = async (req, res) => {
    try {
        const tagsId = req.params.id;

        if (!tagsId) {
            return res.status(404).json({
                status: 'Fail', message: "Tags data not found"
            });
        }
        const tags = req.body.tags;

        const data = await tagsModel.findByIdAndUpdate(tagsId, { tags: tags }, { new: true });

        return res.status(200).json({
            status: "Success",
            message: "Tags approved successfully", data: data
        })
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: 'Fail', message: "Internal server error " });
    }
}
module.exports.tags_in_topic = async (req, res) => {
    try {
        const tagsId = req.params.id;

        let data;
        if (tagsId) {
            data = await topicModel.find({ tagsId })
                .populate('userId', 'name username username password')
                .populate('tagsId', 'tags')
                .populate('categoryId', 'category')
                .exec();
            if (data.length === 0) {
                return res.status(404).json({ status: 'Fail', message: 'No topics found for the given tags' });
            }
        } else {
            data = await topicModel.find();
        }
        data = data.map(topic => {
            const modifiedTopic = {
                ...topic.toObject(),
                activity: topic.createdAt,
            };
            delete modifiedTopic.createdAt;
            return modifiedTopic;
        });
        return res.status(200).json({ status: 'success', message: "Topics found", data: data });

    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: 'Fail', message: "Internal server error" });
    }
}
module.exports.add_topic = async (req, res) => {

    try {

        const { topicname, categoryId, tagsId, description } = req.body;
        // console.log('req', req.body);

        const userId = req.user.userId;
        // console.log("user", userId);
        const category = await categoryModel.findById(categoryId);

        const tags = await tagsModel.find({ tagsId });

        // console.log(tags, "tags");
        if (!category || !tags) {
            return res.status(400).json({ status: 'Fail', message: "Category and Tags not found" });
        }

        const data = new topicModel({
            topicname: topicname,
            categoryId: categoryId,
            tagsId: tagsId,
            userId: userId,
            description: description,
        });
        await data.save();

        const newData = await commentModel.create({
            userId: userId,
            description: description,
            topicId: data._id
        });

        return res.status(200).json({ status: "success", message: "Topic Data Create successfully", data: data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "Fail", message: "Internal Server error"
        })
    }
}

// module.exports.get_all_topic = async (req, res) => {
//     try {
//         const data = await topicModel.find({ approve: true })
//             .populate({
//                 path: 'categoryId',
//                 match: { approve: true } 
//             })
//             .populate({
//                 path: 'tagsId',
//                 match: { approve: true } 
//             })
//             .lean()
//             .exec();

//         const filteredData = data.filter(topic => topic.categoryId && topic.tagsId);

//         const modifiedData = filteredData.map(topic =>({
//             ...topic,
//             Category: topic.categoryId,
//             Tags: topic.tagsId,
//             categoryId: undefined,
//             tagsId: undefined
//         }))
//         if (modifiedData.length > 0) {
//             return res.status(200).json({
//                 status: 'success',
//                 message: 'All Topic data fetch successfully',
//                 data: modifiedData
//             });
//         } else {
//             return res.status(404).json({
//                 status: "fail",
//                 message: "No approved topics with approved category and tags found"
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ status: "fail", message: "Internal server error" });
//     }
// }
module.exports.get_all_topic = async (req, res) => {
    try {
        const data = await topicModel.find({ approve: true })
            .populate('userId', 'name username username password')
            .populate('tagsId', 'tags')
            .populate('categoryId', 'category')
            .exec();


        const responseData = [];
        for (const topic of data) {

            const modifiedTopic = {
                ...topic.toObject(),
                activity: topic.createdAt,
            };
            delete modifiedTopic.createdAt;
            const comments = await commentModel.find({ topicId: topic._id });
            responseData.push({
                topic: modifiedTopic,
                replyCount: comments.length,
            });
        }


        return res.status(200).json({
            status: 'success',
            message: 'All Topic data fetch successfully',
            data: responseData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
};

module.exports.search_topic = async (req, res) => {
    try {
        const { topic } = req.query;

        const data = await topicModel.find({ topicname: { $regex: new RegExp(topic, 'i') } })
            .populate('userId', 'name username username password')
            .populate('tagsId', 'tags')
            .populate('categoryId', 'category')
            .exec();

        if (data.length === 0) {
            return res.status(404).json({ status: 'Fail', message: 'No Data found for the given Topic' });
        }

        return res.status(200).json({ status: 'success', message: "Topic data  Search successfully", data: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'Fail', message: "Internal server error" });
    }
}
module.exports.add_comments = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { description, topicId, replyId } = req.body;

        if (!topicId) {
            return res.status(400).json({ status: 'fail', message: "Required field: topicId" });
        }

        const topic = await topicModel.findById(topicId);
        if (!topic) {
            return res.status(404).json({ status: 'fail', message: "topic not found" });
        }
        if (!topic.approve === true) {
            return res.status(400).json({ status: 'fail', message: "Topic is not approved, cannot add comments" });
        }
        let data;

        if (replyId) {

            const firstComment = await commentModel.findById(replyId);
            if (!firstComment) {
                return res.status(404).json({ status: 'fail', message: "parent comment not found" });
            }

            data = await commentModel.create({
                userId: userId,
                topicId: topic._id,
                description: description,
                replyId: replyId
            });

        } else {
            data = await commentModel.create({
                userId: userId,
                topicId: topic._id,
                description: description
            });
        }

        return res.status(200).json({ status: "success", message: "comment add successfully", data: data });
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === 'id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: "Invalid ID format" });
        }
        return res.status(500).json({ status: 'Fail', message: "Internal server error" });
    }
};
module.exports.get_comments = async (req, res) => {
    try {
        const topicId = req.params.id;
        if (!topicId) {
            return res.status(404).json({ status: "Fail", message: "Topic not found" });
        }

        await topicModel.findByIdAndUpdate(topicId, { $inc: { views: 1 } });

        const topicData = await topicModel.findById(topicId)
            .populate('userId', 'email password username name')
            .populate('tagsId', 'tags')
            .populate('categoryId', 'category')
            .exec();

        if (!topicData) {
            return res.status(404).json({ status: "Fail", message: "Topic not found" });
        }
        const { createdAt, ...topicDataWithoutCreatedAt } = topicData.toObject();
        const topicDataWithActivity = {
            ...topicDataWithoutCreatedAt,
            activity: createdAt,
        };
        const comments = await commentModel.find({ topicId: topicId })
            .populate({ path: 'replyId' })
            .sort({ createdAt: -1 })
            .exec();

        const uniqueUserIds = new Set();

        comments.forEach(comment => {
            const userId = comment.userId.toString();
            if (!uniqueUserIds.has(userId)) {
                uniqueUserIds.add(userId);
            }
        });

        const userCount = uniqueUserIds.size;

        const commentCount = comments.length;

        const lastCommentTime = comments.length > 0 ? comments[0].createdAt : null;
        const topicDataWithLastCommentTime = {
            ...topicData.toObject(),
            lastcommenttime: lastCommentTime,
        };

        return res.status(200).json({
            status: 'success',
            message: "Topic data and comments fetched successfully",
            topicData: topicDataWithLastCommentTime,
            commentData: comments,
            commentCount: commentCount,
            userCount: userCount,
        });

    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: 'fail', message: "Internal server error" });
    }
};
// module.exports.get_comments = async (req, res) => {
//     try {
//         const topicId = req.params.id;
//         if (!topicId) {
//             return res.status(404).json({ status: "Fail", message: "Topic not found" });
//         }

//         await topicModel.findByIdAndUpdate(topicId, { $inc: { views: 1 } });

//         const topicData = await topicModel.findById(topicId)
//             .populate('userId', 'email password username name')
//             .populate('tagsId', 'tags')
//             .populate('categoryId', 'category')
//             .exec();

//         if (!topicData) {
//             return res.status(404).json({ status: "Fail", message: "Topic not found" });
//         }
//         const { createdAt, ...topicDataWithoutCreatedAt } = topicData.toObject();
//         const topicDataWithActivity = {
//             ...topicDataWithoutCreatedAt,
//             activity: createdAt,
//         };
//         const comments = await commentModel.find({ topicId: topicId })
//             .populate({ path: 'replyId' })
//             .sort({ createdAt: -1 })
//             .exec();

//         const uniqueUserIds = new Set();

//         comments.forEach(comment => {
//             const userId = comment.userId.toString(); 
//             if (!uniqueUserIds.has(userId)) {
//                 uniqueUserIds.add(userId);
//             }
//         });

//         const userCount = uniqueUserIds.size;

//         const commentCount = comments.length;

//         const lastCommentTime = comments.length > 0 ? comments[0].createdAt : null;
//         const topicDataWithLastCommentTime = {
//             ...topicData.toObject(),
//             lastcommenttime: lastCommentTime,
//         };

//         return res.status(200).json({
//             status: 'success',
//             message: "Topic data and comments fetched successfully",
//             topicData: topicDataWithLastCommentTime,
//             commentData: comments,
//             commentCount: commentCount,
//             userCount: userCount,
//         });

//     } catch (error) {
//         console.log(error);
//         if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
//             return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
//         }
//         return res.status(500).json({ status: 'fail', message: "Internal server error" });
//     }
// };

module.exports.comment_solution = async (req, res) => {
    try {
        const user = req.user;
        // console.log("user.userId", user.userId);
        const { commentId } = req.body;
        // console.log(commentId);
        const comment = await commentModel.findById(commentId)
        // console.log("comment",comment.topicId);

        if (!comment) {
            return res.status(404).json({ status: 'Fail', message: "Comment not Found" })
        }

        const topic = await topicModel.findById(comment.topicId).exec();
        // console.log("topic.userId", topic.userId);

        if (!topic) {
            return res.status(404).json({ status: 'Fail', message: "Topic not found" });
        }
        if (topic.userId.toString() !== user.userId) {
            return res.status(403).json({ status: 'error', message: 'Unauthorized access' });
        }

        comment.Solution = true;
        await comment.save();

        return res.status(200).json({ status: 'success', message: 'Solution true successfully' });
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}
module.exports.comments_like = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { commentId } = req.body;
        const comment = await commentModel.findById(commentId);

        if (!comment) {
            return res.status(404).json({ status: 'Fail', message: "Comment not Found" })
        }
        const topic = await topicModel.findById(comment.topicId);
        if (!topic || !topic.approve === true) {
            return res.status(400).json({ status: 'Fail', message: "Cannot like the comment, topic is not approved" });
        }
        if (comment.likes.includes(userId)) {
            return res.status(400).json({ status: "Fail", message: "user already liked this comment" });
        }

        comment.likes.push(userId);
        comment.like += 1;
        await comment.save();

        const data = {
            status: 'success',
            message: 'Comment liked successfully',
            likeCount: comment.like,
            likedBy: comment.likes,
        }

        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}
module.exports.comments_unlike = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { commentId } = req.body;
        const comment = await commentModel.findById(commentId);

        if (!comment) {
            return res.status(404).json({ status: 'Fail', message: "Comment not found" });
        }

        if (!comment.likes.includes(userId)) {
            return res.status(400).json({ status: 'Fail', message: 'User has not liked this comment' });
        }

        comment.likes = comment.likes.filter(likedUserId => likedUserId.toString() !== userId);
        comment.like -= 1;
        await comment.save();

        const data = {
            status: 'success',
            message: 'Comment unliked successfully',
            likeCount: comment.like,
            likedBy: comment.likes,
        };

        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: "Invalid ID format" });
        }
    }
}
// module.exports.all_topic_details = async (req, res) => {
//     try {
//         const { categoryId, tagsId } = req.query;

//         let query = {};

//         if (categoryId) {
//             query.categoryId = mongoose.Types.ObjectId(categoryId);
//         }

//         if (tagsId) {
//             query.tagsId =  mongoose.Types.ObjectId(tagsId) ;
//         }

//         const topics = await topicModel.find(query).populate('categoryId tagsId userId').exec();

//         if (!topics || topics.length === 0) {
//             return res.status(404).json({ status: 'fail', message: 'No topics found' });
//         }

//         return res.status(200).json({
//             status: 'success',
//             message: 'Topics fetched successfully',
//             data: {
//                 topics,
//             },
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ status: 'fail', message: 'Internal server Error' });
//     }
// };

// module.exports.all_topic_details = async (req,res) => {
//     try {
//         const {categoryId, tagsId } = req.query;     
//         console.log("Category:", categoryId);
//         console.log("Tags:", tagsId);
//         if (categoryId) {
//             const data = await topicModel.find({ categoryId }).exec();
//             if (data.length === 0) {
//                 return res.status(404).json({ status: 'fail', message: 'No data found for the specified category' });
//             }
//             return res.status(200).json({ status: 'success', message: 'Category data show successfully', data: data });
//         } else if (tagsId) {
//             const data = await topicModel.find({ tagsId }).exec();
//             if (data.length === 0) {
//                 return res.status(404).json({ status: 'fail', message: 'No data found for the specified tags' });
//             }
//             return res.status(200).json({ status: 'success', message: 'Tags data show successfully', data: data });
//         } else {
//             const data = await topicModel.find().exec();
//             if (data.length === 0) {
//                 return res.status(404).json({ status: 'fail', message: 'No topic data found' });
//             }
//             return res.status(200).json({ status: 'success', message: 'Topic data show successfully', data: data });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ status:'Fail', message:"Internal server Error" });
//     }
// }
// module.exports.community_user_login =async (req,res) =>{
//     try {
//         const { email, password } = req.body;

//         const user = await communityUserModel.findOne({ password,email });

//         if (user.verify === false) {
//             return res.status(401).json({ status: "Fail", message: "User not verified" });
//         }

//         if (!email || !password) {
//             return res.status(400).json({ status: "Fail", message: "Email and password are required" });
//         }

//         // const passwordMatch = await bcrypt.compare(password, user.password);

//         if (!passwordMatch) {
//             return res.status(404).json({ status: "Fail", message: "Invalid password" });
//         }

//         const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_KEY, {
//             expiresIn: "6h",
//         });

//         // await TokenModel.create({ token })

//         return res.status(200).json({ status: "Success", message: 'User logged in successfully', token });

//     } catch (error) {
//         console.error('Error signing up user:', error);
//         return res.status(500).json({status:"Fail",message: 'Internal server error' });
//     }
// }

module.exports.wallet_deposit = async (req, res) => {
    try {
        const { bankdetails, amount } = req.body;
        if (!amount) {
            return res.status(400).json({ status: "Fail", message: "Required feild :Amount" })
        }
        const userId = req.user.userId
        // const uuidValue = uuid.v4();
        // const randomDigits = uuidValue.replace(/-/g, '').substring(0, 12);
        // const transactionId = `TTCNI${randomDigits}`;
        // const randomDigits = Math.floor(100000000000 + Math.random() * 900000000000).toString().substring(0, 12);

        const randomDigits = crypto.randomBytes(6).readUIntLE(0, 6) % 1e12;
        const transactionId = `TTCNI${randomDigits.toString().padStart(12, '0')}`;

        const bankdata = await BankDetails.findById({ _id: bankdetails })

        if (!bankdata) {
            return res.status(400).json({ status: "Fail", message: "Invalid bankdetails ID" });
        }

        console.log(bankdata, "bankdata");

        const data = await walletTransictionModel.create({
            transactionId: transactionId,
            bankdetails: bankdata,
            amount: amount,
            status: "successful",
            transictiontype: "deposit",
            userId: userId
        });
        console.log(data.transactionId, "transictionID");
        await walletModel.findOneAndUpdate(
            { userId: userId },
            { $inc: { amount: parseFloat(amount) } },
            { new: true }
        );
        return res.status(200).json({ status: "Success", message: 'Deposit recorded successfully', data: data });
    } catch (error) {
        console.error('Error recording deposit:', error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid bankdetails ID format' });
        }
        return res.status(500).json({ status: "Fail", message: 'Internal server error' });
    }
}

module.exports.wallet_withdrow = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount) {
            return res.status(400).json({ status: "Fail", message: 'Required feild : Amount' });
        }
        const userId = req.user.userId;

        const userWallet = await walletModel.findOne({ userId: userId });

        if (!userWallet) {
            return res.status(400).json({ status: "Fail", message: 'User wallet not found' });
        }

        if (userWallet.amount < amount) {
            return res.status(400).json({ status: "Fail", message: 'Not have enough balance' });
        }
        const randomDigits = crypto.randomBytes(6).readUIntLE(0, 6) % 1e12;
        const transactionId = `TTCNI${randomDigits.toString().padStart(12, '0')}`;

        const data = await walletTransictionModel.create({
            transactionId: transactionId,
            amount: amount,
            status: "pending",
            transictiontype: "withdraw",
            userId: userId
        });

        // await walletModel.findOneAndUpdate(
        //     { userId: userId },
        //     { $inc: { amount: -parseFloat(amount) } },
        //     { new: true }
        // );

        return res.status(200).json({ status: "Success", message: 'Withdraw recorded successfully', data: data });
    } catch (error) {
        console.error('Error recording withdrawal', error);
        return res.status(500).json({ status: "Fail", message: 'Internal server error' });
    }
}

module.exports.get_all_wallet_transiction = async (req, res) => {
    try {
        const data = await walletTransictionModel.find({ userId: req.user.userId })

        return res.status(200).json({ status: "Success", message: 'User transiction show successfully', data: data });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "Fail", message: 'Internal server error' });
    }
}

module.exports.get_wallet = async (req, res) => {
    try {
        const data = await walletModel.findOne({ userId: req.user.userId })
        return res.status(200).json({ status: "Success", message: "User wallet show successfully", data: data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "Fail", message: "Internal server error" })
    }
}


// module.exports.get_seed_words = async (req, res) => {
//     try {

//         const mnemonic = bip39.generateMnemonic();

//         const seedBuffer = await bip39.mnemonicToSeed(mnemonic);

//         const masterNode = bip32.fromSeedBuffer(seedBuffer);

//         const childNode = masterNode.derivePath("m/0'/0/0");

//         const privateKeyHex = childNode.privateKey.toString('hex');
//         const publicKeyHex = bitcoin.ECPair.fromPrivateKey(childNode.privateKey).publicKey.toString('hex');

//         return res.status(200).json({ 
//             status: "Success", 
//             message: "Private and public keys generated successfully",  
//             privateKey: privateKeyHex,
//             publicKey: publicKeyHex,
//             mnemonic: mnemonic
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ 
//             status: "Fail", 
//             message: 'Internal server error' 
//         });
//     }
// }

module.exports.get_seed_words = async (req, res) => {
    try {

        const mnemonic = bip39.generateMnemonic();
        // console.log(mnemonic, "mnemonic");

        const seedBuffer = await bip39.mnemonicToSeed(mnemonic);
        console.log(seedBuffer, "seed");
        const mnemonicArray = mnemonic.split(' ');

        const seeddata = await Seed.findOne({ userId: req.user.userId })

        if (seeddata) {
            await Seed.findOneAndUpdate({ userId: req.user.userId }, { seed: mnemonicArray });
        }
        else {
            const newseed = await Seed.create({
                userId: req.user.userId,
                seed: mnemonicArray
            });
            await newseed.save();
        }


        return res.status(200).json({ status: "Success", message: "Seed words generated successfully", data: mnemonicArray });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "Fail", message: 'Internal server error' });
    }
}

module.exports.select_seed = async (req, res) => {
    try {
        const { selectedseed } = req.body;
        console.log(req.body.selectedseed, "bodyseed>>>>>>");
        if (!selectedseed) {
            return res.status(400).json({ status: "Fail", message: "Selectedseed are required" });
        }
        if (selectedseed.length !== 12) {
            return res.status(400).json({ status: "Fail", message: "Selectedseed must be an array of exactly 12 strings" });
        }

        const seedDoc = await Seed.findOne({ userId: req.user.userId });
        console.log(seedDoc.seed, "Userseed");
        if (!seedDoc) {
            return res.status(400).json({ status: "Fail", message: "No seed found for the user" });
        }

        const selectedSeedSet = new Set(selectedseed);
        const seedSet = new Set(seedDoc.seed);

        for (const seed of selectedSeedSet) {
            if (!seedSet.has(seed)) {
                return res.status(400).json({ status: "Fail", message: "Selected seed does not match any seed in the database" });
            }
        }

        seedDoc.selectedseed = selectedseed;
        await seedDoc.save();

        return res.status(200).json({ status: "Success", message: "Selected data stored successfully", data: selectedseed });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "Fail", message: 'Internal server error' });
    }
}


module.exports.get_select_seed = async (req, res) => {
    try {

        // console.log(req.user,"user>>>>>>");

        const selectseed = await Seed.findOne({ userId: req.user.userId })

        return res.status(200).json({ status: "Success", message: "Selected seed get successfully", data: selectseed.seed });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "Fail", message: 'Internal server error' });
    }
}

module.exports.match_seed = async (req, res) => {
    try {

        const requestSeed = req.body.selectedseed;
        if (!requestSeed) {
            return res.status(400).json({ status: "Fail", message: "Selectedseed are required" });
        }
        if (requestSeed.length !== 12) {
            return res.status(400).json({ status: "Fail", message: "Selectedseed is exact 12" });
        }
        const selectseed = await Seed.findOne({ userId: req.user.userId });

        if (!selectseed) {
            return res.status(404).json({ status: "Fail", message: "Selected seed not found for the user" });
        }

        const databaseSeed = selectseed.selectedseed;

        const isMatched = (databaseSeed.toString() === requestSeed.toString());

        if (isMatched) {

            return res.status(200).json({ status: "Success", message: "Seed matched successfully" });
        } else {
            return res.status(400).json({ status: "Fail", message: "Seed dose not match" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "Fail", message: 'Internal server error' });
    }
}

module.exports.view_blog = async (req, res) => {
    try {

        const blogId = req.params.id;
        console.log(blogId);
        const data = await blogModel.findOne({ _id: blogId });
        console.log(data);
        if (data) {

            await blogModel.findByIdAndUpdate(blogId, { $inc: { pageview: 1 } });

            return res.status(200).json({ status: 'Success', message: 'blod data shown  successfully', data: data });
        } else {
            return res.status(404).json({ status: 'Fail', message: 'BLog not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'Fail', message: 'Internal server error' });
    }
}

module.exports.get_fcmToken = async (req, res) => {
    try {
        const { fcmtoken, userId } = req.body;

        const newtoken = await fcmTokenModel({
            fcmtoken,
            userId
        })

        await newtoken.save();

        return res.status(200).json({ status: "Success", message: "FCM token Store Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}