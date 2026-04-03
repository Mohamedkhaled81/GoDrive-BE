import Order from "../models/order.model.js";
import Car from "../models/car.model.js";
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
    const order = await Order.findById(req.params.id);
    if (!order) return next(new CustomError("Order not found", 404));

   
    const isStillAvailable = await Order.findOne({
      _id: { $ne: order._id }, 
      carId: order.carId,
      status: "confirmed",
      $or: [
        { fromDate: { $lte: order.toDate }, toDate: { $gte: order.fromDate } }
      ],
    });

    if (isStillAvailable) {
      return next(new CustomError("Sorry, another order was confirmed for this car in the same period", 400));
    }

    order.status = "confirmed";
    await order.save();
    
    res.json({ success: true, message: "Order confirmed", order });
  } catch (error) { next(error); }
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
