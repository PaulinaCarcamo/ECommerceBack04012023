const router = require("express").Router()
const Cart = require("../models/Cart")
const {
    verifyTokenAndAdmin,
    verifyToken,
    verifyTokenAndAuthorization,
} = require("./verifyToken")

//CREATE

router.post("/", verifyToken, async (req,res) => {
    const newCart = new Cart(req.body)

    try {
        const savedCart = await newCart.save()
        res.status(200).json(savedCart)
    } catch (err) {
        res.status(500).json(err)
    }
})

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new : true }
        )
        res.status(200).json(updatedCart)
    } catch (err)  {
        res.status(500).json(err)
    }
})

//DELETE

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted.")
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET USER CART (CHANGE /find/:id TO /find/:userI dOR NOT, DEPENDING ON RESULT)

router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({userID: req.params.id}) //CONDITIONS FOR FINDING THE ONE USER'S CART
        res.status(200).json(cart)//PASSING THE PRODUCT
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET ALL 

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router