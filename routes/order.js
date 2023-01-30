const router = require("express").Router()
const Order = require("../models/Order")
const {
    verifyTokenAndAdmin,
    verifyToken,
    verifyTokenAndAuthorization,
} = require("./verifyToken")

//CREATE

router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const savedOrder = await newOrder.save()
        res.status(200).json(savedOrder)
    } catch (err) {
        res.status(500).json(err)
    }
})

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        )
        res.status(200).json(updatedOrder)
    } catch (err) {
        res.status(500).json(err)
    }
})

//DELETE

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted.")
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET USER ORDERS (CHANGE /find/:id TO /find/:userI dOR NOT, DEPENDING ON RESULT)

router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({ userID: req.params.id }) //CONDITIONS FOR FINDING THE USER'S ORDERS
        res.status(200).json(orders)//PASSING THE PRODUCT
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET ALL 

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET MONTHLY INCOME (OPTIONAL)

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date() //ONLY USING THIS MONTH AND THE PREVIOUS MONTH TO COMPARE THE INCOMES
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1)) //THIS MEANS 2 MONTHS IN THE PAST

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount" //AMOUNT FROM ORDERS.JS
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                },
            },
        ])
        res.status(200).json(income)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router