const jwt = require("jsonwebtoken");
const tokendb = require("../models/admintoken");

const verifyToken = async (req, resp, next) => {
  const token = req.headers["token"];
  // console.log(token);

  if (!token) {
    return resp.status(401).send({
      status: false,
      message: "A token is required for authentication",
    });
  }
  // return next();
  try {
    var checkToken = await tokendb.findOne({ token: token });
    if (checkToken) {
      // console.log(checkToken,'Checktoken')
      const verify = jwt.verify(checkToken.token, process.env.JWT_KEY);
      // console.log(verify,"verifytoken");
      req.user = verify
      return next();
    } else {
      throw new Error("invalid token")
    }
  } catch (err) {
    console.log(err);
    return resp.status(401).send({ status: "Fail", message: "Invalid Token" });
  }
};

module.exports = verifyToken;