const jwt = require('jsonwebtoken');

function checkAuth(req,res,next){
    try{
        const token = req.headers.authorization.split("")(1);
        const decodeToken = jwt.verify(token,process.env.JWT_KEY) // Bearer
        req.userData = decodeToken;
        next();
    }catch(e){
        return res.status(401).json({
            "message" : "Invalid or expired token provided!",
            "error" : e
        });
    }
}

module.exports = {
    checkAuth : checkAuth
}