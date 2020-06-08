const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    const temp = cate;
    if (err) {
      return res.status(400).json({
        error: "Category not found",
      });
    }
    req.category = cate;    
  });
  next();
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);

  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Error saving category",
        error1: err.message,
      });
    }
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "No Category Found",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.Name = req.body.Name;

  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "failed to update Category",
      });
    }
    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  if(!category){
    return res.status(400).json({
      message: "Item Doesn't Exist",
    });
  }
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "failed to update Category",
      });
    }
    res.json({
      message: req.category.Name + " Category deleted successfuly!",
    });
  });
};
