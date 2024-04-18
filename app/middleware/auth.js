const userToken = require("../models/token");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, resp, next) => {
  const token = req.headers["token"];
  console.log("token", token);

  if (!token) {
    return resp.status(401).send({
      status: false,
      message: "A token is required for authentication",
    });
  }

  try {
    const checkToken = await userToken.findOne({ token });

    if (!checkToken) {
      throw new Error("Invalid token");
    }

    try {
      const verify = jwt.verify(checkToken.token, process.env.JWT_KEY);
      req.user = verify;
      return next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return resp.status(401).send({ status: "Fail", message: "Token has expired" });
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.log(err);
    return resp.status(401).send({ status: "Fail", message: "Invalid Token" });
  }
};

module.exports = verifyToken;
