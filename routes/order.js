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

module.exports = router