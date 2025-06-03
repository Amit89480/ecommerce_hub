const express = require("express");
const UserController = require("../controllers/users/UserController");
const AuthController = require("../controllers/users/AuthController");
const InventoryController = require("../controllers/users/InventoryController");
const CartController = require("../controllers/users/CartController");
const OrderController = require("../controllers/users/OrderController");
const router = express.Router();

router.route("/signup").post(UserController.signUpUser);
router.route("/profile/details").get(UserController.getUserDetails);
router.route("/logout").get(AuthController.logout);
router.route("/login").post(AuthController.accountLogin);

//inventory apis
router.route("/list/products").post(InventoryController.listAllProducts);
router.route("/product/details").post(InventoryController.prductDetailsById);

//cart apis
router.route("/add/item").post(CartController.addToCart);
router.route("/list/cart/items").post(CartController.listAllCartItems);
router.route("/delete/cart/item").post(CartController.deleteCartItems);

//orders api
router.route("/initiate/order").post(OrderController.createOrder);
router.route("/view/order/details").post(OrderController.viewOrderById);

module.exports = router;
