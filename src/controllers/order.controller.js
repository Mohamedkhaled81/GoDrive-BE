import Order from "../models/order.model.js";
import Car from "../models/car.model.js";
import UserProfile from "../models/userProfile.js";
import CustomError from "../utils/customError.js";

//create order
export const createOrder = async (req, res, next) => {
  try {
    const { carId, fromDate, toDate } = req.body;
    if (!carId || !fromDate || !toDate) {
      return next(new CustomError("all fields are required", 400));
    }
    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (start >= end) {
      return next(new CustomError("invalid date range", 400));
    }
    const car = await Car.findById(carId);

    if (!car) {
      return next(new CustomError("Car not found", 404));
    }

    const overlappingOrder = await Order.findOne({
      carId,
      status: { $ne: "cancelled" },
      $or: [{ fromDate: { $lte: end }, toDate: { $gte: start } }],
    });

    if (overlappingOrder) {
      return next(
        new CustomError(
          "This car is already reserved or pending confirmation for these dates",
          400,
        ),
      );
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.pricePerDay;

    const order = await Order.create({
      userId: req.user._id,
      carId,
      fromDate: start,
      toDate: end,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const confirmOrder = async (req, res, next) => {
  try {
    // 1. Find the order
    const order = await Order.findById(req.params.id);
    if (!order) return next(new CustomError("Order not found", 404));

    // 2. Prevent multi-confirm or processing cancelled orders
    if (order.status !== "pending") {
      return next(new CustomError(`Order is already ${order.status}`, 400));
    }

    // 3. Check if the car is still available (Overlap check)
    const isAlreadyBooked = await Order.findOne({
      _id: { $ne: order._id },
      carId: order.carId,
      status: "confirmed",
      fromDate: { $lte: order.toDate },
      toDate: { $gte: order.fromDate },
    });

    if (isAlreadyBooked) {
      return next(
        new CustomError("Car is no longer available for these dates", 400),
      );
    }

    // 4. Check User Balance
    const profile = await UserProfile.findOne({ userId: order.userId });

    if (!profile) return next(new CustomError("User profile not found", 404));

    if (profile.balance < order.totalPrice) {
      // Logic: If balance is low, cancel the order
      order.status = "cancelled";
      await order.save();

      return res.status(400).json({
        success: false,
        message: "Insufficient balance. Order has been cancelled.",
        order,
      });
    }

    // 5. Confirm the Order
    order.status = "confirmed";

    profile.balance -= order.totalPrice;
    await profile.save();

    await order.save();

    res.json({
      success: true,
      message: "Order confirmed successfully",
      order,git ad
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate("carId");

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("carId");

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};
