import { Request, Response, Router } from "express";
import crypto from "crypto"
const db = require("../db/db")

const router = Router();


router.post("/", async (req: Request, res: Response, next) => {
    const { restaurantId, orderItems } = req.body;
    try {
        const dishes = await db.executeQuery(
            "SELECT dishId FROM restaurant_dishes WHERE restaurantId = $1",
            [restaurantId]
        );
        const existingDishIds = dishes.map((element) => { return element.dishid });;

        // Check if all dishIds in orderItems are present in existingDishIds
        const allDishIdsExist = orderItems.every(item => existingDishIds.includes(item.dishId));

        if (allDishIdsExist) {
            const uuid = crypto.randomUUID();
            res.status(200).send({"orderId": uuid});
        }
        else {
            res.status(400).send("Cannot place order");
        }
    }
    catch (err) {
        next(err)
    }
});


export default router;
