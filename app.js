const express = require("express");

const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.set("trust proxy", 1);
// ================= MIDDLEWARE =================
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "PL", "public")));

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "PL", "public", "uploads")
    )
);

// ================= VIEW ENGINE =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "PL", "views"));

// ================= SERVICES & CONTROLLERS =================
const itemService = require("./BLL/item_Service");
const userService = require("./BLL/user_Service");
const userRoutes = require("./BLL/user_Routes");
const itemRoutes = require("./BLL/item_Routes");
const userController = require("./BLL/user_Controller");

// ================= HOME PAGE =================
app.get("/", async (req, res) => {
    try {
        const items = await itemService.getAllItems();
        const employees = await userService.getAllEmployees();

        res.render("home", {
            items,
            employees
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// ================= ROUTES =================
app.use("/users", userRoutes);
app.use("/items", itemRoutes);

// ================= ADMIN =================

// Main admin page
app.get("/admin", userController.renderAdminDashboard);

// Optional: keep old link working
app.get("/adminAlumix", (req, res) => {
    res.redirect("/admin");
});

// Login URL
app.get("/login", (req, res) => {
    res.redirect("/admin");
});

// Create account shortcut
app.get("/create-account", (req, res) => {
    res.redirect("/users/create-account");
});

// ================= LOGOUT =================
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/admin");
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});