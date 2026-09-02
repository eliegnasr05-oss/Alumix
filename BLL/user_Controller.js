const userService =
    require("./user_Service");

const itemService =
    require("./item_Service");

const jwt =
    require("jsonwebtoken");

// ================= Create Account =================

exports.createAccountPage = (req, res) => {
    res.render("create-account", {
        error: null,
        formData: {}
    });
};

exports.createAccount = async (req, res) => {
    const formData = {
        email: String(
            req.body.email || ""
        ).trim()
    };

    try {
        const {
            email,
            password,
            confirmPassword,
            securityCode
        } = req.body;

        await userService.createAccount({
            email,
            password,
            confirmPassword,
            securityCode
        });

        res.redirect(
            "/adminAlumix?accountCreated=true"
        );
    } catch (error) {
        console.error(
            "Create account error:",
            error
        );

        res.status(400).render(
            "create-account",
            {
                error: error.message,
                formData
            }
        );
    }
};

// ================= Login =================

exports.loginUser = async (req, res) => {
    try {
        const {
            email,
            pass
        } = req.body;

        const result =
            await userService.loginUser(
                email,
                pass
            );

        res.cookie(
            "token",
            result.token,
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV ===
                    "production",
                sameSite: "lax",
                maxAge:
                    60 * 60 * 1000
            }
        );

        res.redirect("/adminAlumix");
    } catch (error) {
        res.status(401).render(
            "login",
            {
                error: error.message,
                success: null
            }
        );
    }
};

// ================= Logout =================

exports.logoutUser = (req, res) => {
    res.clearCookie("token");

    res.redirect("/adminAlumix");
};

// ================= Admin Dashboard =================

exports.renderAdminDashboard =
    async (req, res) => {
        try {
            const token =
                req.cookies.token;

            if (!token) {
                return res.render(
                    "login",
                    {
                        error: null,
                        success:
                            req.query
                                .accountCreated ===
                            "true"
                                ? "Account created successfully. You can now sign in."
                                : null
                    }
                );
            }

            if (!process.env.JWT_SECRET) {
                throw new Error(
                    "JWT secret is not configured"
                );
            }

            const decoded =
                jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );

            if (
                decoded.role !== "admin"
            ) {
                res.clearCookie("token");

                return res.status(403).render(
                    "login",
                    {
                        error:
                            "Access denied. Administrators only.",
                        success: null
                    }
                );
            }

            const employees =
                await userService
                    .getAllEmployees();

            const items =
                await itemService
                    .getAllItems();

            const carouselPhotos =
                await userService
                    .getAllCarouselPhotos();

            res.render(
                "adminDashboard",
                {
                    employees,
                    items,
                    carouselPhotos
                }
            );
        } catch (error) {
            console.error(
                "Admin dashboard error:",
                error
            );

            res.clearCookie("token");

            res.render(
                "login",
                {
                    error:
                        "Session expired. Please sign in again.",
                    success: null
                }
            );
        }
    };

// ================= Employee CRUD =================

exports.addEmployeePage = (
    req,
    res
) => {
    res.render("addUser", {
        error: null
    });
};

exports.addEmployee = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            first_name_ar,
            last_name_ar,
            position,
            position_ar,
            phone,
            email,
            linkedIn,
            category
        } = req.body;

        const photo =
            req.files?.photo?.[0]
                ? "/uploads/" + req.files.photo[0].filename
                : null;

        const resume =
            req.files?.resume?.[0]
                ? "/uploads/" + req.files.resume[0].filename
                : null;

        await userService.addEmployee({
            first_name,
            last_name,
            first_name_ar: first_name_ar || null,
            last_name_ar: last_name_ar || null,
            position,
            position_ar: position_ar || null,
            phone,
            email,
            linkedIn,
            photo,
            category,
            resume
        });

        return res.redirect("/adminAlumix");
    } catch (error) {
        console.error("Add employee error:", error);

        return res.status(400).render("addUser", {
            error: error.message
        });
    }
};
exports.editEmployeePage =
    async (req, res) => {
        try {
            const employee =
                await userService
                    .getEmployeeById(
                        req.params.id
                    );

            if (!employee) {
                return res.redirect(
                    "/adminAlumix"
                );
            }

            res.render(
                "editUser",
                {
                    employee,
                    error: null
                }
            );
        } catch (error) {
            res.redirect(
                "/adminAlumix"
            );
        }
    };

exports.editEmployee =
    async (req, res) => {
        try {
            const id =
                req.params.id;

            const current =
                await userService
                    .getEmployeeById(id);

            if (!current) {
                return res.redirect(
                    "/adminAlumix"
                );
            }

            const employeeData = {
                ...req.body
            };

            employeeData.photo =
                current.photo;

            employeeData.resume =
                current.resume_path;

            if (req.files) {
                if (
                    req.files.photo &&
                    req.files.photo[0]
                ) {
                    employeeData.photo =
                        "/uploads/" +
                        req.files.photo[0]
                            .filename;
                }

                if (
                    req.files.resume &&
                    req.files.resume[0]
                ) {
                    employeeData.resume =
                        "/uploads/" +
                        req.files.resume[0]
                            .filename;
                }
            }

            await userService
                .updateEmployee(
                    id,
                    employeeData
                );

            res.redirect(
                "/adminAlumix"
            );
        } catch (error) {
            const employee =
                await userService
                    .getEmployeeById(
                        req.params.id
                    );

            res.status(400).render(
                "editUser",
                {
                    employee,
                    error:
                        error.message
                }
            );
        }
    };

exports.deleteEmployee =
    async (req, res) => {
        try {
            await userService
                .deleteEmployee(
                    req.params.id
                );

            res.redirect(
                "/adminAlumix"
            );
        } catch (error) {
            res.redirect(
                "/adminAlumix"
            );
        }
    };

// ================= Password Reset =================

exports.forgotPasswordPage = (
    req,
    res
) => {
    res.render(
        "forgot-password",
        {
            error: null,
            success: null
        }
    );
};

exports.sendResetOTP =
    async (req, res) => {
        try {
            await userService
                .sendResetOTP(
                    req.body.email
                );

            res.render(
                "reset-password",
                {
                    email:
                        req.body.email,
                    success:
                        "OTP sent successfully. Check your email.",
                    error: null
                }
            );
        } catch (error) {
            res.status(400).render(
                "forgot-password",
                {
                    error:
                        error.message,
                    success: null
                }
            );
        }
    };

exports.resetPassword =
    async (req, res) => {
        const {
            email,
            otp,
            password
        } = req.body;

        try {
            await userService
                .resetPassword(
                    email,
                    otp,
                    password
                );

            res.redirect(
                "/adminAlumix?passwordReset=true"
            );
        } catch (error) {
            res.status(400).render(
                "reset-password",
                {
                    email,
                    error:
                        error.message,
                    success: null
                }
            );
        }
    };

// ================= Other Pages =================

exports.renderAboutPage = (
    req,
    res
) => {
    res.render("about");
};

exports.renderTeamPage =
    async (req, res) => {
        try {
            const employees =
                await userService
                    .getAllEmployees();

            const carouselPhotos =
                await userService
                    .getAllCarouselPhotos();

            const categoryOrder = [
                "Management",
                "Operations",
                "Sales/Support"
            ];

            const grouped = {};

            categoryOrder.forEach(
                (category) => {
                    grouped[category] = [];
                }
            );

            employees.forEach(
                (employee) => {
                    const category =
                        employee.category ||
                        "Operations";

                    if (
                        grouped[category]
                    ) {
                        grouped[
                            category
                        ].push(employee);
                    }
                }
            );

            res.render(
                "team",
                {
                    grouped,
                    categoryOrder,
                    carouselPhotos
                }
            );
        } catch (error) {
            res.status(500).send(
                "Server error"
            );
        }
    };

// ================= Carousel CRUD =================

exports.addCarouselPhoto =
    async (req, res) => {
        try {
            const photo =
                req.files &&
                req.files
                    .carouselPhoto &&
                req.files
                    .carouselPhoto[0]
                    ? "/uploads/" +
                      req.files
                          .carouselPhoto[0]
                          .filename
                    : null;

            if (!photo) {
                throw new Error(
                    "Carousel photo is required"
                );
            }

            await userService
                .addCarouselPhoto(
                    photo
                );

            res.redirect(
                "/adminAlumix"
            );
        } catch (error) {
            res.redirect(
                "/adminAlumix"
            );
        }
    };

exports.editCarouselPhoto =
    async (req, res) => {
        try {
            const id =
                req.params.id;

            const current =
                await userService
                    .getCarouselPhotoById(
                        id
                    );

            if (!current) {
                return res.redirect(
                    "/adminAlumix"
                );
            }

            let photoPath =
                current.photo_path;

            if (
                req.files &&
                req.files
                    .carouselPhoto &&
                req.files
                    .carouselPhoto[0]
            ) {
                photoPath =
                    "/uploads/" +
                    req.files
                        .carouselPhoto[0]
                        .filename;
            }

            await userService
                .updateCarouselPhoto(
                    id,
                    photoPath
                );

            res.redirect(
                "/adminAlumix"
            );
        } catch (error) {
            res.redirect(
                "/adminAlumix"
            );
        }
    };

exports.deleteCarouselPhoto =
    async (req, res) => {
        try {
            await userService
                .deleteCarouselPhoto(
                    req.params.id
                );

            res.redirect(
                "/adminAlumix"
            );
        } catch (error) {
            res.redirect(
                "/adminAlumix"
            );
        }
    };