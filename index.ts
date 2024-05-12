import express, { Application } from "express";
import dotenv from "dotenv";
const db = require ("./db/db")
import restaurantRoutes from "./controllers/restaurantController";
import dishesRoutes from "./controllers/dishesController";
import orderRoutes from "./controllers/orderContoller";
import ratingRoutes from "./controllers/ratingsController"


//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use(express.json())

app.use("/restaurants/:id/dishes", dishesRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/order", orderRoutes);
app.use("/ratings", ratingRoutes);


app.listen(port, () => {
  console.log(`Server is On at http://localhost:${port}`);
});

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).send(err.message);
});

process.on("SIGINT", () => {
  db.client.end((err: Error) => {
    if (err) {
      console.error("error during disconnection", err.stack);
    }
    process.exit();
  });
});

process.on("SIGTERM", () => {
  db.client.end((err: Error) => {
    if (err) {
      console.error("error during disconnection", err.stack);
    }
    process.exit();
  });
});
