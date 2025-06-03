module.exports = {
  user: {
    authNotRequire: [
      "/",
      "/login",
      "/list/products",
      "/product/details",
      "/signup",
    ],
  },
  admin: { authNotRequire: ["/", "/login"] },
};
