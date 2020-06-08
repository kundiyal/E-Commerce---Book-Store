const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "svg/" });

const {
  getProductById,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product");

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//params
router.param("userId", getUserById);
router.param("productId", getProductById);


//File Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./svg");
  },
  filename: function (req, file, cb) {
    //cb(null, new Date().toISOString() + file.originalname);
    cb(null, Date.now() + "_" + file.originalname);
  },
});
var fu = multer({ storage: storage });


//Create route(s)
router.post(
    "/product/create/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,    
    fu.single('photo'),
    createProduct
  );

  
  //Read route(s)
 router.get("/product/:productId", getProduct);
// router.get("/products", getAllProduct);

//Update Route(s)
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,    
  fu.single('photo'),
  updateProduct
);

//Delete Route(s)
router.delete("/product/:productId", deleteProduct);

//Listing Route(s)
router.get("/products", getAllProducts);

router.get("/products/categories", getAllUniqueCategories);

module.exports = router;