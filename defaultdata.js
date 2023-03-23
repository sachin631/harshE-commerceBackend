const productsData = require("./constent/productData");
const productsModel = require("./models/ProductModel");

const defaultFunction = async () => {
  try {
    await productsModel.deleteMany({})
    const products = await productsModel.insertMany(productsData);
    console.log("from defaultdata", products);
  } catch (error) {
    console.log("from defaultdata", error);
  }
};
module.exports = defaultFunction;
