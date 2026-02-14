import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing
 */

/**
 * @swagger
 * /api/create-payment-intent:
 *   post:
 *     summary: Create a payment intent
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount in cents
 *     responses:
 *       200:
 *         description: Payment intent created
 *       500:
 *         description: Stripe error
 */
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // frontend එකෙන් amount එන්න ඕනේ (cents වලින්)

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd", // currency එක වෙනස් කරන්න පුළුවන්
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
