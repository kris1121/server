import slugify from "slugify";
import fs from "fs";
import braintree from "braintree";
import dotenv from 'dotenv';

dotenv.config();

import Product from "../models/product.js";
import Order from "../models/order.js";

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

export const create = async (req, res) => {
  try {
    // console.log(req.fields);
    // console.log(req.files);
    const { name, description, price, quantity, category, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name.trim():
        return res.json({ error: "Name is required!" });
      case !description.trim():
        return res.json({ error: "Description is required!" });
      case !price.trim():
        return res.json({ error: "Price is required!" });
      case !category.trim():
        return res.json({ error: "Category is required!" });
      case !quantity.trim():
        return res.json({ error: "Quantity is required!" });
      case !shipping.trim():
        return res.json({ error: "Shipping is required!" });
      case !photo && photo.size > 1000000:
        return res.json({ error: "Photo should be less than 1mb size!" });
    }

    //create product
    const product = new Product({ ...req.fields, slug: slugify(name) });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.json(product);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
};

export const list = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.log(error);
  }
};

export const read = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    res.json(product);
  } catch (error) {
    console.log(error);
  }
};

export const photo = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).select(
      "photo"
    );
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
  }
};

export const remove = async (req, res) => {
  try {
    const removed = await Product.findByIdAndDelete(
      req.params.productId
    ).select("-photo");
    res.json(removed);
  } catch (error) {
    console.log(error);
  }
};

export const update = async (req, res) => {
  try {
    // console.log(req.fields);
    // console.log(req.files);
    const { name, description, price, quantity, category, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name.trim():
        return res.json({ error: "Name is required!" });
      case !description.trim():
        return res.json({ error: "Description is required!" });
      case !price.trim():
        return res.json({ error: "Price is required!" });
      case !category.trim():
        return res.json({ error: "Category is required!" });
      case !quantity.trim():
        return res.json({ error: "Quantity is required!" });
      case !shipping.trim():
        return res.json({ error: "Shipping is required!" });
      case !photo && photo?.size > 1000000:
        return res.json({ error: "Photo should be less than 1mb size!" });
    }

    //create product
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.json(product);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
};

export const filteredProducts = async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};

    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    console.log("args =>", args);

    const products = await Product.find(args);
    console.log("filtered products query =>", products.length);
    res.json(products);
  } catch (error) {
    console.log(error);
  }
};
export const productsCount = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount();
    res.json(total);
  } catch (error) {
    console.log(error);
  }
};

export const listProducts = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;

    const products = await Product.find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.log(error);
  }
};

export const productsSearch = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

export const relatedProducts = async (req, res) => {
  try {
    const { productId, categoryId } = req.params;
    const related = await Product.find({
      category: categoryId,
      _id: { $ne: productId },
    })
      .select("-photo")
      .populate("category")
      .limit(3);
    res.json(related);
  } catch (error) {
    console.log(error);
  }
};

export const getBraintreeToken = async (req, res) => {
  try {
    gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export const processPayment = async (req, res) => {
  try {
    let { nonce, cart } = req.body;

    let total = 0;
    cart?.map(product => {
      total += product.price;
    })

    let newTransaction = gateway.transaction.sale({
      amount: total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true
      }
    }, (err, result) => {
      if (result) {
        const order = new Order({
          products: cart,
          payment: result,
          buyer: req.user._id
        }).save();
        decrementQuantity(cart);
        res.json({ ok: true });
      } else {
        res.status(500).send(err)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

const decrementQuantity = async cart => {
  try {
    const bulkOps = cart.map(item => {
      return {
        updateOne: {
          filter: { _id: item._id },
          update: { $inc: { quantity: -0, sold: +1 }}
        }
      };
    });

    const updated = await Product.bulkWrite(bulkOps, {});
    console.log("blk updated",  updated);
  } catch (error) {
    console.log(error);
  }
}


