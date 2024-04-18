const { email, phonenumber, fullname, address, pincode, documentupload, DOB, currencyname, symbol, type, sign, price, publishon, title, description, author, status, visibility,
  tags, bankdetails, amount, bankname, bankholdername, banknumber, accountnumber, ifsccode, country, emailId, password, name, username, confirmpassword,categoryId, tagsId, category, topicname,
   markerFee, totalFee, disableTrade, Type, SMTPhost, SMTPport, senderEmail, senderName,encryption, IPNsecret, publicKey ,privateKey, merchantID, wallet, secretKey, baseCurrency,
  siteKey } = require("../views/validation");
module.exports.validation = function (method) {

  switch (method) {

    case "signup":
      return [email, phonenumber, fullname, address, pincode, documentupload, DOB, country];
    case "updateuser":
      return [email, phonenumber, fullname, address, pincode, DOB]
    case "verify":
      return [email, phonenumber];
    case "adminverify":
      return [email];
    case "currency":
      return [currencyname, symbol, type, sign, price]
    case "blog":
      return [publishon, title, description, author, status, tags, visibility]
    case "deposit":
      return [bankdetails, amount]
    case "withdraw":
      return [amount];
    case "updatestatus":
      return [status]
    case "community":
      return [emailId, confirmpassword, password, name]
    case "communityLogin":
      return [emailId, password]
    // case "profileupdate":
    //   return [email,address,]
    case "bankdetails":
      return [bankname, bankholdername, banknumber, accountnumber, ifsccode]
    case "category":
      return [category]
    case "tags":
      return [tags]
    case "addTopic":
      return [topicname, categoryId, tagsId, description]
    case "comments":
      return [description]
    case "addTrade":
        return [markerFee, totalFee, disableTrade]
    case "addMail" :
      return [Type, SMTPhost, SMTPport, username, password,senderName, senderEmail, encryption]
    case "notification" :
      return [emailId]
    case "coinpayment" :
      return [ IPNsecret, publicKey, privateKey, merchantID]
    case "Ethereum" :
      return [ wallet, privateKey]
    case "tron" :
      return [wallet, privateKey]
    case "binance":
      return [wallet, privateKey]
    case "stripe" :
      return [publicKey, secretKey,baseCurrency]
    case "recaptcha" :
      return [siteKey, secretKey]
    default:
      throw new Error("Invalid validation method");
  }
};