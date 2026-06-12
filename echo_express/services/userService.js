const { User } = require("../models");

const list = async () => {
    return await User.findAll();
};

const get = async (id) => {
    return await User.findByPk(id);
};

const getByNickname = async (nickname) => {
    return await User.findOne({ where: { nickname } });
};

const create = async ({ id, email, password, nickname, image }) => {
    return await User.create({ id, email, password, nickname, image });
};

module.exports = { list, get, getByNickname, create };