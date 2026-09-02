const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect("/adminAlumix");
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "admin") {
      res.clearCookie("token", { path: "/" });
      return res.redirect("/adminAlumix");
    }

    req.user = decoded;
    return next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    res.clearCookie("token", { path: "/" });
    return res.redirect("/adminAlumix");
  }
};