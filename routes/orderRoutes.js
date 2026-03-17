import express from 'express';
import Order from '../models/order.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// Get all orders (Admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user specific orders
router.get('/my-orders', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get recent orders for dashboard (Unified endpoint or role based)
router.get('/recent', authMiddleware, async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query.user = req.user.id;
        }

        const recentOrders = await Order.find(query)
            .populate('user', 'name')
            .limit(5)
            .sort({ createdAt: -1 });

        res.json(recentOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
