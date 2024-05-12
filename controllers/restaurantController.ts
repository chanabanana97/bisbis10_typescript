import { Router, Request, Response, NextFunction } from "express";
const db = require("../db/db")

const router = Router();



// Get all restaurants
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const restaurants = await db.executeQuery("SELECT * FROM restaurants");;
        res.status(200).json(restaurants);
    }
    catch (err) {
        next(err)
    }
});


// Get restaurants by cuisine
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const cuisine: string = req.query.cuisine as string;
    try {
        const result = await db.executeQuery("SELECT * FROM restaurants WHERE $1 = ANY (cuisines)", [cuisine]);
        res.status(200).json(result.rows);
    }
    catch (err) {
        next(err)
    }
});



// Get restaurant by ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const result = await db.executeQuery("SELECT * FROM restaurants WHERE id = $1", [id]);
        if (result.length === 0) {
            res.status(404).send("Restaurant not found");
        } else {
            res.json(result[0]);
        }
    } catch (err) {
        next(err)
    }
});

// Add a new restaurant
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, isKosher, cuisines } = req.body;
        await db.executeQuery(
            "INSERT INTO restaurants (name, averageRating, isKosher, cuisines) VALUES ($1, $2, $3, $4)",
            [name, 0, isKosher, cuisines]
        );
        res.status(201).send();
    } catch (err) {
        next(err)
    }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const name = req.body.name;
    const isKosher = req.body.isKosher;
    const cuisines = req.body.cuisines;
    try {
        const result = await db.executeQuery(
            "UPDATE restaurants SET \
             name = COALESCE($1, name),\
             isKosher = COALESCE($2, isKosher), \
             cuisines = COALESCE($3, cuisines)\
             WHERE id = $4 RETURNING id",
            [name, isKosher, cuisines, id]
        );
        if (result.length === 0) {
            res.status(404).send("Restaurant not found");
        } else {
            res.status(204).send();
        }
    } catch (err) {
        next(err)
    }
});

// Delete a restaurant
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await db.executeQuery("DELETE FROM restaurants WHERE id = $1", [id]);
        res.status(204).send();
    }
    catch (err) {
        next(err)
    }
});

export default router;
