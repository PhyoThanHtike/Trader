import prisma from "../utils/database.js";

export const addProduct = async (req, res) => {
  try {
    const { name, avgPrice } = req.body;
    // const userId = req.user.id;
    // const user = await prisma.user.findUnique({ userId });
    // if (!user) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "User not found!" });
    // }
    // if (user.role != "ADMIN") {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "User not allowed!" });
    // }
    const product = await prisma.product.create({
      data: {
        name,
        avgPrice,
      },
    });
    res.json({
      success: true,
      message: "Product added successful",
      product: {
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        productAvgPrice: product.avgPrice,
      },
    });
  } catch (error) {
    console.log("Error in product controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    if (!products) {
      return res
        .status(404)
        .json({ success: false, message: "Products not found!" });
    }
    res.json({
      success: true,
      message: "Products found!",
      products: products,
    });
  } catch (error) {
    console.log("Error in product controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params;
    console.log(productId);
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Products not found!" });
    }
    res.json({
      success: true,
      message: "Product found!",
      product: {
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        productAvgPrice: product.avgPrice,
      },
    });
  } catch (error) {
    console.log("Error in product controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
