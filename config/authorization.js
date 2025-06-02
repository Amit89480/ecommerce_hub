module.exports = {
  user: {
    authNotRequire: ["/", "/login", "/list/products", "/product/details"],
  },
  admin: { authNotRequire: ["/", "/login"] },
};
