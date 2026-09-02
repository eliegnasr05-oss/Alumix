const itemService = require("./item_Service");

exports.addItemPage = (req, res) => {
    res.render("addItem");
};

exports.addItem = async (req, res) => {
    try {
        const itemData = {
            title: req.body.title,
            title_ar: req.body.title_ar,
            label: req.body.label,
            photo: req.file ? "/uploads/" + req.file.filename : null
        };

        await itemService.addItem(itemData);
        res.redirect("/adminAlumix");
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.editItemPage = async (req, res) => {
    try {
        const item = await itemService.getItemById(req.params.id);
        if (!item) return res.status(404).send("Item not found");
        res.render("editItem", { item });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.editItem = async (req, res) => {
    try {
        const itemData = {
            title: req.body.title,
            title_ar: req.body.title_ar,
            label: req.body.label,
            photo: req.file ? "/uploads/" + req.file.filename : req.body.oldPhoto
        };

        await itemService.updateItem(req.params.id, itemData);
        res.redirect("/adminAlumix");
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.deleteItem = async (req, res) => {
    try {
        await itemService.deleteItem(req.params.id);
        res.redirect("/adminAlumix");
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.renderProductPage = async (req, res) => {
    try {
        const items = await itemService.getAllItems();
        res.render("products", { items });
    } catch (err) {
        res.status(500).send(err.message);
    }
};