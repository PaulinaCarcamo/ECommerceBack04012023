// REMAINS OF STRIPE PAYMENT ATTEMPT

// const router = require("express").Router()
// // const stripe = require("stripe")(process.env.STRIPE_KEY)
// const KEY = process.env.STRIPE_KEY
// const stripe = require("stripe")(KEY)

// router.post("/payment", (req, res) => {
//     stripe.charges.create({ //CREATING A CHARGE
//         source: req.body.tokenId, //INCLUDING SOURCE AND THE TOKENID FROM STRIPE
//         amount: req.body.amount,
//         currency: "usd",
//     }, (stripeErr, stripeRes) => { //RETURNING EITHER ERROR OR SUCCESS RESPONSE
//         if(stripeErr){
//             res.status(500).json(stripeErr)
//         } else {
//             res.status(200).json(stripeRes)
//         }
//     })
// })

// module.exports = router