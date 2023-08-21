import Product from "../models/product.js";

export const create = async (req, res) => {
    try {
        console.log(req.fields);
        console.log(req.files);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message)
    }
}