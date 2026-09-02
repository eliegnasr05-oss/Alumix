const conn = require("./Database");

exports.getAllItems = async () => {
    const [rows] = await conn.query("SELECT * FROM items");
    return rows;
};

exports.getItemById = async (id) => {
    const [rows] = await conn.query("SELECT * FROM items WHERE id=?", [id]);
    return rows[0];
};

exports.addItem = async (item) => {
    const { title, title_ar, label, photo } = item;

    const [result] = await conn.query(
        "INSERT INTO items (title, title_ar, label, photo) VALUES (?, ?, ?, ?)",
        [title, title_ar ?? null, label ?? null, photo ?? null]
    );

    return result.insertId;
};

exports.updateItem = async (id, item) => {
    const { title, title_ar, label, photo } = item;

    await conn.query(
        "UPDATE items SET title=?, title_ar=?, label=?, photo=? WHERE id=?",
        [title, title_ar ?? null, label ?? null, photo ?? null, id]
    );
};

exports.deleteItem = async (id) => {
    await conn.query("DELETE FROM items WHERE id=?", [id]);
};