const router = require("express").Router()
const Product = require("../models/Product")
const {
    verifyTokenAndAdmin,
    verifyToken,
    verifyTokenAndAuthorization,
} = require("./verifyToken")

//CREATE

router.post("/", verifyTokenAndAdmin, async (req,res) => {
    const newProduct = new Product(req.body)

    try {
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)
    } catch (err) {
        res.status(500).json(err)
    }
})

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new : true }
        )
        res.status(200).json(updatedProduct)
    } catch (err)  {
        res.status(500).json(err)
    }
})

//DELETE

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted.")
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET PRODUCT

router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)//PASSING THE PRODUCT
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET ALL PRODUCTS

router.get("/", async (req, res) => {
    const qNew = req.query.new //QUERY FOR NEW PRODUCTS
    const qCategory = req.query.category //QUERY FOR CATEGORIES
    try {
        let products

        if (qNew) { //IF THERE IS A QUERY FOR NEW PRODUCTS
            products = await Product.find().sort({createdAt: -1}).limit(5) //SORTING THE PRODUCTS WITH A LIMIT OF 5
        } else if(qCategory){ //IF THERE IS A QUERY FOR CATEGORIES
            products = await Product.find({ //THE SAME BUT WITH CONDITIONS
                categories: { //IF THE CATEGORY QUERY IS INSIDE THE CATEGORIES ARRAY THE PRODUCTS WILL BE FETCHED
                    $in: [qCategory],
                }})
        }else{ //IF THERE IS NO QUERY ALL THE PRODUCTS IN THE DB WILL BE RETURNED
            products = await Product.find()
        }
 
        res.status(200).json(products) //PASSING THE PRODUCTS
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router