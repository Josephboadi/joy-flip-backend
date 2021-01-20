const Product = require("../models/product");
const multer = require("multer");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");
const cloudinary = require("../middleware/cloudinary");

exports.createProduct = async (req, res) => {
  //   res.status(200).json({ file: req.files, body: req.body });

  const { name, price, quantity, description, category, createdBy } = req.body;
  let productPictures = [];
  let urls = [];

  if (req.files.length > 0) {
    try {
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await cloudinary.uploader.upload(path);
        urls.push(newPath);

        productPictures = urls.map((url) => {
          return { img: url.secure_url };
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  const product = new Product({
    name: name,
    slug: slugify(name),
    price,
    quantity,
    description,
    productPictures,
    category,
    createdBy: req.user._id,
  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ product });
    }
  });
};

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id type")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error });
          }
          if (category.type) {
            if (products.length > 0) {
              res.status(200).json({
                products,
                priceRange: {
                  under6k: 5000,
                  under15k: 8000,
                  under20k: 15000,
                  under30k: 20000,
                },
                productsByPrice: {
                  under6k: products.filter((product) => product.price <= 6000),
                  under8k: products.filter(
                    (product) => product.price > 6000 && product.price <= 8000
                  ),
                  under15k: products.filter(
                    (product) => product.price > 8000 && product.price <= 15000
                  ),
                  under20k: products.filter(
                    (product) => product.price > 15000 && product.price <= 20000
                  ),
                  under30k: products.filter(
                    (product) => product.price > 20000 && product.price <= 30000
                  ),
                },
              });
            }
          } else {
            res.status(200).json({ products });
          }
        });
      }
    });
};

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find({})
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
};
