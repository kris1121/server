import slugify from "slugify";

import Category from "../models/category.js";

export const create = async (req, res) => {
    try {
        // console.log(req.body);
        const { name } = req.body;
        if (!name.trim()) {
            return res.json({ error: "Name is required" });
        }
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.json({ error: "Name already exists" });
        }
        const category = await new Category({ name, slug: slugify(name) }).save();
        res.json(category);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error)
    }
}

export const update = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findByIdAndUpdate(req.params.categoryId, {
            name,
            slug: slugify(name)
        },
            { new: true }
        );
        return res.json(category)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error.message)
    }
}

export const remove = async (req, res) => {
    try {
        const removed = await Category.findByIdAndDelete(req.params.categoryId);
        return res.json(removed);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error.message)
    }
}

export const list = async (req, res) => {
    try {
        const all = await Category.find({});
        return res.json(all);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error.message)
    }
}

export const read = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        return res.json(category)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error.message)
    }
}