const conn =
    require("./Database");

// ================= Users =================

exports.getUserByEmail =
    async (email) => {
        const [rows] =
            await conn.query(
                `SELECT *
                 FROM users
                 WHERE email = ?
                 LIMIT 1`,
                [email]
            );

        return rows[0];
    };

exports.getUserById =
    async (id) => {
        const [rows] =
            await conn.query(
                `SELECT id, email, role, created_at
                 FROM users
                 WHERE id = ?
                 LIMIT 1`,
                [id]
            );

        return rows[0];
    };

exports.createUser =
    async ({
        email,
        pass,
        role
    }) => {
        const [result] =
            await conn.query(
                `INSERT INTO users
                    (email, pass, role)
                 VALUES (?, ?, ?)`,
                [
                    email,
                    pass,
                    role
                ]
            );

        return result.insertId;
    };

// ================= Employees =================

exports.addEmployee = async (employee) => {
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
        photo,
        category,
        resume
    } = employee;

    const [result] = await conn.query(
        `INSERT INTO employees (
            first_name,
            last_name,
            first_name_ar,
            last_name_ar,
            position,
            position_ar,
            phone,
            email,
            linkedIn,
            photo,
            category,
            resume_path
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            first_name,
            last_name,
            first_name_ar || null,
            last_name_ar || null,
            position,
            position_ar || null,
            phone || null,
            email,
            linkedIn || null,
            photo || null,
            category,
            resume || null
        ]
    );

    return result.insertId;
};

exports.updateEmployee = async (id, employee) => {
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
        photo,
        category,
        resume
    } = employee;

    await conn.query(
        `UPDATE employees
         SET
            first_name = ?,
            last_name = ?,
            first_name_ar = ?,
            last_name_ar = ?,
            position = ?,
            position_ar = ?,
            phone = ?,
            email = ?,
            linkedIn = ?,
            photo = ?,
            category = ?,
            resume_path = ?
         WHERE id = ?`,
        [
            first_name,
            last_name,
            first_name_ar || null,
            last_name_ar || null,
            position,
            position_ar || null,
            phone || null,
            email,
            linkedIn || null,
            photo || null,
            category,
            resume || null,
            id
        ]
    );
};
exports.getEmployeeById =
    async (id) => {
        const [rows] =
            await conn.query(
                `SELECT *
                 FROM employees
                 WHERE id = ?
                 LIMIT 1`,
                [id]
            );

        return rows[0];
    };

exports.getEmployeeByEmail =
    async (email) => {
        const [rows] =
            await conn.query(
                `SELECT *
                 FROM employees
                 WHERE email = ?
                 LIMIT 1`,
                [email]
            );

        return rows[0];
    };

exports.getAllEmployees =
    async () => {
        const [rows] =
            await conn.query(
                `SELECT *
                 FROM employees
                 ORDER BY id DESC`
            );

        return rows;
    };

exports.deleteEmployee =
    async (id) => {
        await conn.query(
            `DELETE FROM employees
             WHERE id = ?`,
            [id]
        );
    };

// ================= Password Reset =================

exports.saveResetOTP =
    async (
        email,
        otpHash,
        expires
    ) => {
        await conn.query(
            `UPDATE users
             SET
                reset_otp_hash = ?,
                reset_otp_expires = ?
             WHERE email = ?`,
            [
                otpHash,
                expires,
                email
            ]
        );
    };

exports.getResetOTP =
    async (email) => {
        const [rows] =
            await conn.query(
                `SELECT
                    id,
                    reset_otp_hash,
                    reset_otp_expires
                 FROM users
                 WHERE email = ?
                 LIMIT 1`,
                [email]
            );

        return rows[0];
    };

exports.updatePassword =
    async (
        id,
        password
    ) => {
        await conn.query(
            `UPDATE users
             SET
                pass = ?,
                reset_otp_hash = NULL,
                reset_otp_expires = NULL
             WHERE id = ?`,
            [
                password,
                id
            ]
        );
    };

// ================= Carousel =================

exports.getCarouselPhotoById =
    async (id) => {
        const [rows] =
            await conn.query(
                `SELECT *
                 FROM carousel_photos
                 WHERE id = ?
                 LIMIT 1`,
                [id]
            );

        return rows[0];
    };

exports.addCarouselPhoto =
    async (photoPath) => {
        const [result] =
            await conn.query(
                `INSERT INTO carousel_photos
                    (photo_path)
                 VALUES (?)`,
                [photoPath]
            );

        return result.insertId;
    };

exports.getAllCarouselPhotos =
    async () => {
        const [rows] =
            await conn.query(
                `SELECT *
                 FROM carousel_photos
                 ORDER BY created_at DESC`
            );

        return rows;
    };

exports.updateCarouselPhoto =
    async (
        id,
        photoPath
    ) => {
        await conn.query(
            `UPDATE carousel_photos
             SET photo_path = ?
             WHERE id = ?`,
            [
                photoPath,
                id
            ]
        );
    };

exports.deleteCarouselPhoto =
    async (id) => {
        await conn.query(
            `DELETE FROM carousel_photos
             WHERE id = ?`,
            [id]
        );
    };