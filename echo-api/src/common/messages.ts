export const COMMON_MESSAGES = {
    SUCCESS: {
        SUCCESS: "요청에 성공했습니다.",
        UPLOAD: "파일을 성공적으로 업로드했습니다.",
    },

    ERROR: {
        SERVER: "서버 오류가 발생했습니다.",
        UNAUTHORIZED: "권한이 없습니다.",
        NOT_FOUND: "요청한 내용을 찾을 수 없습니다.",
        CONFLICT: "중복된 요청입니다.",
        BAD_REQUEST: "요청 내용이 잘못되었습니다.",
    },
};

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
        
        LOGIN_VALID_USERNAME: "아이디가 올바르지 않습니다.",
        LOGIN_VALID_PW: "비밀번호가 올바르지 않습니다.",

        CONFLICT_USERNAME: "중복된 아이디입니다:",
        CONFLICT_EMAIL: "중복된 이메일입니다:",

        NOT_FOUND_USERNAME: "아이디를 찾을 수 없습니다:",
        NOT_FOUND_EMAIL: "이메일을 찾을 수 없습니다:",

        NOT_FOUND_USER: "사용자를 찾을 수 없습니다.",
    },
};

export const POST_MESSAGES = {
    SUCCESS: {
        FIND_POSTS: "게시글 목록을 조회합니다.",
        FIND_POST: "게시글을 조회합니다.",
        CREATE_POST: "게시글이 등록되었습니다.",
        UPDATE_POST: "게시글이 수정되었습니다.",
        DELETE_POST: "게시글이 삭제되었습니다.",
    },

    ERROR: {
        NOT_FOUND_POST: "게시글을 찾을 수 없습니다.",
    },
};