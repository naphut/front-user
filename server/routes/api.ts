import { Router } from "express";
import * as productController from "../controllers/productController";

const router = Router();

// Category routes
router.get("/categories", productController.getCategories);

// Product routes
router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);

export default router;
