require("dotenv").config();
const nodemailer = require('nodemailer');
const { promise } = require('readdirp');
const mongoose = require('mongoose');
const { CastError } = mongoose.Error;
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const OTPModel = require('../models/otp.js');
const AdminModel = require('../models/admin.js');
const CurrencyModel = require('../models/currency.js')
const BlogModel = require('../models/blogs.js')
const TokenModel = require('../models/admintoken.js')
const User = require('../models/users.js');
const BankDetails = require('../models/bankdetalis.js');
// const UserData = require('../models/userSchema'); // Import the UserData model
const walletTransictionModel = require("../models/walletTransiction.js");
const walletModel = require('../models/wallets.js');
const categoryModel = require('../models/category.js');
// const tagsModel = require('../models/tags.js');
const topicModel = require('../models/topic.js');
const tradeModel = require('../models/trade.js');
const mailModel = require('../models/mail.js');
const notificationModel = require('../models/notification.js');
const coinModel = require('../models/coinpayment.js');
const ethereumModel = require('../models/ethereum.js');
const tronModel = require('../models/tron.js');
const binanceModel = require('../models/binance.js');
const stripeModel = require('../models/stripe.js');
const recaptchaModel = require('../models/recaptcha.js');
const socialModel = require('../models/social.js');
const admin = require("../middleware/firebase.js");
const fcmTokenModel = require("../models/fcmtoken.js");
const WalletTransactionBit = require("../models/wallettansactionbit.js");
const Notification = require("../models/notificationfirebase.js");
const Staking = require("../models/staking.js");


module.exports.Admin_login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //   console.log("@@@",req.body);

        const logindata = await AdminModel.findOne({ email })

        // console.log(logindata,"data>>>>>>>>");

        if (!email || !password) {
            return res.status(400).json({ status: "Fail", message: 'Email or Password are required' });
        }

        if (!logindata) {
            return res.status(400).json({ status: "Fail", message: 'Email not found' });
        }

        if (logindata.password !== password) {
            return res.status(401).json({ status: "Fail", message: 'Invalid password' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpirationMinutes = 30;

        // console.log("OTP", otp);
        // console.log("EMAIL", req.body.email);
        // console.log("password", req.body.password);

        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + otpExpirationMinutes);
        const otpdata = {
            email,
            password,
            otp,
            expiresAt: expirationTime
        };


        const data = await OTPModel.findOne({ email, password })
        // console.log(data,">>>>>>>DATA");
        if (data) {
            data.otp = otp
            data.expiresAt = expirationTime;
            await data.save()
        } else {
            await OTPModel.create(otpdata);
        }

        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: 'aws.aslcrypto@gmail.com',
                pass: 'ytuegrwqiyosraax'
            }
        });
        //  console.log(transporter,">>>>>>>transporter");

        await transporter.sendMail({
            from: 'aws.aslcrypto@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`
        });
        console.log(otp);
        return res.status(200).json({ status: "Success", message: 'Otp send successfully', data: otp });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}

module.exports.verify_otp = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({ status: "Fail", message: 'Email or otp are required' });
        }

        const data = await OTPModel.findOne({ email, otp })

        if (!data && data?.otp !== otp) {
            // console.log(data,"verifydata");
            return res.status(400).json({ status: "Fail", message: 'Invalid OTP or Email' });
        }
        // console.log(req.body,">>>>data");
        // console.log(data,">>>>find");

        // if(!data){
        //     console.log(data,"verifydata");
        //     return res.status(400).json({ status: "Fail", message: 'Admin not found' });
        // }

        var token = jwt.sign({ userId: data._id, email: data.email }, process.env.JWT_KEY, {
            expiresIn: "2160h",
        });

        await TokenModel.create({ token })

        await OTPModel.findOneAndDelete({ email })
        const currentTime = new Date();
        if (currentTime > data?.expiresAt) {
            return res.status(400).json({ status: "Fail", message: "OTP has expired" });
        }


        return res.status(200).json({ status: "Success", message: 'OTP verify successfully', data: data, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
};

module.exports.user_verify = async (req, res) => {
    try {
        const data = await User.findOneAndUpdate(
            { _id: req.params.id },
            { verify: true },
            { new: true }
        );
        if (!data) {
            return res.status(400).json({ status: "Fail", message: "User not found" })
        }
        return res.status(200).json({ status: true, message: "User verified successfully", data: data });
    } catch (error) {
        console.error(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
};

module.exports.user_verfiy_list = async (req, res) => {
    try {
        const data = await User.find({ verify: true });
        return res.status(200).json({ status: true, message: "Verified users show successfully", data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
};

module.exports.getWalletTransactions = async (req, res) => {
    try {
        // Fetch all wallet transactions from the database and populate the 'userId' field to include the 'fullname' field
        const transactions = await WalletTransactionBit.find().populate({
            path: 'userId',
            model: User, // Use the UserData model for population
            select: 'fullname'
        });

        // Return success response with transactions
        return res.status(200).json({ message: 'Wallet transactions fetched successfully', transactions });
    } catch (err) {
        console.error('Error fetching wallet transactions:', err);
        return res.status(500).json({ message: 'Failed to fetch wallet transactions' });
    }
};

module.exports.get_all_user = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        const filter = {};
        if (fromDate && toDate) {
            const parseDate = (dateString) => {
                const [day, month, year] = dateString.split('/');
                return new Date(`${year}-${month}-${day}`);
            };

            const fromDateObj = parseDate(fromDate);
            const toDateObj = parseDate(toDate);

            if (isNaN(fromDateObj) || isNaN(toDateObj)) {
                return res.status(400).json({
                    status: 'Fail',
                    message: 'Invalid date format for fromDate or toDate',
                });
            }
            filter.createdAt = { $gte: fromDateObj, $lte: toDateObj };
        }
        const userdata = await User.find(filter);
        return res.status(200).json({ status: "Success", message: "User data show successfully", data: userdata });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}
module.exports.search_user = async (req, res) => {
    try {
        const { email } = req.query;

        const data = await User.find({ email: { $regex: new RegExp(email, 'i') } });

        if (data) {
            return res.status(200).json({ status: 'success', message: "User serch successfully", data: data });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'Fail', message: "Internal server error" });
    }
}
module.exports.user_status = async (req, res) => {
    try {
        const { type } = req.query;

        let status;
        if (type === 'block') {
            status = false;
        } else {
            status = true;
        }
        const data = await User.findOneAndUpdate(
            { _id: req.params.id },
            { status: status },
            { new: true }
        );
        if (!data) {
            return res.status(400).json({ status: "Fail", message: "User not found" })
        }
        return res.status(200).json({ status: true, message: "User status changed successfully", data: data });
    } catch (error) {
        console.error(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

module.exports.add_currency = async (req, res) => {
    try {
        const { currencyname, symbol, sign, price, type } = req.body
        const { currencyimg } = req.files;
        if (!currencyimg) {
            return res.status(400).json({ status: "Fail", message: "Required feild: currencyimg" })
        }
        const existingCurrency = await CurrencyModel.findOne({ currencyname });
        if (existingCurrency) {
            return res.status(400).json({ status: "Fail", message: 'Currency already exists' });
        }

        const data = await CurrencyModel.create({
            currencyname: currencyname,
            symbol: symbol,
            sign: sign,
            price: price,
            type: type,
            currencyimg: currencyimg[0].filename
        })

        return res.status(200).json({ status: "Success", message: 'Currency add successfully', data: data });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "Fail", message: "Internal server error" })
    }
}
module.exports.delete_currency = async (req, res) => {
    try {
        const data = await CurrencyModel.findOneAndDelete({ _id: req.params.id })
        console.log(data, "data");
        if (!data) {
            return res.status(400).json({ status: "Fail", message: 'Currency not found' });
        }
        return res.status(200).json({ status: "Success", message: 'Currency deleted successfully' });
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: "Internal server error" })
    }
}

module.exports.update_currency = async (req, res) => {
    try {
        const { currencyname, symbol, sign, price, type } = req.body
        const { currencyimg } = req.files
        if (!currencyimg) {
            return res.status(404).json({ status: "Fail", message: "Required feild :currency image" });
        }
        const data = await CurrencyModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                currencyname: currencyname,
                symbol: symbol,
                sign: sign,
                price: price,
                type: type,
                currencyimg: currencyimg[0].filename
            },
            { new: true }
        );

        // console.log(data,"data");
        if (data) {
            return res.status(200).json({ status: "Success", message: "Currency updated successfully", data: data });
        } else {
            return res.status(404).json({ status: "Fail", message: "Currency not found" });
        }

    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: "Internal server error" })
    }
}

module.exports.get_all_currencies = async (req, res) => {
    try {

        const { fromDate, toDate } = req.query;
        const filter = {};

        if (fromDate && toDate) {
            const parseDate = (dateString) => {
                const [day, month, year] = dateString.split('/');
                return new Date(`${year}-${month}-${day}`);
            };

            const fromDateObj = parseDate(fromDate);
            const toDateObj = parseDate(toDate);

            if (isNaN(fromDateObj) || isNaN(toDateObj)) {
                return res.status(400).json({
                    status: 'Fail',
                    message: 'Invalid date format for fromDate or toDate',
                });
            }
            filter.createdAt = { $gte: fromDateObj, $lte: toDateObj };
        }

        const data = await CurrencyModel.find(filter);

        return res.status(200).json({ status: "Success", message: "Currency data show successfully", data: data })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "Fail", message: "Internal server error" })
    }
}

module.exports.notifications = async (req, res) => {
    try {
        const { title, body } = req.body;


        const newNotification = new Notification({ title, body });
        await newNotification.save();

        const message = {
            notification: { title, body },
            topic: 'your-topic-name', // Or use token for individual device notification
        };
        const response = await admin.messaging().send(message);

        console.log('Notification sent successfully:', response);
        res.status(200).json({ message: 'Notification saved and sent successfully', notification: newNotification });
    } catch (error) {
        console.error('Error saving or sending notification:', error);
        res.status(500).json({ message: 'Failed to save or send notification' });
    }
};



module.exports.search_currency = async (req, res) => {
    try {
        const { currencyname } = req.query;

        const data = await CurrencyModel.find({ currencyname: { $regex: new RegExp(currencyname, 'i') } });

        return res.status(200).json({ status: "Success", message: "Currency search successful", data: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
};
const bucket = admin.storage().bucket();

async function uploadImage(file, folderName, imageNamePrefix) {
    const sanitizedImageNamePrefix = imageNamePrefix.replace(/[\s-]/g, '_');
    const fileName = `${sanitizedImageNamePrefix}_${Date.now()}`; // Change hyphen to underscore
    const fileRef = bucket.file(`images/${folderName}/${fileName}`);

    // console.log("filename", fileName); // Log the sanitized filename for debugging purposes

    try {
        if (!file.data) {
            throw new Error('Invalid file content');
        }

        const fileData = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data, 'binary');
        await fileRef.save(fileData, {
            metadata: {
                contentType: file.mimetype
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

module.exports.add_blogs = async (req, res) => {
    try {
        const { title, description, author, status, visibility, publishon, tags, videourl } = req.body;
        const { blogimg } = req.files;

        if (!blogimg) {
            return res.status(400).json({ status: "Fail", message: "Required field: blog image" });
        }
        if (!videourl) {
            return res.status(400).json({ status: "Fail", message: "Required field: Videourl" });
        }
        const existsblog = await BlogModel.findOne({ title });
        if (existsblog) {
            return res.status(400).json({ status: "Fail", message: "Blog already exists" });
        }

        const blogImage = blogimg;
        const imageUrl = await uploadImage(blogImage, 'blogimage', title);

        const data = await BlogModel.create({
            blogimg: imageUrl,
            title: title,
            description: description,
            author: author,
            status: status,
            visibility: visibility,
            publishon: publishon,
            tags: tags,
            videourl: videourl
        });

        return res.status(200).json({ status: "Success", message: "Blog added successfully", data: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
};

module.exports.update_blog = async (req, res) => {
    try {
        const { title, description, author, status, visibility, publishon, tags, videourl } = req.body;
        const { blogimg } = req.files;

        let updateData = {
            title: title,
            description: description,
            author: author,
            status: status,
            visibility: visibility,
            publishon: publishon,
            tags: tags,
            videourl: videourl
        };

        if (blogimg) {
            newBlogImage = blogimg;
            const newImageUrl = await uploadImage(newBlogImage, 'blogimage', title);

            const oldData = await BlogModel.findById(req.params.id);
            const oldImageUrl = oldData ? oldData.blogimg : null;

            updateData.blogimg = newImageUrl;

            if (oldImageUrl) {
                const oldFileName = oldImageUrl.split('/').pop();
                const oldFileRef = bucket.file(`images/blogimage/${oldFileName}`);
                await oldFileRef.delete();
            }
        }

        const data = await BlogModel.findByIdAndUpdate(
            { _id: req.params.id },
            updateData,
            { new: true }
        );

        if (data) {
            return res.status(200).json({ status: "Success", message: "Blog updated successfully", data: data });
        } else {
            return res.status(404).json({ status: "Fail", message: "Blog not found" });
        }
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
};
module.exports.delete_blog = async (req, res) => {
    try {
        const data = await BlogModel.findOneAndDelete({ _id: req.params.id })
        // console.log(data,"data");
        if (!data) {
            return res.status(400).json({ status: "Fail", message: 'Blog not found' });
        }
        return res.status(200).json({ status: "Success", message: 'Blog deleted successfully' });
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: "Internal server error" })
    }
}
module.exports.get_all_blogs = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        const filter = {};
        if (fromDate && toDate) {
            const parseDate = (dateString) => {
                const [day, month, year] = dateString.split('/');
                return new Date(`${year}-${month}-${day}`);
            };

            const fromDateObj = parseDate(fromDate);
            const toDateObj = parseDate(toDate);

            if (isNaN(fromDateObj) || isNaN(toDateObj)) {
                return res.status(400).json({
                    status: 'Fail',
                    message: 'Invalid date format for fromDate or toDate',
                });
            }
            filter.createdAt = { $gte: fromDateObj, $lte: toDateObj };
        }
        const data = await BlogModel.find(filter);

        return res.status(200).json({ status: "Success", message: "Blog data show successfully", data: data })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "Fail", message: "Internal server error" })
    }
}

module.exports.search_blog = async (req, res) => {
    try {
        const { title } = req.query;

        const data = await BlogModel.find({ title: { $regex: new RegExp(title, 'i') } });

        return res.status(200).json({ status: "Success", message: "Blog data search successful", data: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
};


module.exports.get_all_transictions = async (req, res) => {
    try {
        let query = {};
        const { from, to } = req.query;

        if (from && to) {
            query.createdAt = {
                $gte: new Date(from),
                $lte: new Date(to)
            };
        }
        const data = await walletTransictionModel.find(query)

        return res.status(200).json({ status: "Success", message: 'User wallet show successfully', data: data });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "Fail", message: 'Internal server error' });
    }
}
module.exports.search_transictions = async (req, res) => {
    try {
        const { transactionId } = req.query;

        const data = await walletTransictionModel.find(
            { transactionId: { $regex: new RegExp(transactionId, 'i') } })

        // console.log(data);
        if (data) {
            return res.status(200).json({ status: 'success', message: 'Transictions serch successfully', data: data });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'Fail', message: "Internal server error" });
    }
}
module.exports.wallet_request = async (req, res) => {
    try {
        const userDataWithWallets = await walletTransictionModel.aggregate([
            { $match: { transictiontype: "withdraw", status: "pending" } },
            {
                $lookup: {
                    from: "wallets",
                    localField: "userId",
                    foreignField: "userId",
                    as: "wallet"
                }
            },
            { $unwind: "$wallet" },

        ]);

        return res.status(200).json({ status: "Success", message: "Transaction withdraw data show successfully", data: userDataWithWallets });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "Fail", message: 'Internal server error' });
    }
}

module.exports.update_transiction_status = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const data = await walletTransictionModel.findOne({ _id: id, transictiontype: "withdraw", changestatus: false });
        // console.log(data,"DTATATA");

        if (data && status === "successful") {

            await walletModel.findOneAndUpdate(
                { userId: data.userId },
                { $inc: { amount: -parseFloat(data.amount) } },
                { new: true }
            )

        }

        const updatedTransaction = await walletTransictionModel.findOneAndUpdate(
            { _id: id, changestatus: false },
            { status: status, changestatus: true },
            { new: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ status: "Fail", message: "Transaction not found" });
        }


        return res.status(200).json({ status: "Success", message: "Transaction status updated successfully", data: updatedTransaction });
    } catch (error) {
        console.error('Error updating transaction status:', error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: 'Internal server error' });
    }
}
module.exports.add_bank_datails = async (req, res) => {
    try {
        const { bankname, banknumber, accountnumber, bankholdername, ifsccode } = req.body;

        const existingAccountNumber = await BankDetails.findOne({ accountnumber });
        if (existingAccountNumber) {
            return res.status(400).json({
                status: "fail",
                message: "your accountnumber already exist"
            });
        }
        const existingIfsccode = await BankDetails.findOne({ ifsccode });
        if (existingIfsccode) {
            return res.status(400).json({
                status: "fail",
                message: "your IFSC code already exist"
            });
        }
        const data = await BankDetails.create({
            bankname: bankname,
            banknumber: banknumber,
            accountnumber: accountnumber,
            bankholdername: bankholdername,
            ifsccode: ifsccode
        })
        // console.log('res',data)
        return res.status(200).json({
            status: 'success', message: 'Bank detalis Add successfully', data: data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}
module.exports.update_bank_details = async (req, res) => {
    try {

        const { bankname, banknumber, accountnumber, bankholdername, ifsccode } = req.body;

        const data = await BankDetails.findByIdAndUpdate(
            { _id: req.params.id },
            {
                bankname: bankname,
                banknumber: banknumber,
                accountnumber: accountnumber,
                bankholdername: bankholdername,
                ifsccode: ifsccode
            }, { new: true });
        if (data) {
            return res.status(200).json({
                status: 'success', message: "Bank detalis Update Successfully", data: data
            });
        } else {
            return res.status(404).json({ status: "Fail", message: "Bank details not found" });
        }
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}
module.exports.get_bank_details = async (req, res) => {
    try {
        const data = await BankDetails.find();

        return res.status(200).json({
            status: "success", message: "Bank Detalis data fetch successfully", data: data
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "Fail", message: "Internal server error"
        })
    }
}
module.exports.delete_bank_details = async (req, res) => {
    try {
        const data = await BankDetails.findByIdAndDelete(req.params.id);
        // console.log(data);
        if (!data) {
            return res.status(400).json({
                status: "fail", message: "Bank Details not found"
            })
        } else {
            return res.status(200).json({
                status: "success", message: "Bank Details deleted successfully"
            })
        }
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({
            status: "Fail", message: "Internal Server error"
        })
    }
}
module.exports.select_bank_account = async (req, res) => {
    try {
        const { accountId } = req.body;
        // console.log("req",req.body);

        const currentAccount = await BankDetails.findOne({ primarykey: true });
        if (currentAccount && currentAccount._id.toString() !== accountId) {

            await BankDetails.findByIdAndUpdate(currentAccount._id, { primarykey: false });
        }
        const updatedAccount = await BankDetails.findByIdAndUpdate(accountId, { primarykey: true });

        res.status(200).json({ status: "Success", message: "Bank account selection updated successfully", data: updatedAccount });
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        res.status(500).json({
            status: "Fail", message: "Internal server Error"
        })
    }
}
module.exports.kyc_status = async (req, res) => {
    try {
        const { userId, action } = req.body;

        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({
                status: 'Fail',
                message: 'Invalid Action'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { kycstatus: action }, { new: true });

        if (!updatedUser) {
            return res.status(400).json({
                status: 'Fail',
                message: 'User Not Found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'User KYC status updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server error' });
    }
}
module.exports.get_kyc_data = async (req, res) => {
    try {

        const { fromDate, toDate } = req.query;
        const filter = {};

        // if(fromDate && toDate) {
        //     filter.sumitedDate = {$gte: new Date(fromDate), $lte: new Date(toDate)}
        // }
        if (fromDate && toDate) {
            const parseDate = (dateString) => {
                const [day, month, year] = dateString.split('/');
                return new Date(`${year}-${month}-${day}`);
            };

            const fromDateObj = parseDate(fromDate);
            const toDateObj = parseDate(toDate);

            if (isNaN(fromDateObj) || isNaN(toDateObj)) {
                return res.status(400).json({
                    status: 'Fail',
                    message: 'Invalid date format for fromDate or toDate',
                });
            }
            filter.sumitedDate = { $gte: fromDateObj, $lte: toDateObj };
        }
        const data = await User.find(filter).select('fullname email frontimage selfieimage backimage country kycstatus sumitedDate');
        if (!data || data.length === 0) {
            return res.status(400).json({
                status: 'Fail', message: "User Not Found"
            })
        } else {
            return res.status(200).json({
                status: 'success', message: "User Data fetch successfully", data: data
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail', message: "Internal server error"
        })
    }
}
module.exports.add_category = async (req, res) => {
    try {
        const { category } = req.body;
        console.log(req.body);
        const data = await categoryModel.create({
            category: category
        });
        return res.status(200).json({ status: 'success', message: "category data add successfully", data: data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'Fail', message: "Internal server error" });
    }
}
module.exports.get_category_data = async (req, res) => {
    try {
        const data = await categoryModel.find()

        if (data) {
            return res.status(200).json({
                status: "Success", message: "Category data fetch successfully", data: data
            });
        } else {
            return res.status(404).json({
                status: "Fail", message: "Category data not found"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'Fail', message: "Internal server error" })
    }
}
// module.exports.update_category = async (req,res) => {
//     try {
//         const categoryId = req.params.id; 

//         if(!categoryId) {
//             return res.status(404).json({
//                 status:"Fail", message:"Category not found"
//             })
//         }
//         const data = await categoryModel.findByIdAndUpdate(categoryId, {$set: {approve:true}}, {new:true});

//             return res.status(200).json({
//                 status:'Success',
//                 message:"Categoty approved successfully", data: data
//             });
//     } catch (error) {
//         console.log(error);
//         if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
//             return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
//         }
//         return res.status(500).json({ status:'fail',message:"Internal server error"});
//     }
// }
module.exports.delete_category = async (req, res) => {
    try {
        const categoryId = req.params.id;
        if (!categoryId) {
            return res.status(404).json({ status: "fail", message: 'Category data not found' });
        }
        const data = await categoryModel.findByIdAndDelete(categoryId);

        return res.status(200).json({ status: "Success", message: "Category deleted successfully" });
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: 'fail', message: "Internal server error" });
    }
}

// module.exports.get_tags_data = async (req,res) => {
//     try {
//         const data = await tagsModel.find();
//         if(data) {
//             return res.status(200).json({ status:'Success', message:"Tags data fetch successfully", data:data});
//         } else {
//             return res.status(404).json({ status:'Fail', message:"Tags data not found"})
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ status:'Fail', message:"Internsl server error"});
//     }
// }
// module.exports.update_tags_data = async (req,res) => {
//     try {
//         const tagsId = req.params.id;

//         if(!tagsId) {
//             return res.status(404).json({
//                 status:'Fail' ,message:"Tags data not found"
//             });
//         }
//         const tags = req.body.tags; 

//         const data = await tagsModel.findByIdAndUpdate(tagsId, { tags: tags }, { new: true });

//         return res.status(200).json({
//             status:"Success",
//             message:"Tags approved successfully", data:data
//         })
//     } catch (error) {
//         console.log(error);
//         if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
//             return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
//         }
//         return res.status(500).json({ status: 'Fail', message:"Internal server error "});
//     }
// }
// module.exports.delete_tags = async (req,res) => {
//     try {
//         const tagsId = req.params.id;

//         if(!tagsId) {
//             return res.status(404).json({
//                 status:'Fail', message:"Tags data not found"
//             });
//         } 
//         const data = await tagsModel.findByIdAndDelete(tagsId);

//         return res.status(200).json({
//             status:"Success",
//             message:"Tags deleted successfully"
//         })
//     } catch (error) {
//         console.log(error);
//         if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
//             return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
//         }
//         return res.status(500).json({
//             status:"fail",
//             message:"Internal server Error"
//         })
//     }
// }

module.exports.get_topic_data = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        const filter = {};

        if (fromDate && toDate) {
            const parseDate = (dateString) => {
                const [day, month, year] = dateString.split('/');
                return new Date(`${year}-${month}-${day}`);
            };

            const fromDateObj = parseDate(fromDate);
            const toDateObj = parseDate(toDate);

            if (isNaN(fromDateObj) || isNaN(toDateObj)) {
                return res.status(400).json({
                    status: 'Fail',
                    message: 'Invalid date format for fromDate or toDate',
                });
            }

            filter.createdAt = { $gte: fromDateObj, $lte: toDateObj };
        }
        const data = await topicModel.find(filter)
            .populate('categoryId', 'category')
            .populate('tagsId', 'tags')
            .populate('userId', 'username');
        if (data) {
            return res.status(200).json({ status: "Success", message: "Topic data fetch successfully", data: data });
        } else {
            return res.status(404).json({ status: 'Fail', message: 'Topic data not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}
module.exports.update_topic_data = async (req, res) => {
    try {
        const topicId = req.params.id;

        if (!topicId) {
            return res.status(404).json({ status: 'Fail', message: 'Topic data not found' });
        }

        const data = await topicModel.findByIdAndUpdate(topicId, { $set: { approve: req.body.approve } }, { new: true });

        return res.status(200).json({ status: "Success", message: "Topic updated successfully", data: data });
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: 'Fail', message: "Internal server error" });
    }
}
module.exports.delete_topic = async (req, res) => {
    try {
        const topicId = req.params.id;

        if (!topicId) {
            return res.status(404).json({ status: "Fail", message: "Topic data not found" });
        }
        const data = await topicModel.findByIdAndDelete(topicId);
        return res.status(200).json({
            status: "Success",
            message: "Topic deleted successfully"
        })
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({
            status: "Fail",
            message: "Internal Server error"
        })
    }
}
module.exports.trade_setting = async (req, res) => {
    try {
        const { markerFee, totalFee, disableTrade } = req.body;

        if (!req.params.id) {
            const data = await tradeModel.create({
                markerFee: markerFee,
                totalFee: totalFee,
                disableTrade: disableTrade
            });
            return res.status(200).json({ status: 'success', message: 'Trade data added successfully', data: data });

        } else {
            const data = await tradeModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    markerFee: markerFee,
                    totalFee: totalFee,
                    disableTrade: disableTrade
                },
                { new: true }
            );
            if (data) {
                return res.status(200).json({ status: 'success', message: 'Trade data update successfully', data: data });
            } else {
                return res.status(404).json({ status: 'Fail', message: 'Trade data not found' });
            };
        }
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: 'Fail', message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}
module.exports.mail_setting = async (req, res) => {
    try {
        const { Type, SMTPhost, SMTPport, username, password, senderName, senderEmail, encryption } = req.body;
        if (!req.params.id) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const data = await mailModel.create({
                Type: Type,
                SMTPhost: SMTPhost,
                SMTPport: SMTPport,
                username: username,
                password: hashedPassword,
                senderName: senderName,
                senderEmail: senderEmail,
                encryption: encryption
            });
            return res.status(200).json({ status: 'success', message: "Mail data add successfully", data: data });
        } else {
            const data = await mailModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    Type: Type,
                    SMTPhost: SMTPhost,
                    SMTPport: SMTPport,
                    username: username,
                    password: password,
                    senderName: senderName,
                    senderEmail: senderEmail,
                    encryption: encryption
                }, { new: true }
            );
            if (data) {
                return res.status(200).json({ status: 'success', message: 'Mail data update successfully', data: data });
            } else {
                return res.status(404).json({ status: 'Fail', message: "Mail not found" });
            }
        }
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: "Internal server Error" });
    }
}
module.exports.notification_setting = async (req, res) => {
    try {
        const { email, cryptoDeposits, cryptoWithdraw, flatDeposits, flatWithdraw, kycRecieved, newUseremail } = req.body;

        // Assuming you are trying to find an admin by email, use the correct query
        const adminEmail = await AdminModel.findOne({ email });

        if (!adminEmail) {
            return res.status(404).json({ status: 'Fail', message: 'Admin not Found' });
        }

        if (!req.params.id) {
            // Create operation
            const data = await notificationModel.create({
                email,
                cryptoDeposits,
                cryptoWithdraw,
                flatDeposits,
                flatWithdraw,
                kycRecieved,
                newUseremail
            });

            return res.status(200).json({ status: 'success', message: 'Notification setting added successfully', data: data });
        } else {
            // Update operation
            const data = await notificationModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    email,
                    cryptoDeposits,
                    cryptoWithdraw,
                    flatDeposits,
                    flatWithdraw,
                    kycRecieved,
                    newUseremail
                },
                { new: true }
            );

            if (data) {
                return res.status(200).json({ status: 'success', message: 'Notification setting updated successfully', data: data });
            } else {
                return res.status(404).json({ status: 'Fail', message: 'Notification setting not found' });
            }
        }
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: 'Fail', message: 'Invalid ID format' });
        }
        return res.status(500).json({
            status: 'Fail',
            message: 'Internal Server error'
        });
    }
};
module.exports.coinpayment_setting = async (req, res) => {
    try {
        const { IPNsecret, publicKey, privateKey, merchantID, payDepositeFee } = req.body;
        if (!req.params.id) {

            const data = await coinModel.create({
                IPNsecret: IPNsecret,
                publicKey: publicKey,
                privteKey: privateKey,
                merchantID: merchantID,
                payDepositeFee: payDepositeFee,
            });
            return res.status(200).json({ status: 'success', message: "Coin Payment data add successfully", data: data });
        } else {
            const data = await coinModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    IPNsecret: IPNsecret,
                    publicKey: publicKey,
                    privteKey: privateKey,
                    merchantID: merchantID,
                    payDepositeFee: payDepositeFee,
                }, { new: true }
            );
            if (data) {
                return res.status(200).json({ status: 'success', message: 'Coin Payment data update successfully', data: data });
            } else {
                return res.status(404).json({ status: 'Fail', message: "Coin Payment not found" });
            }
        }
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: 'Fail', message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}
module.exports.ethereum_setting = async (req, res) => {
    try {
        const { wallet, privateKey } = req.body;
        if (!req.params.id) {

            const data = await ethereumModel.create({
                wallet: wallet,
                privateKey: privateKey,
            });
            return res.status(200).json({ status: 'success', message: "Ethereum data add successfully", data: data });
        } else {
            const data = await ethereumModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    wallet: wallet,
                    privateKey: privateKey,
                }, { new: true }
            );
            if (data) {
                return res.status(200).json({ status: 'success', message: 'Ethereum data update successfully', data: data });
            } else {
                return res.status(404).json({ status: 'Fail', message: "Ethereum data not found" });
            }
        }
    } catch (error) {
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: 'Fail', message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}
module.exports.tron_setting = async (req, res) => {
    try {
        const { wallet, privateKey } = req.body;
        if (!req.params.id) {

            const data = await tronModel.create({
                wallet: wallet,
                privateKey: privateKey,
            });
            return res.status(200).json({ status: 'success', message: "Tron data add successfully", data: data });
        } else {
            const data = await tronModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    wallet: wallet,
                    privateKey: privateKey,
                }, { new: true }
            );
            if (data) {
                return res.status(200).json({ status: 'success', message: 'Tron data update successfully', data: data });
            } else {
                return res.status(404).json({ status: 'Fail', message: "Tron data not found" });
            }
        }
    } catch (error) {
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: 'Fail', message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}
module.exports.binance_setting = async (req, res) => {
    try {
        const { wallet, privateKey } = req.body;
        if (!req.params.id) {

            const data = await binanceModel.create({
                wallet: wallet,
                privateKey: privateKey,
            });
            return res.status(200).json({ status: 'success', message: "Binance data add successfully", data: data });
        } else {
            const data = await binanceModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    wallet: wallet,
                    privateKey: privateKey,
                }, { new: true }
            );
            if (data) {
                return res.status(200).json({ status: 'success', message: 'Binance data update successfully', data: data });
            } else {
                return res.status(404).json({ status: 'Fail', message: "Binance not found" });
            }
        }
    } catch (error) {
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: 'Fail', message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}
module.exports.stripe_setting = async (req, res) => {
    try {
        const { publicKey, secretKey, baseCurrency } = req.body;
        if (!req.params.id) {

            const data = await stripeModel.create({
                publicKey: publicKey,
                secretKey: secretKey,
                baseCurrency: baseCurrency,
            });
            return res.status(200).json({ status: 'success', message: "Stripe data add successfully", data: data });
        } else {
            const data = await stripeModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    publicKey: publicKey,
                    secretKey: secretKey,
                    baseCurrency: baseCurrency,
                }, { new: true }
            );
            if (data) {
                return res.status(200).json({ status: 'success', message: 'Stripe data update successfully', data: data });
            } else {
                return res.status(404).json({ status: 'Fail', message: "Stripe data not found" });
            }
        }
    } catch (error) {
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: 'Fail', message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}
module.exports.recaptcha_setting = async (req, res) => {
    try {
        const { recaptcha, siteKey, secretKey } = req.body;
        if (!req.params.id) {

            const data = await recaptchaModel.create({
                recaptcha: recaptcha,
                siteKey: siteKey,
                secretKey: secretKey,
            });
            return res.status(200).json({ status: 'success', message: "Recaptcha data add successfully", data: data });
        } else {
            const data = await recaptchaModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    recaptcha: recaptcha,
                    siteKey: siteKey,
                    secretKey: secretKey,
                }, { new: true }
            );
            if (data) {
                return res.status(200).json({ status: 'success', message: 'Recaptcha data update successfully', data: data });
            } else {
                return res.status(404).json({ status: 'Fail', message: "Recaptcha data not found" });
            }
        }
    } catch (error) {
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: 'Fail', message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
}
module.exports.social_setting = async (req, res) => {
    try {
        const { youtube, telegram, facebook, twitter, reddit, instagram, discore, medium } = req.body;
        if (!req.params.id) {
            const data = await socialModel.create({
                youtube: youtube,
                telegram: telegram,
                facebook: facebook,
                twitter: twitter,
                reddit: reddit,
                instagram: instagram,
                discore: discore,
                medium: medium,
            });
            return res.status(200).json({ status: "success", message: "Social Network data add successfully", data: data });
        } else {
            const data = await socialModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    youtube: youtube,
                    telegram: telegram,
                    facebook: facebook,
                    twitter: twitter,
                    reddit: reddit,
                    instagram: instagram,
                    discore: discore,
                    medium: medium,
                },
                { new: true });
            if (data) {
                return res.status(200).json({ status: 'Success', message: "Social Network data Update successfully", data: data });
            } else {
                return res.status(404).json({ status: 'Fail', message: "Social Network data not found" })
            }
        }
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId') {
            return res.status(400).json({ status: 'Fail', message: 'Invalid ID format' });
        }
        return res.status(500).json({ status: 'Fail', message: "Internal server error" });
    }
}
module.exports.push_notification = async (req, res) => {
    try {
        const { title, body } = req.body;

        const tokens = await fcmTokenModel.find({});

        if (tokens.length === 0) {
            return res.status(400).json({ status: "Fail", message: "FCM token not Found" });
        }
        const message = {
            notification: {
                title: title,
                body: body
            },
        };
        let successCount = 0;
        let failureCount = 0;

        for (let fcmtokendb of tokens) {
            try {
                message.token = fcmtokendb.fcmtoken;
                const response = await admin.messaging().send(message);
                console.log("response", response);
                successCount++;
            } catch (error) {
                console.log('Error sending notification to token:', fcmtokendb.fcmtoken, error);
                failureCount++;
            }
        }
        res.status(200).send(`Notifications sent successfully to ${successCount} devices. Failed to send to ${failureCount} devices.`);


        // console.log("msg",message);
        // const response = await admin.messaging().send(message);
        // console.log('Notification sent successfully:', response);
        // res.status(200).send('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).send('Error sending notification');
    }
}


// module.exports.push_notification = async (req, res) => {
//     const { userId, title, body } = req.body;
//     console.log("req", req.body);

//     // This will return an array of documents
//     const userTokens = await userToken.find({ userId: userId });
//     console.log("userTokens", userTokens);

//     if (!userTokens.length || !userTokens[0].token) {
//         return res.status(404).send('User not found or FCM token not available');
//     }

//     const registrationToken = userTokens[0].token; // Assuming you want the first token in the array

//     const message = {
//         notification: {
//             title: title,
//             body: body
//         },
//         token: registrationToken
//     };
//     console.log("registrationToken", registrationToken);

//     console.log("message", message);

//     try {
//         console.log("enter message");
//         const response = await admin.messaging().send(message);
//         console.log('Successfully sent message:', response);
//         res.status(200).send('Notification sent successfully');
//     } catch (error) {
//         console.error('Error sending notification:', error);
//         res.status(500).send('Failed to send notification');
//     }
// };




// module.exports.add_mail_setting = async (req,res) => {
//     try {
//         const { Type, SMTPhost, SMTPport, username, password, senderName, senderEmail, encryption} = req.body;

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const data = await mailModel.create({
//             Type: Type,
//             SMTPhost: SMTPhost,
//             SMTPport: SMTPport,
//             username: username,
//             password: hashedPassword,
//             senderName: senderName,
//             senderEmail: senderEmail,
//             encryption: encryption
//         });
//         return res.status(200).json({ status:'success', message: "Mail data add successfully", data: data });
//     }  catch (error) {
//         console.log(error);
//         return res.status(500).json({ status:"Fail", message:"Interna server error" });
//     } 
// }
// module.exports.update_mail_setting = async (req,res) => {
//     try {
//         const { Type, SMTPhost, SMTPport, username, password, senderName, senderEmail, encryption} = req.body;

//         const data = await mailModel.findByIdAndUpdate(
//             {_id:req.params.id},
//             {
//                 Type: Type,
//                 SMTPhost: SMTPhost,
//                 SMTPport: SMTPport,
//                 username: username,
//                 password: password,
//                 senderName: senderName,
//                 senderEmail: senderEmail,
//                 encryption: encryption
//             },{ new: true}
//         );
//         if(data) {
//             return res.status(200).json({ status:'success', message:'Mail data update successfully', data:data });
//         } else {
//             return res.status(404).json({ status:'Fail', message:"Mail not found" });
//         }
//     } catch (error) {
//         console.log(error);
//         if(error instanceof mongoose.Error.CastError && error.path === '_id' && error.kind === 'ObjectId'){
//             return res.status(400).json({ status: "Fail", message: 'Invalid ID format' });
//         }
//         return res.status(500).json({ status:"Fail", message:"Internal server Error" });
//     }
// }
// module.exports.update_profile = async (req, res) => {
//     try {
//         const { RegisteredDate, KycStatus, EmailStatus, UserStatus } = req.body;

//         const email = req.user.email
//         // console.log(req.user,"user");

//         const user = await UserModel.findOne({ email });
//         // console.log(req.user.email, "email");

//         if (!user) {
//             return res.status(404).json({ status: "Fail", message:'User not found'});
//         }

//         user.RegisteredDate = RegisteredDate;
//         user.KycStatus = KycStatus;
//         user.EmailStatus = EmailStatus;
//         user.UserStatus = UserStatus;

//         await user.save();

//         // console.log(user, "user");

//         res.status(200).json({ status: "Success", message: 'Profile updated successfully' });

//     } catch (err) {
//         // console.error(error);
//         res.status(500).json({status: "Fail", message: "Internal server error"});
//     }
// };

// module.exports.get_user_profile = async (req,res)=>{
//     try {

//         // const userId = req.body._id
//         const userId = req.params.userId
//         // console.log("USERID",userId);
//         const user = await UserModel.findById(userId);
//         // console.log("USER",user);
//         if (!user) {
//             return res.status(404).json({ status: "Fail", message:'User not found'});
//         }

//         const userProfile = {
//             email: user.email,
//             RegisteredDate: user.RegisteredDate,
//             KycStatus: user.KycStatus,
//             EmailStatus: user.EmailStatus,
//             UserStatus: user.UserStatus,
//         };

//         return res.status(200).json({ status:"Success",message:"User get successfully",data:userProfile });

//     } catch (err) {
//         console.log(err.message);
//        return res.status(500).json({ status:"Fail",message:"Internal server error"});
//     }
// }

// POST endpoint to handle staking form data
module.exports.post_staking = async (req, res) => {
    const {
        currency,
        status,
        minStakingAmount,
        maxStakingAmount,
        allowedDays,
        allowedPercentages
    } = req.body;

    // Create a new staking document
    const newStaking = new Staking({
        currency,
        status,
        minStakingAmount,
        maxStakingAmount,
        allowedDays: allowedDays.split(',').map(day => parseInt(day.trim())),
        allowedPercentages: allowedPercentages.split(',').map(percentage => parseFloat(percentage.trim()))
    });

    try {
        // Save the new staking document to the database
        await newStaking.save();
        console.log('Staking form data stored:', newStaking);

        // Respond with a success message
        res.status(200).json({ message: 'Staking form data received and stored successfully' });
    } catch (error) {
        console.error('Error storing staking form data:', error);
        res.status(500).json({ message: 'Failed to store staking form data' });
    }
};

module.exports.get_staking = async (req, res) => {
    try {
        const stakingData = await Staking.find();
        res.status(200).json(stakingData);
    } catch (error) {
        console.error('Error fetching staking data:', error);
        res.status(500).json({ message: 'Failed to fetch staking data' });
    }
};

// PUT endpoint to update a staking record
module.exports.update_staking = async (req, res) => {
    const { id } = req.params;
    const {
        currency,
        status,
        minStakingAmount,
        maxStakingAmount,
        allowedDays,
        allowedPercentages
    } = req.body;

    try {
        const stakingData = await Staking.findById(id);
        if (!stakingData) {
            return res.status(404).json({ message: 'Staking data not found' });
        }

        stakingData.currency = currency;
        stakingData.status = status;
        stakingData.minStakingAmount = minStakingAmount;
        stakingData.maxStakingAmount = maxStakingAmount;
        stakingData.allowedDays = allowedDays.split(',').map(day => parseInt(day.trim()));
        stakingData.allowedPercentages = allowedPercentages.split(',').map(percentage => parseFloat(percentage.trim()));

        await stakingData.save();
        console.log('Staking form data updated:', stakingData);

        res.status(200).json({ message: 'Staking form data updated successfully' });
    } catch (error) {
        console.error('Error updating staking form data:', error);
        res.status(500).json({ message: 'Failed to update staking form data' });
    }
};

// DELETE endpoint to delete a staking record
module.exports.delete_staking = async (req, res) => {
    const { id } = req.params;

    try {
        const stakingData = await Staking.findByIdAndDelete(id);
        if (!stakingData) {
            return res.status(404).json({ message: 'Staking data not found' });
        }

        console.log('Staking form data deleted:', stakingData);
        res.status(200).json({ message: 'Staking form data deleted successfully' });
    } catch (error) {
        console.error('Error deleting staking form data:', error);
        res.status(500).json({ message: 'Failed to delete staking form data' });
    }
};

module.exports.getstakingyid = async (req, res) => {
    try {
        const stakingId = req.params.id;
        const stakingData = await Staking.findById(stakingId);
        if (!stakingData) {
            return res.status(404).json({ message: 'Staking data not found' });
        }
        res.status(200).json(stakingData);
    } catch (error) {
        console.error('Error fetching staking data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

