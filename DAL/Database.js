const mySql=require("mysql2/promise");

const pool=mySql.createPool({
    host:"localhost",
    user:"root",
    password:"Elie2005",
    database:"alumix_db",
});
(async()=> {
    try {
        const connection = await pool.getConnection();
        console.log("Database connected successfully!");
        connection.release();
    } catch (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
})();
module.exports=pool;