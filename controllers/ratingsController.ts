import { Request, Response, Router } from "express";
const db = require("../db/db")

const router = Router();


router.post("/", async (req: Request, res: Response, next) => {
    const { restaurantId, rating } = req.body;
    try {
        // Insert the rating into the ratings table
        await db.executeQuery(
            "INSERT INTO ratings (restaurantId, rating) VALUES ($1, $2)",
            [restaurantId, rating]
        );

        // Calculate the average rating for the restaurant and update the restaurant table
         await db.executeQuery(
            " WITH avg_rating AS (\
            SELECT AVG(rating) AS average_rating FROM ratings WHERE restaurantId = $1)\
            UPDATE restaurants AS r\
            SET averageRating = ar.average_rating\
            FROM avg_rating AS ar\
            WHERE r.id = $1"
            , [restaurantId]);

        res.status(200).send();
    }
    catch (err: any) {
        if (err.constraint == "ratings_restaurantid_fkey") {
            res.status(404).send("Restaurant does not exist")
        }
        else {
            next(err)
        }
    }
});


export default router;
