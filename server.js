import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ✅ Stripe
import Stripe from "stripe";

// Routes
import categoryRoutes from "./routes/categoryRoutes.js";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoute.js";
import profileRoutes from "./routes/profileRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Controllers
// import { registerUser, loginUser } from "./controllers/authController.js"; // Removed as now used in routes

dotenv.config();
const app = express();

// ...


// ✅ Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Stripe init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());


// ✅ Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger
import swaggerUi from "swagger-ui-express";
import specs from "./config/swagger.js";
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// ================== AUTH ==================
app.use("/api", authRoutes);


// ================== API Routes ==================
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", paymentRoutes);


// ================== PAYMENTS ==================

// ✅ Create PaymentIntent
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // amount in cents
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd", // or "lkr" if supported
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
});



// ✅ Webhook endpoint (raw body required for signature verification)
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle events
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      console.log("✅ Payment succeeded:", pi.id, pi.amount);
      // 👉 here you can save payment info to MongoDB if needed
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

// ================== SERVER START ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
