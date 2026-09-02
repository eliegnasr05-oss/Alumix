const bcrypt = require("bcryptjs");

(async () => {
    try {
        const password = "Alumix@2026"; 
        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Original password:", password);
        console.log("Hashed password:", hashedPassword);
    } catch (err) {
        console.error("Error hashing password:", err);
    }
})();
