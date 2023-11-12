exports.userMiddleware = (req, res, next) => {
    // checking if the user is user or not:
    if(req.user.role !== 'user')
    {
        return res.status(400).json({error: "Access Denied! as you are not a user"});
    }

    next(); 
}

exports.adminMiddleware = (req, res, next) => {
    // checking if the user is admin or not:
    if(req.user.role !== 'admin')
    {
        return res.status(400).json({error: "Access Denied! as you are not a admin"});
    }

    next(); 
}

