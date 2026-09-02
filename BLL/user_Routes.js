const express = require("express");

const router = express.Router();

const userController =
    require("./user_Controller");

const auth =
    require("../middleware/auth");

const upload =
    require("../middleware/upload");

// ================= Authentication =================

// Login
router.post(
    "/login",
    userController.loginUser
);

// Create account page
router.get(
    "/create-account",
    userController.createAccountPage
);

// Create account submission
router.post(
    "/create-account",
    userController.createAccount
);

// Logout can also work through /users/logout
router.get(
    "/logout",
    userController.logoutUser
);

// ================= Employee CRUD =================

// Add employee page
router.get(
    "/add",
    auth,
    userController.addEmployeePage
);

// Add employee
router.post(
    "/add",
    auth,
    upload.fields([
        {
            name: "photo",
            maxCount: 1
        },
        {
            name: "resume",
            maxCount: 1
        }
    ]),
    userController.addEmployee
);

// Edit employee page
router.get(
    "/edit/:id",
    auth,
    userController.editEmployeePage
);

// Edit employee
router.post(
    "/edit/:id",
    auth,
    upload.fields([
        {
            name: "photo",
            maxCount: 1
        },
        {
            name: "resume",
            maxCount: 1
        }
    ]),
    userController.editEmployee
);

// Delete employee
router.get(
    "/delete/:id",
    auth,
    userController.deleteEmployee
);

// ================= Password Reset =================

router.get(
    "/forgot-password",
    userController.forgotPasswordPage
);

router.post(
    "/forgot-password",
    userController.sendResetOTP
);

router.post(
    "/reset-password",
    userController.resetPassword
);

// ================= Other Pages =================

router.get(
    "/about",
    userController.renderAboutPage
);

router.get(
    "/team",
    userController.renderTeamPage
);

// ================= Carousel CRUD =================

// Add carousel photo
router.post(
    "/carousel/add",
    auth,
    upload.fields([
        {
            name: "carouselPhoto",
            maxCount: 1
        }
    ]),
    userController.addCarouselPhoto
);

// Edit carousel photo
router.post(
    "/carousel/edit/:id",
    auth,
    upload.fields([
        {
            name: "carouselPhoto",
            maxCount: 1
        }
    ]),
    userController.editCarouselPhoto
);

// Delete carousel photo
router.get(
    "/carousel/delete/:id",
    auth,
    userController.deleteCarouselPhoto
);

module.exports = router;