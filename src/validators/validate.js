const {body, validationResult} = require('express-validator'); // express validator for validation the user

exports.validateSignupRequest = [
    // Express validators:
    body('name', 'Name is Required').notEmpty(), // to validate that first name is not empty
    body('username', 'User name is Required').notEmpty(),
    body('email', 'Please enter a valid Email').isEmail(),
    body('password', 'Password must be at least 8 characters long').isLength({min: 8}) // to set min length of the password
]

exports.validateSigninRequest = [
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Password must be at least 8 characters long').isLength({min: 8}) // to set min length of the password
]

exports.isRequestValidated = (req, res, next) => {
    // Validation result of express validator: It takes req as argument and it returns an array of errors:
    const errors = validationResult(req)

    // if errors are there in the validationResult, then sending response to the user:
    if(!errors.isEmpty())
    {
        return res.status(400).json({error: errors.array()[0].msg});
    }

    next()
}