import Order from "../models/order.js";
import { sendMail } from "../helpers/sendMail.js";

export const getOrder = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(
      req.params.orderId,
      {
        status,
      },
      { new: true }
    ).populate("buyer", "name");
    // console.log("updated => ",updated)
    sendMail(req, res, updated);


    
    // const mailOptions = {
    //   from: "krismat1121@gmail.com",
    //   to: "matyga.krzysztof@gmail.com",
    //   subject: "Sending Email using Node.js",
    //   text: "That was easy!",
    // };
    




    res.json(updated);
  } catch (error) {
    console.log(error);
  }
};


