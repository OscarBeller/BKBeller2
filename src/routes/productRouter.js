import { Router } from "express";
import ProductManager from "../dao/ProductManagerDB.js";
import { io } from "../app.js";
import { isValidObjectId } from "mongoose";
export const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    let products = await productManager.getProducts();
    let limit = req.query.limit;

    limit = Number(limit);
    let pdata = products;
    if (limit && limit > 0) {
      pdata = pdata.slice(0, limit);
    } else {
      pdata;
    }
    res.json(pdata);
  } catch (error) {
    res.status(400).json({ error: `${error.message}` });
  }
});

router.get("/:pid", async (req, res) => {
  let { pid } = req.params;
  if (!isValidObjectId(pid)) {
    return res.status(400).json({
      error: `Ingrese un id valido de MongoDB`,
    });
  }
  try {
    let product = await productManager.getProductsBy({ _id: pid });
    if (product) {
      res.json({ product });
    } else {
      return res.json({ error: `Product not found` });
    }
  } catch (error) {
    res.status(400).json({ error: `Product ${pid} not found` });
  }
});

router.post("/", async (req, res) => {
  let { title, description, code, price, status, stock, category, thumbnails } =
    req.body;
  if (!title || !description || !code || !price || !stock || !category)
    return res.json({ error: "Check unfilled fields" });

  let exist;
  try {
    exist = await productManager.getProductsBy({ code });
  } catch (error) {
    return res.status(500).json({
      error: `${error.message}`,
    });
  }

  if (exist) {
    return res
      .status(400)
      .json({ error: `Product with code ${code} is already registered` });
  }

  try {
    await productManager.addProducts({ ...req.body });
    let productList = await productManager.getProducts();
    io.emit("updateProducts", productList);
    return res.json({ payload: `Product added` });
  } catch (error) {
    res.status(300).json({ error: "Error when the product was created" });
  }
});

router.put("/:pid", async (req, res) => {
  let { pid } = req.params;
  if (!isValidObjectId(pid)) {
    return res.status(400).json({
      error: `Enter a valid MongoDB id`,
    });
  }

  let toUpdate = req.body;

  if (toUpdate._id) {
    delete toUpdate._id;
  }

  if (toUpdate.code) {
    let exist;
    try {
      exist = await productManager.getProductsBy({ code: toUpdate.code });
      if (exist) {
        return res.status(400).json({
          error: `There is already another product with the code ${toUpdate.code}`,
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: `${error.message}`,
      });
    }
  }

  try {
    const products = await productManager.updateProducts(pid, toUpdate);
    return res.json(products);
  } catch (error) {
    res.status(300).json({ error: "Error when modifying the product" });
  }
});

router.delete("/:pid", async (req, res) => {
  let { pid } = req.params;
  if (!isValidObjectId(pid)) {
    return res.status(400).json({
      error: `Enter a valid MongoDB id`,
    });
  }
  try {
    let products = await productManager.deleteProducts(pid);
    if (products.deletedCount > 0) {
      let productList = await productManager.getProducts();
      io.emit("deleteProducts", productList);
      return res.json({ payload: `Product ${pid} deleted` });
    } else {
      return res.status(404).json({ error: `Product ${id} doesnt exist` });
    }
  } catch (error) {
    res.status(300).json({ error: `Error deleting product ${pid}` });
  }
});
