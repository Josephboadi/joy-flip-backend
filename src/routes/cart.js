const express = require("express");

const {
  addItemToCart,
  getCartItems,
  removeCartItems,
} = require("../controller/cart");
const { requireSignin, userMiddleware } = require("../middleware");

const router = express.Router();

router.post(
  "/user/cart/addtocart",
  requireSignin,
  userMiddleware,
  addItemToCart
);
// router.get("/category/getcategory", getCategories);
router.post("/user/getCartItems", requireSignin, userMiddleware, getCartItems);
// New Update
router.post(
  "/user/cart/removeItem",
  requireSignin,
  userMiddleware,
  removeCartItems
);

module.exports = router;
