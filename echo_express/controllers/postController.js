const postService = require("../services/postService");

const list = async (req, res) => {
    const posts = await postService.list();
    res.status(200).json({ success: true, posts });
};

const get = async (req, res) => {
    const post = await postService.get(req.params.id);
    if (!post) res.status(404).json({ success: false, message: "게시글을 찾을 수 없습니다." });

    res.status(200).json({ success: true, post });
};

const getByContent = async (req, res) => {
    const post = await postService.getByContent(req.params.search);
    if (!post) res.status(404).json({ success: false, message: "게시글을 찾을 수 없습니다." });

    res.status(200).json({ success: true, post });
};

const create = async (req, res) => {
    const { userId, rootPostId, parentPostId, content, state } = req.body;
    if (!userId || !rootPostId || !parentPostId || !content || !state ) res.status(400).json({ success: false, message: "필수 정보를 입력해주세요." });

    const post = await userService.create({ userId, rootPostId, parentPostId, content, state });
    res.status(200).json({ success: true, message: "게시글을 생성했습니다.", post });
};

module.exports = { list, get, getByContent, create };