const jwt = require('jsonwebtoken')

const fetchuser = (req, res, next) => {

    const token = req.header('auth-token');

    // checking for the token:
    if(!token)
    {
        return res.status(401).send("Please enter valid auth-token");
    }

    // if token is a valid token then verify user with the jwt secret of the authtoken send by the user:
    try
    {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        
        // user will have all the details now of the user:
        req.user = data.user;

        next(); // calling next function where it will be used 
    }
    catch(error)
    {
        console.log(error.message);
        res.status(401).json({error: "Please authenicate using a valid token"});
    }
}

module.exports = fetchuser;