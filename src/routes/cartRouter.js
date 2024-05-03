import { Router } from "express";
export const router = Router();
import CartManager from "../dao/CartManagerDB.js";

import { isValidObjectId } from "mongoose";
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  try {
    let getAllCarts = await cartManager.getCarts();
    res.json({ getAllCarts });
  } catch (error) {
    res.status(300).json({ error: `error getting cart ${cid}` });
  }
});

router.post("/", async (req, res) => {
  try {
    await cartManager.createCart();
    let carts = await cartManager.getCarts();
    res.json({
      payload: `Cart created!`,
    });
  } catch (error) {
    res.status(300).json({ error: "error creating cart" });
  }
});

router.get("/:cid", async (req, res) => {
  let { cid } = req.params;
  if (!isValidObjectId(cid)) {
    return res.status(400).json({
      error: `Enter a valid MongoDB id`,
    });
  }

  try {
    let cartById = await cartManager.getCartById(cid);
    res.json({ cartById });
  } catch (error) {
    res.status(300).json({ error: `error getting cart ${cid}` });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;
  if (!isValidObjectId(cid, pid)) {
    return res.status(400).json({
      error: `Enter a valid MongoDB id`,
    });
  }

  try {
    await cartManager.addProducts(cid, pid);
    let cartUpdated = await cartManager.getCartById(cid);
    res.json({ payload: cartUpdated });
  } catch (error) {
    res
      .status(300)
      .json({ error: `error when adding product ${pid} to cart ${cid}` });
  }
});
