import { Router, Request, Response, NextFunction } from "express";
const db = require("../db/db")


const router = Router({mergeParams: true});

// Add a dish
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    try {
        const result = await db.executeQuery(
            "INSERT INTO dishes (name, description, price) VALUES ($1, $2, $3) RETURNING id",
            [name, description, price]
        );
        await db.executeQuery(
            "INSERT INTO restaurant_dishes (restaurantId, dishId) VALUES ($1, $2)",
            [id, result[0].id]
        )
        res.status(201).send();
    } catch (err: any) {
        if (err.constraint == "dishes_name_description_price_key")
            res.status(304).send("Dish already exists");
        else {
            next(err)
        }
    }
});

// Update a dish
router.put("/:dishId", async (req: Request, res: Response, next: NextFunction) => {
    const { id, dishId } = req.params;
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    try {
        const checkDishExists = await db.executeQuery(
            "SELECT dishId from restaurant_dishes WHERE restaurantId = $1 AND dishId = $2", 
            [id, dishId]
        )
        if (checkDishExists.length == 0){
            res.status(404).send(`Restaurant ${id} does not have dish ${dishId}`);
            return;
        }
        const result = await db.executeQuery(
            "UPDATE dishes SET \
             name = COALESCE($1, name),\
             description = COALESCE($2, description), \
             price = COALESCE($3, price)\
             WHERE id = $4 RETURNING id",
            [name, description, price, dishId]
        );
        if (result.length === 0) {
            res.status(404).send("Dish not found");
        } else {
            res.status(204).send();
        }
    } catch (err) {
        next(err)
    }
});

// Delete a dish
router.delete("/:dishId", async (req: Request, res: Response, next: NextFunction) => {
    const { id, dishId } = req.params;
    try {
        await db.executeQuery(
            "DELETE FROM dishes WHERE id = $1",
            [dishId]
        )
        res.status(204).send();
    }
    catch (err) {
        next(err)
    }
});

// Get dishes by restaurant ID
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const dishes = await db.executeQuery(
            "SELECT d.id, d.name, d.description, d.price \
            FROM dishes d \
            JOIN restaurant_dishes rd ON d.id = rd.dishId \
            WHERE rd.restaurantId = $1", [id]
        )
        res.status(200).send(dishes);
    } catch (err) {
        next(err)
    }
});

export default router;
