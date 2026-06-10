const userService = require("../services/userService");

const list = async (req, res) => {
    const users = await userService.list();
    res.status(200).json({ success: true, users });
};

const get = async (req, res) => {
    const user = await userService.get(req.params.id);
    if (!user) res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다." });

    res.status(200).json({ success: true, user });
};

const getByNickname = async (req, res) => {
    const user = await userService.getByNickname(req.params.nickname);
    if (!user) res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다." });

    res.status(200).json({ success: true, user });
};

const create = async (req, res) => {
    const { id, email, password, nickname, image } = req.body;
    if (!id || !email || !password || !nickname || !image ) res.status(400).json({ success: false, message: "필수 정보를 입력해주세요." });

    // TODO : 이메일 검증 추가
    if (await userService.get(id)) res.status(400).json({ success: false, message: "이미 등록된 아이디입니다." });

    const user = await userService.create({ id, email, password, nickname, image });
    res.status(200).json({ success: true, message: "사용자를 생성했습니다.", user });
};

module.exports = { list, get, getByNickname, create };