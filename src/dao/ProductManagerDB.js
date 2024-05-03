import { productsModel } from "./models/productsModel.js";

export default class ProductManager {
  async addProducts({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [], // tambien pasar en el body de la request como array
  }) {
    let productAdded = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    await productsModel.create(productAdded);
  }

  async getProducts() {
    return await productsModel.find();
  }

  async getProductsBy(filtro) {
    return await productsModel.findOne(filtro);
  }

  async updateProducts(id, productData) {
    // ---> 'PRODUCTDATA' se pasa por el body de postman<---
    return await productsModel.findByIdAndUpdate(id, productData, {
      runValidators: true,
      returnDocument: "after",
    });
  }

  async deleteProducts(productId) {
    return await productsModel.deleteOne({ _id: productId });
  }
}
