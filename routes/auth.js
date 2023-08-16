import express from "express";

const router = express.Router();

router.get("/users", (req, res) => {
    res.json({
        data: 'Kris says hello hi'
    })
});

export default router;