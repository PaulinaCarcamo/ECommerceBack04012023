const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

//REGISTER USER
router.post("/register", async (req, res) => { //ASYNC REQUEST FROM USER
    const newUser = new User ({
        // username: req.body.username,
        // lastname: req.body.lastname,
        email: req.body.email,
        password: CryptoJS.AES.encrypt( //CRYPTOJS PROVIDES A HASHED CODE FOR PW 
            req.body.password, 
            process.env.PASS_SEC //USING THE SECRET KEY FROM .ENV. 
        ).toString(), //PW IS SAVED AS A STRING TO BE STORED IN DB
    })

    //AFTER THE PW IS ENCRYPTED THE USER IS SAVED
    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json(err)
    }
})

//LOGIN

router.post("/login", async (req,res) => { //POST METHOD AND LOGIN ENDPOINT
    try {
        const user = await User.findOne({email: req.body.email}) //FINDING USER INSIDE DB
        !user && res.status(401).json("Sorry, invalid user.") //IF THERE'S NO USER FOUND, SEND THIS ERROR MESSAGE

        const hashedPassword = CryptoJS.AES.decrypt( //DECRYPTING PREVIOUSLY CRYPTED PW
            user.password, 
            process.env.PASS_SEC
            )
            const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8) // UTF8 IS FOR SPECIAL CHARACTERS IF NEEDED

            originalPassword !==req.body.password &&
            res.status(401).json("Sorry, invalid password.") //IN CASE THE PASSWORD DOESN'T MATCH THE DB

            const accessToken = jwt.sign({ //VERIFYING USER THROUGH JWT EVERYTIME THEY WANT TO MODIFY OR ACCESS ANYTHING
                id:user._id, 
                isAdmin: user.isAdmin, 
            }, 
                process.env.JWT_SEC, //USING KEY FROM ENV
                {expiresIn:"3d"}) //EXPIRATION DATE OF THE TOKEN

            const { password, ...others} = user._doc //DESTRUCTURING THE USER.

            res.status(200).json({...others, accessToken}) //IF ALL GOES WELL THE USER, NOW KNOWN AS "...OTHERS" (spread operator), IS RETURNED AS JSON ALONG WITH THE TOKEN

    } catch (err) {
        res.status(500).json(err) //SENDING ERROR
    }

})

module.exports = router