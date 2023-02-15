const User = require("../models/User")
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")

const router = require("express").Router()

//UPDATE

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) { //VALIDATING USER PW AGAIN 
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString()
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { //USING THE USER MODULE AND MONGODB
            $set: req.body //TAKE WHAT's INSIDE REQUESTBODY AND SET IT AGAIN
        }, { new: true }) //TO RETURN THE NEW UPDATES
        res.status(200).json(updatedUser) //SUCCESS

    } catch (err) {
        res.status(500).json(err)

    }
})

//DELETE

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted.")
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET USER

router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => { //ONLY ADMIN GETS ANY USERS
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc //DESTRUCTURING PROPERTIES TO NOT SHOW ANY PASSWORDS
        res.status(200).json({ others })//PASSING "OTHERS"
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET ALL USERS

router.get("/", verifyTokenAndAdmin, async (req, res) => { //ONLY ADMIN GETS ANY USERS
    const query = req.query.new
    try {
        const users = query //IN CASE TO USE QUERIES TO GET USERS
            ? await User.find().sort({ _id: -1 }).limit(5) //ONLY GETS THE NEWEST 5 USERS
            : await User.find()
        res.status(200).json(users)//PASSING THE USERS
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET USER STATS(OPTIONAL)

router.get("/stats", verifyTokenAndAdmin, async (req, res) => { //GETS THE TOTAL NUMBER OF USERS PER MONTH
    const date = new Date() //CREATES THE CURRENT DATE
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))//IT RETURNS THE LAST YEAR TODAY

    try {
        const data = await User.aggregate([//USING MONGODB'S AGGREGATE FUNCTION, I GROUP THE ITEMS
            { $match: { createdAt: { $gte: lastYear } } },//CONDITIONS (GTE=GREATER THAN)
            {
                $project: {//TAKING MONTH NUMBERS
                    month: { $month: "$createdAt" }, //CREATES A MONTH VARIABLE
                },
            },
            {
                $group: {//GROUPING ITEMS
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ])
        res.status(200).json(data)

    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router