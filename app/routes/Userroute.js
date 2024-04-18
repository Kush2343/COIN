
const upload = require('../middleware/multer');
const UserController = require("../controller/User.js")
const Transactions = require("../controller/Transactions.js")
const Stacking = require("../controller/Stacking.js")
const auth = require("../middleware/auth.js")
const communityAuth = require('../middleware/communityauth.js')
const { validation } = require("../views/validate.js")
const Tokens = require("../controller/tokenList.js")
const networkConfigMiddleware = require("../middleware/networkConfigMiddleware.js");
const { registerWalletUser, VerifyPhrase, fetchBalanceAndRetrieveWallet } = require('../controller/Wallet.js');
module.exports = (user) => {

    user.post("/get_user_otp", UserController.get_user_otp)
    // user.post("/get_user_otp",UserController.get_user_otp)
    user.post("/user_otp_verify", validation('verify'), UserController.user_otp_verify)

    user.post("/user_signup", validation('signup'), UserController.user_signup)
    user.post("/user_login", validation('verify'), UserController.user_login)
    user.post("/user_google_login", UserController.user_google_login)
    user.get("/news", UserController.news)
    user.get("/fetchNews", UserController.fetchNews)
    user.put("/user_profile_update", auth, validation("updateuser"), UserController.user_profile_update)
    user.delete("/user_delete/:id", auth, UserController.user_delete)
    user.get('/get_user_data', auth, UserController.get_user_data);

    user.post('/wallet_transactionsbit', auth, UserController.wallet_transactionsbit);

    user.post("/forget_password", validation('verify'), UserController.forget_password)
    user.post("/reset_password", validation('verify'), UserController.reset_password)

    user.post("/community_user_signup", validation('community'), UserController.community_user_signup);
    user.post("/community_user_login", validation('communityLogin'), UserController.community_user_login);


    user.get('/get_category', UserController.get_category);
    user.get('/category_in_topic/:id?', UserController.category_in_topic)

    user.post("/add_tags", communityAuth, validation('tags'), UserController.add_tags);
    user.get('/get_tags', UserController.get_tags);
    user.post('/update_tags_data', communityAuth, UserController.update_tags_data);
    user.get('/tags_in_topic/:id?', UserController.tags_in_topic);

    user.post("/add_topic", communityAuth, UserController.add_topic);
    user.get("/get_all_topic", UserController.get_all_topic);
    user.get('/search_topic', UserController.search_topic)

    user.post('/add_comments', validation('comments'), communityAuth, UserController.add_comments);
    user.get('/get_comments/:id', UserController.get_comments);
    // user.get('/get_topic_comments',UserController.get_topic_comments);
    user.post('/comment_solution', communityAuth, UserController.comment_solution);
    user.post('/comments_like', communityAuth, UserController.comments_like);
    user.post('/comments_unlike', communityAuth, UserController.comments_unlike);

    // user.get("/all_topic_details",UserController.all_topic_details);

    user.post("/wallet_deposit", auth, validation('deposit'), UserController.wallet_deposit)
    user.post("/wallet_withdrow", auth, validation('withdraw'), UserController.wallet_withdrow)
    user.get("/get_all_wallet_transiction", auth, UserController.get_all_wallet_transiction)
    user.get("/get_wallet", auth, UserController.get_wallet)

    user.get("/get_seed_words", auth, UserController.get_seed_words)
    user.post("/select_seed", auth, UserController.select_seed)
    user.get("/get_select_seed", auth, UserController.get_select_seed)
    user.post("/match_seed", auth, UserController.match_seed)

    user.get('/view_blog/:id', UserController.view_blog);
    user.post('/get_fcmToken', UserController.get_fcmToken);

    user.post("/sendTransaction",Transactions.SendTransaction)
    user.get("/getUserTransaction/:username",Transactions.FetchUserTransactions)

    user.get("/unique-platforms",Tokens.getListofPlatform)
    user.get("/tokens/:platform",Tokens.getTokenbyPlatform)
    user.post("/prepare-transfer",networkConfigMiddleware,Transactions.sendUSDTtransfer)
    user.get("/getplatform/:tokenName",Tokens.getListofPlatformbyTokenName )

    user.post("/stacktokens",Stacking.stakeTokens)
    user.post("/storeStackingTransaction",Stacking.storeStakingTransaction)
    user.get('/totalStaked', Stacking.getTotalStaked);
    user.get('/totalRewardFunds', Stacking.getTotalRewardFunds);
    user.get('/stakeDetails', Stacking.getStakeDetails);
    user.get('/totalBalance', Stacking.getTotalBalance);
    user.get("/claimReward",Stacking.getClaimTxData)
    user.post("/calculateReward",Stacking.calculateReward)

    user.post("/sendETH",Transactions.SendETHTransaction)

    //WALLET CREATION
    user.post("/generatePhrase",registerWalletUser)
    user.post("/verifyPhrase",VerifyPhrase)
    user.post("/fetchAccountBalance",fetchBalanceAndRetrieveWallet)
 
}   