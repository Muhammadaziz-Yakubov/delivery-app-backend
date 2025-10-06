import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Restaurant from "../models/restaurant.model.js";
import Courier from "../models/courier.model.js";

// @desc   Create new order
// @route  POST /api/orders
// @access Private (user)
export const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    let total = 0;
    const populatedItems = [];

    for (const it of items) {
      const prod = await Product.findById(it.product);
      if (!prod) {
        return res.status(404).json({ message: `Product ${it.product} not found` });
      }

      const price = prod.price;
      const quantity = it.quantity || it.qty || 1; // moslashtirdim

      total += price * quantity;
      populatedItems.push({
        product: prod._id,
        quantity,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      restaurant: restaurantId,
      items: populatedItems,
      totalPrice: total,
      deliveryAddress,
      paymentMethod,
      paymentStatus: "pending",
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Order created",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get my orders
// @route  GET /api/orders/my
// @access Private (user)
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("restaurant", "name address")
    .sort({ createdAt: -1 });

  res.json(orders);
};

// @desc   Get single order
// @route  GET /api/orders/:id
// @access Private (owner/courier/admin)
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("items.product restaurant courier user");

  if (!order) return res.status(404).json({ message: "Order not found" });

  const isOwner = String(order.user._id) === String(req.user._id);
  const isAdmin = req.user.role === "admin";
  let isRestaurantOwner = false;

  if (order.restaurant?.owner) {
    isRestaurantOwner = String(order.restaurant.owner) === String(req.user._id);
  }

  const isCourier = order.courier && String(order.courier) === String(req.user._id);

  if (!isOwner && !isAdmin && !isRestaurantOwner && !isCourier) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.json(order);
};

// @desc   Update order status (accept, preparing, on-the-way, delivered)
// @route  PUT /api/orders/:id/status
// @access Private (restaurant owner/courier/admin)
export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const { status, courierId } = req.body;

  // restoran owner yoki admin -> accepted/preparing
  if (["accepted", "preparing"].includes(status)) {
    const rest = await Restaurant.findById(order.restaurant);
    if (String(rest.owner) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  // courier yoki admin -> on-the-way / delivered
  if (["on-the-way", "delivered"].includes(status)) {
    if (req.user.role !== "courier" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (courierId) {
      const courier = await Courier.findById(courierId);
      if (!courier) return res.status(404).json({ message: "Courier not found" });
      if (!courier.isAvailable) return res.status(400).json({ message: "Courier not available" });

      order.courier = courier._id;
      courier.isAvailable = false;
      await courier.save();
    }
  }

  order.status = status;
  await order.save();

  res.json({ success: true, order });
};

// @desc   Assign courier to order
// @route  PUT /api/orders/:id/assign
// @access Private (admin/restaurant owner)
export const assignCourier = async (req, res) => {
  const { courierId } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const courier = await Courier.findById(courierId);
  if (!courier) return res.status(404).json({ message: "Courier not found" });
  if (!courier.isAvailable) {
    return res.status(400).json({ message: "Courier not available" });
  }

  order.courier = courier._id;
  order.status = "on-the-way";

  courier.isAvailable = false;
  await courier.save();
  await order.save();

  res.json({ success: true, order });
};

// @desc   Courier o‘z buyurtmalarini ko‘radi
// @route  GET /api/orders/deliveries/my
// @access Private (courier)
export const getMyDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({ courier: req.user._id })
      .populate("restaurant", "name address")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Admin get all orders
// @route  GET /api/orders
// @access Private (admin)
export const adminGetAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user restaurant courier")
    .sort({ createdAt: -1 });

  res.json(orders);
};
