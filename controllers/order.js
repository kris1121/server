import Order from "../models/order.js";

export const getOrder = async (req, res) => {
  try {
    const orders = await Order.find({buyer: req.user._id})
    .populate("products", "-photo")
    .populate("buyer", "name")
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}