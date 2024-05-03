import { Router } from "express";
export const router = Router();
import ProductManager from "../dao/ProductManagerDB.js";
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  let products = await productManager.getProducts();
  products = products.map((product) => product.toJSON());
  res.status(200).render("home", { products });
});

router.get("/realTimeProducts", async (req, res) => {
  let products = await productManager.getProducts();
  products = products.map((product) => product.toJSON());
  res.status(200).render("realTimeProducts", { products });
});

router.get("/chat", (req, res) => {
  res.status(200).render("chat");
});
