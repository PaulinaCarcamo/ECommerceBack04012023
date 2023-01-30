const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token //PROVIDE TOKEN TO HEADER
    if (authHeader) { //IF THERE IS NO AUTHHEADER...
        const token = authHeader.split(" ")[1] //SPLITTING THE BEARER TO GET THE TOKEN FROM API MANAGER
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) res.status(403).json("Token is not valid!")
            req.user = user //IF ALL GOES WELL THE USER IS ASSIGNED
            next() //NOW IT GOES TO THE "USER" ROUTER
        })
    } else {
        return res.status(401).json("You are not authenticated. Please try again.") //USER IS NOT AUTHENTICATED
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) { //IF THE USER IS THE SAME, THE INFORMATION IS ALLOWED TO BE CHANGED
            next()
        } else {
            res.status(403).json("You are not allowed to do that")
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) { //VERIFIYING THAT THE USER IS ADMIN IN ORDER TO MAKE ANY CHANGES
            next()
        } else {
            res.status(403).json("You are not allowed to do that. Please contact your administrator")
        }
    })
}


module.exports = { 
    verifyToken, 
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin 
}