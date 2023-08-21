import slugify from "slugify";
import fs from "fs";

import Product from "../models/product.js";

export const create = async (req, res) => {
    try {
        // console.log(req.fields);
        // console.log(req.files);
        const { name, description, price, quantity, category, shipping } = req.fields;
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
        return res.status(400).json(error.message)
    }
}

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
}

export const read = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
        .select("-photo")
        .populate("category")

        res.json(product);

    } catch (error) {
        console.log(error);
    }
}

export const photo = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).select("photo");
        if (product.photo.data) {
            res.set('Content-Type', product.photo.contentType);
            return res.send(product.photo.data);
        }
    } catch (error) {
        console.log(error)
    }
}

export const remove = async (req, res) => {
    try {
        const removed = await Product.findByIdAndDelete(req.params.productId).select("-photo");
        res.json(removed)
    } catch (error) {
        console.log(error)
    }
}

export const update = async (req, res) => {
    try {
        // console.log(req.fields);
        // console.log(req.files);
        const { name, description, price, quantity, category, shipping } = req.fields;
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
        const product = await   Product.findByIdAndUpdate(req.params.productId, { ...req.fields,
        slug: slugify(name) }, { new: true });

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.json(product);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message)
    }
}