const { Router } = require("express")
const { authMiddleware } = require("../Middleware/AuthMiddleware");
const { crearValoracion, getRating} = require("../Handlers/RatingHandler")

const ratingRouter = Router();

ratingRouter.get("/:hotelId", getRating);
ratingRouter.post("/", crearValoracion);




module.exports = ratingRouter;