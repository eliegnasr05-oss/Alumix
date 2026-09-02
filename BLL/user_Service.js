const userRepo =
    require("../DAL/user_Repository");

const bcrypt =
    require("bcryptjs");

const jwt =
    require("jsonwebtoken");

const {
    generateOTP,
    hashOTP
} = require("../utils/otp");

const {
    sendOTPEmail
} = require("../utils/mailer");

const validCategories = [
    "Management",
    "Operations",
    "Sales/Support"
];

// ================= Validators =================

const isValidEmail = (email) => {
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
};

const isValidPhone = (phone) => {
    const phoneRegex =
        /^[+]?[0-9]{7,15}$/;

    return phoneRegex.test(phone);
};

const isValidLinkedIn = (url) => {
    const cleanUrl =
        String(url || "").trim();

    const linkedInRegex =
        /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/i;

    return linkedInRegex.test(
        cleanUrl
    );
};

// ================= Create Account =================

exports.createAccount =
    async ({
        email,
        password,
        confirmPassword,
        securityCode
    }) => {
        const normalizedEmail =
            String(email || "")
                .trim()
                .toLowerCase();

        const cleanPassword =
            String(password || "");

        const cleanConfirmPassword =
            String(
                confirmPassword || ""
            );

        const enteredSecurityCode =
            String(
                securityCode || ""
            ).trim();

        if (
            !normalizedEmail ||
            !cleanPassword ||
            !cleanConfirmPassword ||
            !enteredSecurityCode
        ) {
            throw new Error(
                "All fields are required"
            );
        }

        if (
            !isValidEmail(
                normalizedEmail
            )
        ) {
            throw new Error(
                "Invalid email format"
            );
        }

        if (
            cleanPassword !==
            cleanConfirmPassword
        ) {
            throw new Error(
                "Passwords do not match"
            );
        }

        if (
            cleanPassword.length < 8
        ) {
            throw new Error(
                "Password must contain at least 8 characters"
            );
        }

        if (
            !process.env
                .ACCOUNT_SECURITY_CODE
        ) {
            throw new Error(
                "Account security code is not configured"
            );
        }

        if (
            enteredSecurityCode !==
            process.env
                .ACCOUNT_SECURITY_CODE
        ) {
            throw new Error(
                "Invalid security code"
            );
        }

        const existingUser =
            await userRepo
                .getUserByEmail(
                    normalizedEmail
                );

        if (existingUser) {
            throw new Error(
                "An account with this email already exists"
            );
        }

        const hashedPassword =
            await bcrypt.hash(
                cleanPassword,
                12
            );

        const userId =
            await userRepo.createUser({
                email:
                    normalizedEmail,
                pass:
                    hashedPassword,
                role: "admin"
            });

        return {
            id: userId,
            email:
                normalizedEmail,
            role: "admin"
        };
    };

// ================= Login =================

exports.loginUser =
    async (email, pass) => {
        const normalizedEmail =
            String(email || "")
                .trim()
                .toLowerCase();

        const password =
            String(pass || "");

        if (
            !normalizedEmail ||
            !password
        ) {
            throw new Error(
                "Email and password are required"
            );
        }

        const user =
            await userRepo
                .getUserByEmail(
                    normalizedEmail
                );

        if (!user) {
            throw new Error(
                "Invalid email or password"
            );
        }

        const passwordMatches =
            await bcrypt.compare(
                password,
                user.pass
            );

        if (!passwordMatches) {
            throw new Error(
                "Invalid email or password"
            );
        }

        if (
            !process.env.JWT_SECRET
        ) {
            throw new Error(
                "JWT secret is not configured"
            );
        }

        const token =
            jwt.sign(
                {
                    id: user.id,
                    email:
                        user.email,
                    role:
                        user.role
                },
                process.env
                    .JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );

        return {
            token,
            role: user.role
        };
    };

// ================= Employee CRUD =================

exports.addEmployee =
    async (employee) => {
        const {
            email,
            phone,
            linkedIn,
            category
        } = employee;

        const normalizedEmail =
            String(email || "")
                .trim()
                .toLowerCase();

        if (
            !isValidEmail(
                normalizedEmail
            )
        ) {
            throw new Error(
                "Invalid email format"
            );
        }

        const existingEmployee =
            await userRepo
                .getEmployeeByEmail(
                    normalizedEmail
                );

        if (existingEmployee) {
            throw new Error(
                "This email already exists"
            );
        }

        if (
            phone &&
            !isValidPhone(phone)
        ) {
            throw new Error(
                "Invalid phone number"
            );
        }

        if (
            linkedIn &&
            !isValidLinkedIn(
                linkedIn
            )
        ) {
            throw new Error(
                "Invalid LinkedIn URL"
            );
        }

        if (
            !validCategories.includes(
                category
            )
        ) {
            throw new Error(
                "Invalid category"
            );
        }

        employee.email =
            normalizedEmail;

        return await userRepo
            .addEmployee(employee);
    };

exports.updateEmployee =
    async (id, employee) => {
        const {
            email,
            phone,
            linkedIn,
            category
        } = employee;

        if (email) {
            const normalizedEmail =
                String(email)
                    .trim()
                    .toLowerCase();

            if (
                !isValidEmail(
                    normalizedEmail
                )
            ) {
                throw new Error(
                    "Invalid email format"
                );
            }

            const existing =
                await userRepo
                    .getEmployeeByEmail(
                        normalizedEmail
                    );

            if (
                existing &&
                Number(existing.id) !==
                    Number(id)
            ) {
                throw new Error(
                    "This email already exists"
                );
            }

            employee.email =
                normalizedEmail;
        }

        if (
            phone &&
            !isValidPhone(phone)
        ) {
            throw new Error(
                "Invalid phone number"
            );
        }

        if (
            linkedIn &&
            !isValidLinkedIn(
                linkedIn
            )
        ) {
            throw new Error(
                "Invalid LinkedIn URL"
            );
        }

        if (
            category &&
            !validCategories.includes(
                category
            )
        ) {
            throw new Error(
                "Invalid category"
            );
        }

        return await userRepo
            .updateEmployee(
                id,
                employee
            );
    };

exports.getEmployeeById =
    async (id) => {
        return await userRepo
            .getEmployeeById(id);
    };

exports.getAllEmployees =
    async () => {
        return await userRepo
            .getAllEmployees();
    };

exports.deleteEmployee =
    async (id) => {
        return await userRepo
            .deleteEmployee(id);
    };

// ================= Password Reset =================

exports.sendResetOTP =
    async (email) => {
        const normalizedEmail =
            String(email || "")
                .trim()
                .toLowerCase();

        if (
            !isValidEmail(
                normalizedEmail
            )
        ) {
            throw new Error(
                "Invalid email format"
            );
        }

        const user =
            await userRepo
                .getUserByEmail(
                    normalizedEmail
                );

        if (!user) {
            throw new Error(
                "Email not found"
            );
        }

        const otp =
            generateOTP();

        const otpHash =
            hashOTP(otp);

        const expires =
            new Date(
                Date.now() +
                    10 *
                        60 *
                        1000
            );

        await userRepo
            .saveResetOTP(
                normalizedEmail,
                otpHash,
                expires
            );

        await sendOTPEmail(
            normalizedEmail,
            otp
        );
    };

exports.resetPassword =
    async (
        email,
        otp,
        newPassword
    ) => {
        const normalizedEmail =
            String(email || "")
                .trim()
                .toLowerCase();

        if (
            !newPassword ||
            newPassword.length < 8
        ) {
            throw new Error(
                "Password must contain at least 8 characters"
            );
        }

        const record =
            await userRepo
                .getResetOTP(
                    normalizedEmail
                );

        if (!record) {
            throw new Error(
                "Invalid request"
            );
        }

        if (
            !record.reset_otp_hash ||
            !record.reset_otp_expires
        ) {
            throw new Error(
                "No password reset request was found"
            );
        }

        if (
            new Date(
                record
                    .reset_otp_expires
            ) < new Date()
        ) {
            throw new Error(
                "OTP expired"
            );
        }

        const submittedOTPHash =
            hashOTP(
                String(otp || "")
            );

        if (
            submittedOTPHash !==
            record.reset_otp_hash
        ) {
            throw new Error(
                "Invalid OTP"
            );
        }

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                12
            );

        await userRepo
            .updatePassword(
                record.id,
                hashedPassword
            );

        return true;
    };

// ================= Carousel CRUD =================

exports.addCarouselPhoto =
    async (photoPath) => {
        const cleanPath =
            String(
                photoPath || ""
            ).trim();

        if (!cleanPath) {
            throw new Error(
                "Photo path is required"
            );
        }

        if (
            cleanPath.length > 500
        ) {
            throw new Error(
                "Photo path is too long"
            );
        }

        return await userRepo
            .addCarouselPhoto(
                cleanPath
            );
    };

exports.getAllCarouselPhotos =
    async () => {
        return await userRepo
            .getAllCarouselPhotos();
    };

exports.getCarouselPhotoById =
    async (id) => {
        return await userRepo
            .getCarouselPhotoById(
                id
            );
    };

exports.updateCarouselPhoto =
    async (id, photoPath) => {
        const existing =
            await userRepo
                .getCarouselPhotoById(
                    id
                );

        if (!existing) {
            throw new Error(
                "Carousel photo not found"
            );
        }

        const cleanPath =
            String(
                photoPath || ""
            ).trim();

        if (!cleanPath) {
            throw new Error(
                "Photo path is required"
            );
        }

        if (
            cleanPath.length > 500
        ) {
            throw new Error(
                "Photo path is too long"
            );
        }

        return await userRepo
            .updateCarouselPhoto(
                id,
                cleanPath
            );
    };

exports.deleteCarouselPhoto =
    async (id) => {
        const existing =
            await userRepo
                .getCarouselPhotoById(
                    id
                );

        if (!existing) {
            throw new Error(
                "Carousel photo not found"
            );
        }

        return await userRepo
            .deleteCarouselPhoto(
                id
            );
    };