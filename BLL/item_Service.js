const itemRepo = require("../DAL/item_Repository");

exports.getAllItems = async () => await itemRepo.getAllItems();
exports.getItemById = async (id) => await itemRepo.getItemById(id);
exports.addItem = async (item) => await itemRepo.addItem(item);
exports.updateItem = async (id, item) => await itemRepo.updateItem(id, item);
exports.deleteItem = async (id) => await itemRepo.deleteItem(id);
