const jwt = require('jsonwebtoken');
const tokendb = require('../models/communityusertoken');

const communitytoken = async(req,res,next) => {
    const token = req.headers['token'];

    if (!token) {
        return resp.status(401).send({
          status: false,
          message: "A token is required for authentication",
        });
      }
    try {
        var checktoken = await tokendb.findOne({ token: token });

        if(checktoken) {
            const verify = jwt.verify(checktoken.token,process.env.JWT_KEY);

            req.user = verify;
            return next();
        } else {
            throw new Error('Invalid token')
        }
    } catch (error) {
        console.log(error);
        return res.status(401).send({ status: "Fail", message: "Invalid Token" });
    }
}

module.exports = communitytoken;