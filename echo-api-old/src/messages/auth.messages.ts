export const AUTH_MESSAGES = {
    SUCCESS: {
        REGISTER: "회원가입에 성공했습니다.",

        LOGIN: "로그인에 성공했습니다.",
        LOGOUT: "로그아웃되었습니다.",

        ME: "현재 로그인 정보를 불러옵니다.",

        FIND_USERS: "사용자 목록을 조회합니다.",
        FIND_USER: "사용자를 조회합니다.",
        UPDATE_USER: "사용자 정보가 수정되었습니다.",
        DELETE_USER: "사용자 정보가 삭제되었습니다.",
    },

    ERROR: {
        REGISTER: "아이디 또는 비밀번호가 올바르지 않습니다.",
        LOGIN: "아이디 또는 비밀번호가 올바르지 않습니다.",
        
        LOGIN_VALID_ID: "아이디가 올바르지 않습니다.",
        LOGIN_VALID_PW: "비밀번호가 올바르지 않습니다.",

        CONFLICT_ID: "중복된 아이디입니다:",
        CONFLICT_EMAIL: "중복된 이메일입니다:",

        NOT_FOUND_ID: "아이디를 찾을 수 없습니다:",
        NOT_FOUND_EMAIL: "이메일을 찾을 수 없습니다:",

        NOT_FOUND_USER: "사용자를 찾을 수 없습니다.",
    },
};