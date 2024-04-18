const Joi = require("joi");

exports.email = function (req, res, next) {
  console.log("bodyreq",req.body);
  const { email } = req.body;

  const emailSchema = Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
    .messages({
      "string.base": "Email Must Be A String",
      "string.email": "Invalid Email Format",
    });
  if (email !== '') {
    const { error: emailError } = emailSchema.validate(email);
    if (emailError) {
      return res.status(400).json({
        status: "fail",
        message: emailError.message,
      });

    }
  }
  next();
};

exports.phonenumber = function (req, res, next) {
  const { phonenumber } = req.body;

  const phonenumberSchema = Joi.string()
    .min(10)
    .max(10)
    .pattern(/^[0-9]+$/)
    .messages({
      "string.base": "Phone number must be a string",
      "string.min": "Phone number must be at least {{#limit}} characters long",
      "string.max": "Phone number cannot be longer than {{#limit}} characters",
      "string.pattern.base": "Phone number must contain only numeric digits"
    });


  if (phonenumber !== '') {
    const { error } = phonenumberSchema.validate(phonenumber);

    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
  }
  next();
};
// exports.mobileNo = function (req, res, next) {
  //   const { mobileNumber } = req.body;
  //   if (mobileNumber === null || mobileNumber === undefined || mobileNumber === "") {
  //     return res.status(400).json({
  //       status: "fail",
  //       message: "Mobile Number Cannot Be Empty",
  //     });
  //   }
  //   const mobileNumberSchema = Joi.string()
  //     .min(10)
  //     .max(10)
  //     .required()
  //     .messages({
  //       "string.base": "Mobile Number Must Be A Number",
  //       "string.min": "Mobile Number Must Have At Least 10 Digits",
  //       "string.max": "Mobile Number Cannot Have More Than 10 Digits",
  //       "any.required": "Required field: Mobile Number",
  //     });
  //   const { error: mobileNumberError } = mobileNumberSchema.validate(mobileNumber);
  //   if (mobileNumberError) {
  //     return res.status(400).json({
  //       status: "fail",
  //       message: mobileNumberError.message,
  //     });
  //   } else {
  //     next();
  //   }
  // };
exports.fullname = function (req, res, next) {
  console.log(req.body, "body");
  const { fullname } = req.body;

  const fullnameSchema = Joi.string()
    .required()
    .messages({
      "any.required": "Required field: fullname",
      "string.empty": "fullname cannot be empty",
    });

  const { error:fullnameError } = fullnameSchema.validate(fullname);

  if (fullnameError) {
    console.log(fullnameError);
    return res.status(400).json({
      status: "fail",
      message: fullnameError.message,
    });
  }else {
        next();
      }
};

exports.password = function (req, res, next) {
  console.log(req.body, "body");
  const { password } = req.body;

  const passwordSchema = Joi.string()
    .required()
    .messages({
      "any.required": "Required field: password",
      "string.empty": "password cannot be empty",
    });

  const { error:passwordError } = passwordSchema.validate(password);

  if (passwordError) {
    console.log(passwordError);
    return res.status(400).json({
      status: "fail",
      message: passwordError.message,
    });
  }else {
        next();
      }
};
exports.address = function (req, res, next) {
  const { address } = req.body;

  const addressSchema = Joi.string()
    .required()
    .messages({
      "string.base": "address must be a string",
      "any.required":"Required feild : address",
      "string.empty": "address cannot be empty",
    });
  const { error } = addressSchema.validate(address);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }

  next();
};

exports.country = function (req, res, next) {
  const { country } = req.body;

  const countrySchema = Joi.string()
    .required()
    .pattern(/^[^0-9]+$/)
    .messages({
      "string.base": "country must be a string",
      "any.required":"Required feild : country",
      "string.empty": "country cannot be empty",
      "string.pattern.base": "country cannot contain numbers",
    });
  const { error } = countrySchema.validate(country);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }

  next();
};

exports.pincode = function (req, res, next) {
  const { pincode } = req.body;

  const pincodeSchema = Joi.string()
    .required()
    .pattern(/^[0-9]+$/)
    .messages({
      "string.pattern.base": "pincode must contain only numeric digits",
      "any.required":"Required feild: pincode",
      "string.empty": "pincode cannot be empty",
    });

  const { error } = pincodeSchema.validate(pincode);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }

  next();
};

exports.documentupload = function (req, res, next) {
  const { documentupload } = req.body;
  const allowedStatusValues = ['Passport','Driving License','Aadhaar card'];


  const documentuploadSchema = Joi.string()
  .valid(...allowedStatusValues)
    .required()
    .messages({
      "any.required":"Required feild : documentupload",
      "any.only": `Documentupload must be one of: ${allowedStatusValues.join(', ')}`
    });
  const { error } = documentuploadSchema.validate(documentupload);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();

};


// exports.validateFiles = (req, res, next) => {
//   console.log(req.files);
//   const fileSchema = Joi.object({
//     frontimage: Joi.array().items(
//       Joi.object({
//         fieldname: Joi.string().required(),
//         size: Joi.number().max(1024 * 1024).required(),
//       })
//     ).required().messages({'any.required':'frontimage is required'}),
//     backimage: Joi.array().items(
//       Joi.object({
//         fieldname: Joi.string().required(),
//         size: Joi.number().max(1024 * 1024).required(),
//       })
//     ).required().messages({'any.required':'backimage is required'}),
//     selfieimage: Joi.array().items(
//       Joi.object({
//         fieldname: Joi.string().required(),
//         size: Joi.number().max(1024 * 1024).required(),
//       })
//     ).required().messages({'any.required':'selfieimage is required'})
//   });

//   const { error } = fileSchema.validate(req.files);

//   if (error) {
//     console.log(error);
//     return res.status(400).json({
//       status: 'fail',
//       message: error.details[0].message,
//     });
//   }

//   next();
// };

exports.DOB = function (req, res, next) {
  console.log(req.body);
  const { DOB } = req.body;
  if (!DOB) {
    return res.status(400).json({
      status: 'fail',
      message: 'DOB is required',
    });
  }
  const DOBSchema = Joi.string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/)
    .messages({
      'string.pattern.base': 'DOB must be in the format DD-MM-YYYY'
    });

  const { error } = DOBSchema.validate(DOB);

  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }

  next();
};

exports.currencyname = function (req, res, next) {
  const { currencyname } = req.body;

  const currencynameSchema = Joi.string()
    .required()
    // .empty('')
    .pattern(/^[^0-9]+$/)
    .messages({
      "any.required":"Required feild : currencyname",
      "String.base":"currencyname must be a string",
      "string.empty": "currencyname cannot be empty",
      "string.pattern.base": "currencyname cannot contain numbers"
    });
  const { error } = currencynameSchema.validate(currencyname);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};

exports.symbol = function (req, res, next) {
  const { symbol } = req.body;

  const symbolSchema = Joi.string()
    .required()
    // .empty('')
    .pattern(/^[^0-9]+$/)
    .messages({
      "any.required":"Required feild : symbol",
      "String.base":"symbol must be a string",
      "string.empty": "symbol cannot be empty",
      "string.pattern.base": "symbol cannot contain numbers"
    });
  const { error } = symbolSchema.validate(symbol);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};

exports.type = function (req, res, next) {
  const { type } = req.body;

  const typeSchema = Joi.string()
    .required()
    // .empty('')
    .pattern(/^[^0-9]+$/)
    .messages({
      "any.required":"Required feild : type",
      "String.base":"type must be a string",
      "string.empty": "type cannot be empty",
      "string.pattern.base": "type cannot contain numbers"
    });
  const { error } = typeSchema.validate(type);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};

exports.sign = function (req, res, next) {
  const { sign } = req.body;

  const signSchema = Joi.string()
    .required()
    // .empty('')
    .pattern(/^[^0-9]+$/)
    .messages({
      "any.required":"Required feild : sign",
      "String.base":"sign must be a string",
      "string.empty": "sign cannot be empty",
      "string.pattern.base": "sign cannot contain numbers"
    });
  const { error } = signSchema.validate(sign);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};

exports.price = function (req, res, next) {
  const { price } = req.body;

  const priceSchema = Joi.string()
    .required()
    // .empty('')
    .pattern(/^[0-9]+$/)
    .messages({
      "any.required":"Required feild : price",
      // "String.base":"price must be a string",
      "string.empty": "price cannot be empty",
      "string.pattern.base": "price must contain only numeric digits",
    });
  const { error } = priceSchema.validate(price);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};

exports.publishon = function (req, res, next) {
  console.log(req.body);
  const { publishon } = req.body;
  if (!publishon) {
    return res.status(400).json({
      status: 'fail',
      message: 'required feild: publishon',
    });
  }
  const publishonSchema = Joi.string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/)
    .messages({
      'string.pattern.base': 'publishon must be in the format DD-MM-YYYY'
    });

  const { error } = publishonSchema.validate(publishon);

  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }

  next();
};

exports.title = function (req, res, next) {
  const { title } = req.body;

  const titleSchema = Joi.string()
    .required()
    // .empty('')
    .pattern(/^[^0-9]+$/)
    .messages({
      "any.required":"Required feild : title",
      "String.base":"title must be a string",
      "string.empty": "title cannot be empty",
      "string.pattern.base": "title cannot contain numbers"
    });
  const { error } = titleSchema.validate(title);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};

exports.description = function (req, res, next) {
  const { description } = req.body;

  const descriptionSchema = Joi.string()
    .required()
    // .empty('')
    .messages({
      "any.required":"Required feild : description",
      "String.base":"description must be a string",
      "string.empty": "description cannot be empty",
    });
  const { error } = descriptionSchema.validate(description);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};

exports.author = function (req, res, next) {
  const { author } = req.body;

  const authorSchema = Joi.string()
    .required()
    // .empty('')
    .pattern(/^[^0-9]+$/)
    .messages({
      "any.required":"Required feild : author",
      "String.base":"author must be a string",
      "string.empty": "author cannot be empty",
      "string.pattern.base": "author cannot contain numbers"
    });
  const { error } = authorSchema.validate(author);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};

exports.status = function (req, res, next) {
  const { status } = req.body;

  const allowedStatusValues = ['successful', 'pending', 'fail'];

  const statusSchema = Joi.string()
  .valid(...allowedStatusValues)
    .required()
    // .empty('')
    .pattern(/^[^0-9]+$/)
    .messages({
      "any.required":"Required feild : status",
      "String.base":"status must be a string",
      "string.empty": "status cannot be empty",
      "string.pattern.base": "status cannot contain numbers",
      "any.only": `Status must be one of: ${allowedStatusValues.join(', ')}`
    });
  const { error } = statusSchema.validate(status);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};


exports.tags = function (req, res, next) {
  const { tags } = req.body;

  const tagsSchema = Joi.string()
    .required()
    // .empty('')
    .pattern(/^[^0-9]+$/)
    .messages({
      "any.required":"Required feild : tags",
      "String.base":"tags must be a string",
      "string.empty": "tags cannot be empty",
      "string.pattern.base": "tags cannot contain numbers"
    });
  const { error } = tagsSchema.validate(tags);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};

exports.visibility = function (req, res, next) {
  const { visibility } = req.body;

  const visibilitySchema = Joi.string()
    .required()
    // .empty('')
    .pattern(/^[^0-9]+$/)
    .messages({
      "any.required":"Required feild : visibility",
      "String.base":"visibility must be a string",
      "string.empty": "visibility cannot be empty",
      "string.pattern.base": "visibility cannot contain numbers"
    });
  const { error } = visibilitySchema.validate(visibility);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};

exports.bankdetails = function (req, res, next) {
  const { bankdetails } = req.body;

  const bankdetailsSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : bankdetails",
      "String.base":"bankdetails must be a string",
      "string.empty": "bankdetails cannot be empty",
    });
  const { error } = bankdetailsSchema.validate(bankdetails);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};

exports.amount = function (req, res, next) {
  const { amount } = req.body;

  const amountSchema = Joi.number()
    .positive() 
    .required()
    .messages({
      "any.required":"Required field: amount",
      "number.positive": "Amount must be a greater then zero",
    });
    // if (typeof amount !== Number) {
    //   return res.status(400).json({
    //     status: "fail", 
    //     message: "Amount must be a number",
    //   });
    // }
  
  const { error } = amountSchema.validate(amount);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }

  next();
};
exports.bankname = function (req, res, next) {
  const { bankname } = req.body;

  const banknameSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : bankname",
      "String.base":"bankname must be a string",
      "string.empty": "bankname cannot be empty",
    });
  const { error } = banknameSchema.validate(bankname);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.bankholdername = function (req, res, next) {
  const { bankholdername } = req.body;

  const bankholdernameSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : bankholdername",
      "String.base":"bankholdername must be a string",
      "string.empty": "bankholdername cannot be empty",
    });
  const { error } = bankholdernameSchema.validate(bankholdername);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.banknumber = function (req, res, next) {
  const { banknumber } = req.body;

  const banknumberSchema = Joi.string()
    .required()
    .pattern(/^[0-9]+$/)
    .messages({
      "string.pattern.base": "banknumber must contain only numeric digits",
      "any.required":"Required feild: banknumber",
      "string.empty": "banknumber cannot be empty",
    });

  const { error } = banknumberSchema.validate(banknumber);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }

  next();
};
exports.accountnumber = function (req, res, next) {
  const { accountnumber } = req.body;

  const accountnumberSchema = Joi.string()
    .required()
    .pattern(/^[0-9]+$/)
    .messages({
      "string.pattern.base": "accountnumber must contain only numeric digits",
      "any.required":"Required feild: accountnumber",
      "string.empty": "accountnumber cannot be empty",
    });

  const { error } = accountnumberSchema.validate(accountnumber);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }

  next();
};
exports.ifsccode = function (req, res, next) {
  const { ifsccode } = req.body;

  const ifsccodeSchema = Joi.string()
    .required()
    .pattern(/^[0-9]+$/)
    .messages({
      "string.pattern.base": "ifsccode must contain only numeric digits",
      "any.required":"Required feild: ifsccode",
      "string.empty": "ifsccode cannot be empty",
    });

  const { error } = ifsccodeSchema.validate(ifsccode);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }

  next();
};
exports.emailId = function (req, res, next) {

  const { email } = req.body;

  const emailSchema = Joi.string()
  .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
    .messages({
      "string.base": "Email Must Be A String",
      "string.email": "Invalid Email Format",
      "any.required":"Required feild: Email",
      "string.empty": "Email cannot be empty",
    });
  if (email !== '') {
    const { error: emailError } = emailSchema.validate(email);
    if (emailError) {
      return res.status(400).json({
        status: "fail",
        message: emailError.message,
      });

    }
  }
  next();
};
exports.name = function (req, res, next) {
  const { name } = req.body;

  const nameSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : name",
      "String.base":"name must be a string",
      "string.empty": "name cannot be empty",
    });
  const { error } = nameSchema.validate(name);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.topicname = function (req, res, next) {
  const { topicname } = req.body;

  const topicnameSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : topicname",
      "String.base":"topicname must be a string",
      "string.empty": "topicname cannot be empty",
    });
  const { error } = topicnameSchema.validate(topicname);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.password = function (req, res, next) {
  const { password } = req.body;

  const passwordSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : password",
      "string.empty": "password cannot be empty",
    });
  const { error } = passwordSchema.validate(password);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.category = function (req, res, next) {
  const { category } = req.body;

  const categorySchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : category",
      "String.base":"category must be a string",
      "string.empty": "category cannot be empty",
    });
  const { error } = categorySchema.validate(category);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};

// exports.community_user = function (req, res, next) {
//   const {email, username, name,password} = req.body
//   if(!email) {
//     return res.status(400).json({
//       status:"Fail",message:"Email is required"
//     })
//   }
//   if(!username) {
//     return res.status(400).json({
//       status:"Fail",message:"username is required"
//     })
//   }
//   if(!name) {
//     return res.status(400).json({
//       status:"Fail",message:"name is required"
//     })
//   }
//   if(!password) {
//     return res.status(400).json({
//       status:"Fail",message:"password is required"
//     })
//   }
//   next();
// }
exports.username = function (req, res, next) {
  const { username } = req.body;

  const userSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : username",
      "String.base":"username must be a string",
      "string.empty": "username cannot be empty",
    });
  const { error } = userSchema.validate(username);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.confirmpassword = function (req, res, next) {
  const { confirmpassword } = req.body;

  const userSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : confirmpassword",
      "String.base":"confirmpassword must be a string",
      "string.empty": "confirmpassword cannot be empty",
    });
  const { error } = userSchema.validate(confirmpassword);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.categoryId = function (req, res, next) {
  const { categoryId } = req.body;

  const categoryIdSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : categoryId",
      "string.empty": "categoryId cannot be empty",
    });
  const { error } = categoryIdSchema.validate(categoryId);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.tagsId = function (req, res, next) {
  const { tagsId } = req.body;

  const tagsIdSchema = Joi.array()
    .items(Joi.string())
    .required()
    .messages({
      "any.required": "Required field: tagsId",
      "array.base": "tagsId must be an array",
      "array.includesRequiredUnknowns": "tagsId cannot be empty",
      "string.empty": "Each tagId in tagsId cannot be empty",
    });

  const { error } = tagsIdSchema.validate(tagsId);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.markerFee = function (req, res, next) {
  const { markerFee } = req.body;

  const markerFeeSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : markerFee",
      "string.empty": "markerFee cannot be empty",
    });
  const { error } = markerFeeSchema.validate(markerFee);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.totalFee = function (req, res, next) {
  const { totalFee } = req.body;

  const totalFeeSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : totalFee",
      "string.empty": "totalFee cannot be empty",
    });
  const { error } = totalFeeSchema.validate(totalFee);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.disableTrade = function (req, res, next) {
  const { disableTrade } = req.body;

  const disableTradeSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : disableTrade",
      "string.empty": "disableTrade cannot be empty",
    });
  const { error } = disableTradeSchema.validate(disableTrade);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.Type = function (req, res, next) {
  const { Type } = req.body;

  const TypeSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : Type",
      "string.empty": "Type cannot be empty",
    });
  const { error } = TypeSchema.validate(Type);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.SMTPhost = function (req, res, next) {
  const { SMTPhost } = req.body;

  const SMTPhostSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : SMTPhost",
      "string.empty": "SMTPhost cannot be empty",
    });
  const { error } = SMTPhostSchema.validate(SMTPhost);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.SMTPport = function (req, res, next) {
  const { SMTPport } = req.body;

  const SMTPportSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : SMTPport",
      "string.empty": "SMTPport cannot be empty",
    });
  const { error } = SMTPportSchema.validate(SMTPport);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.senderName = function (req, res, next) {
  const { senderName } = req.body;

  const senderNameSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : senderName",
      "string.empty": "senderName cannot be empty",
    });
  const { error } = senderNameSchema.validate(senderName);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.encryption = function (req, res, next) {
  const { encryption } = req.body;

  const encryptionSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : encryption",
      "string.empty": "encryption cannot be empty",
    });
  const { error } = encryptionSchema.validate(encryption);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.senderEmail = function (req, res, next) {
  const { senderEmail } = req.body;

  // Check if senderEmail is not an empty string
  if (senderEmail !== '') {
    const senderEmailSchema = Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
      .messages({
        "string.base": "senderEmail Must Be A String",
        "string.email": "Invalid senderEmail Format",
        "any.required": "Required field: senderEmail",
        "string.empty": "senderEmail cannot be empty",
      });

    const { error: emailError } = senderEmailSchema.validate(senderEmail);

    if (emailError) {
      return res.status(400).json({
        status: "fail",
        message: emailError.message,
      });
    }
  } else {
    return res.status(400).json({
      status: "fail",
      message: "senderEmail cannot be empty",
    });
  }

  next();
};
exports.IPNsecret = function (req, res, next) {
  const { IPNsecret } = req.body;

  const IPNsecretSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : IPNsecret",
      "string.empty": "IPNsecret cannot be empty",
    });
  const { error } = IPNsecretSchema.validate(IPNsecret);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.publicKey = function (req, res, next) {
  const { publicKey } = req.body;

  const publicKeySchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : publicKey",
      "string.empty": "publicKey cannot be empty",
    });
  const { error } = publicKeySchema.validate(publicKey);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.privateKey = function (req, res, next) {
  const { privateKey } = req.body;

  const privateKeySchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : privateKey",
      "string.empty": "privateKey cannot be empty",
    });
  const { error } = privateKeySchema.validate(privateKey);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.merchantID = function (req, res, next) {
  const { merchantID } = req.body;

  const merchantIDSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : merchantID",
      "string.empty": "merchantID cannot be empty",
    });
  const { error } = merchantIDSchema.validate(merchantID);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.wallet = function (req, res, next) {
  const { wallet } = req.body;

  const walletSchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : wallet",
      "string.empty": "wallet cannot be empty",
    });
  const { error } = walletSchema.validate(wallet);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.secretKey = function (req, res, next) {
  const { secretKey } = req.body;

  const secretKeySchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : secretKey",
      "string.empty": "secretKey cannot be empty",
    });
  const { error } = secretKeySchema.validate(secretKey);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.baseCurrency = function (req, res, next) {
  const { baseCurrency } = req.body;

  const baseCurrencySchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : baseCurrency",
      "string.empty": "baseCurrency cannot be empty",
    });
  const { error } = baseCurrencySchema.validate(baseCurrency);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.siteKey = function (req, res, next) {
  const { siteKey } = req.body;

  const siteKeySchema = Joi.string()
    .required()
    .messages({
      "any.required":"Required feild : siteKey",
      "string.empty": "siteKey cannot be empty",
    });
  const { error } = siteKeySchema.validate(siteKey);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
// exports. videourl = function (req, res, next) {
//   const { videourl } = req.body;

//   const videoUrlSchema = Joi.string()
//     .uri({ scheme: ['http', 'https'] }) // Allow HTTP and HTTPS URLs
//     .required()
//     .messages({
//       "any.required": "Required field: videourl",
//       "string.uri": "videourl must be a valid URL"
//     });

//   const { error } = videoUrlSchema.validate(videourl);

//   if (error) {
//     return res.status(400).json({
//       status: "fail",
//       message: error.message,
//     });
//   }
//   next();
// };

