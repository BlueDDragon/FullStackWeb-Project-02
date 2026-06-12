const { User, Post } = require("../models");

const list = async () => {
    return await Post.findAll({ order: [["id", "desc"]]});
};

const get = async (id) => {
    return await Post.findByPk(id);
};

const getByContent = async (search) => {
    // return await Post.findAll({ where: {}})
};

const create = async ({ userId, rootPostId, parentPostId, content, state }) => {
    return await Post.create({ userId, rootPostId, parentPostId, content, state });
};

const remove = async (id) => {
    const post = await Post.findByPk(id);
    if (!post) return null;

    await post.destroy();
    return post;
};

module.exports = { list, get, getByContent, create, remove };