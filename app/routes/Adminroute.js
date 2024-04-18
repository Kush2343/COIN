const AdminController = require("../controller/Admin.js")
const auth = require("../middleware/adminauth.js");
const upload = require('../middleware/multer');
const { validation } = require("../views/validate.js");
const Stacking = require("../controller/Stacking.js")

module.exports = (admin) => {
    admin.post("/admin_login", validation('adminverify'), AdminController.Admin_login)

    admin.post("/verify_otp", validation('adminverify'), AdminController.verify_otp)

    admin.post("/add_currency", auth, upload.fields([{ name: 'currencyimg', maxCount: 1 }]), validation("currency"), AdminController.add_currency)
    admin.delete("/delete_currency/:id", auth, AdminController.delete_currency)
    admin.put("/update_currency/:id", auth, upload.fields([{ name: 'currencyimg', maxCount: 1 }]), validation("currency"), AdminController.update_currency)
    admin.get("/get_all_currencies", auth, AdminController.get_all_currencies)
    admin.post("/search_currency", auth, AdminController.search_currency)

    admin.post("/add_blogs", auth, validation("blog"), AdminController.add_blogs)
    admin.put("/update_blog/:id", auth, validation("blog"), AdminController.update_blog)
    admin.delete("/delete_blog/:id", auth, AdminController.delete_blog)
    admin.get("/get_all_blogs", AdminController.get_all_blogs)
    admin.post("/search_blog", auth, AdminController.search_blog)

    admin.post("/notifications", auth, AdminController.notifications)

    admin.get("/get_wallet_transactions", auth, AdminController.getWalletTransactions);

    admin.post("/user_verify/:id", auth, AdminController.user_verify)
    admin.get("/user_verfiy_list", auth, AdminController.user_verfiy_list)
    admin.post("/user_status/:id", auth, AdminController.user_status)
    admin.get("/get_all_user", auth, AdminController.get_all_user)
    admin.post('/search_user', auth, AdminController.search_user)
    admin.get("/wallet_request", auth, AdminController.wallet_request)
    admin.get("/get_all_transictions", auth, AdminController.get_all_transictions)
    admin.post('/search_transictions', auth, AdminController.search_transictions);
    admin.put("/update_transiction_status/:id", auth, validation('updatestatus'), AdminController.update_transiction_status)

    // admin.post ('/add_bank_details',auth,AdminController.add_bank_datails);
    // admin.put('/update_bank_details/:id',auth,AdminController.update_bank_details);
    // admin.get('/get_bank_detalis',auth,AdminController.get_bank_details);
    // admin.delete('/delete_bank_detalis/:id',auth,AdminController.delete_bank_details);
    // admin.post('/select_bank_account',auth,AdminController.select_bank_account);

    admin.post('/add_bank_details', auth, validation('bankdetails'), AdminController.add_bank_datails);
    admin.put('/update_bank_details/:id', auth, AdminController.update_bank_details);
    admin.get('/get_bank_detalis', auth, AdminController.get_bank_details);
    admin.delete('/delete_bank_detalis/:id', auth, AdminController.delete_bank_details);
    admin.post('/select_bank_account', auth, AdminController.select_bank_account);

    admin.post('/kyc_status', auth, AdminController.kyc_status);
    admin.get('/get_kyc_data', auth, AdminController.get_kyc_data);

    admin.post('/add_category', auth, validation('category'), AdminController.add_category);
    admin.get('/get_category_data', auth, AdminController.get_category_data);
    // admin.put('/update_category/:id',auth,AdminController.update_category);
    admin.delete('/delete_category/:id', auth, AdminController.delete_category);

    // admin.get('/get_tags_data',auth,AdminController.get_tags_data);
    // admin.put('/update_tags_data/:id',auth,AdminController.update_tags_data);
    // admin.delete('/delete_tags/:id',auth,AdminController.delete_tags);

    admin.get('/get_topic_data', auth, AdminController.get_topic_data);
    admin.put('/update_topic_data/:id', auth, AdminController.update_topic_data);
    admin.delete('/delete_topic/:id', auth, AdminController.delete_topic);

    admin.post('/trade_setting/:id?', auth, validation('addTrade'), AdminController.trade_setting);
    admin.post('/mail_setting/:id?', auth, validation('addMail'), AdminController.mail_setting);
    admin.post('/notification_setting/:id?', auth, validation('notification'), AdminController.notification_setting);
    admin.post('/coinpayment_setting/:id?', auth, validation('coinpayment'), AdminController.coinpayment_setting);
    admin.post('/ethereum_setting/:id?', auth, validation('Ethereum'), AdminController.ethereum_setting);
    admin.post('/tron_setting/:id?', auth, validation('tron'), AdminController.tron_setting);
    admin.post('/binance_setting/:id?', auth, validation('binance'), AdminController.binance_setting);
    admin.post('/stripe_setting/:id?', auth, validation('stripe'), AdminController.stripe_setting);
    admin.post('/recaptcha_setting/:id?', auth, validation('recaptcha'), AdminController.recaptcha_setting);
    admin.post('/social_setting/:id?', auth, AdminController.social_setting);

    admin.post('/push_notification', auth, AdminController.push_notification);

    admin.post('/post_staking', auth, AdminController.post_staking);
    admin.get('/get_staking', auth, AdminController.get_staking);
    admin.put('/update_staking/:id', auth, AdminController.update_staking);
    admin.delete('/delete_staking/:id', auth, AdminController.delete_staking);
    admin.get('/getstakingyid/:id', auth, AdminController.getstakingyid);
    // admin.post ("/update_profile",auth,AdminController.update_profile)
    // admin.get ("/get_user_profile/:userId",auth,AdminController.get_user_profile )
    // admin.get("/get_all_user",auth,AdminController.get_all_user)

 //Only Owner Function
    admin.post("/fundContract",Stacking.fundContract)
    admin.post("/useStakedFunds",Stacking.useStakedFunds)
    admin.post("/useRewardFunds",Stacking.useRewardFunds)
    
}
