const Product = require("../models/product");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  //TODO:
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete",
      });
    }
    res.json({
      message: deletedProduct + " deleted successefuly!",
    });
  });
};

exports.updateProduct = (req, res) => {
  var product = new Product(req.body);
  if (req.file) {
    product.photo = req.file.filename;
  }

  product.save((err, product) => {
    if (err) {
      return res.status(400).json({
        error: "Error saving Product",
        error1: err.message,
        product,
      });
    }
    res.json({ product });
  });
};

exports.createProduct = (req, res) => {
  if (!req.file) {
    return res.status(406).json({
      error: "Something wrong with the image!",
    });
  } else {
    var product = new Product(req.body);
    product.photo = req.file.filename;

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Error saving Product",
          error1: err.message,
          product,
        });
      }
      res.json({ product });
    });
  }
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  let sortBy = req.query.sortBy ? parseInt(req.query.sortBy) : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No Product Found",
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req,res)=>{
  Product.distinct("category",{},(err,category)=>{
    if(err){
      return res.status(400).json({
        error:"No Category Found"
      })
    }
    res.json(category)
  })
}

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.product.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed",
      });
    }
  });

  next();
};
