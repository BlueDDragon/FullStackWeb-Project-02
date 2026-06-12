export const POST_MESSAGES = {
    SUCCESS: {
    },

    ERROR: {
        UNAUTHORIZED: "권한이 없습니다.",
        SERVER: "서버 오류가 발생했습니다.",
    },
};

export const USER_MESSAGES = {
    SUCCESS: {
        REGISTER: "회원가입에 성공했습니다.",
        LOGIN: "로그인에 성공했습니다.",
        LOGOUT: "로그아웃되었습니다.",
    },

    ERROR: {
        REGISTER: "아이디 또는 비밀번호가 올바르지 않습니다.",
        LOGIN: "아이디 또는 비밀번호가 올바르지 않습니다.",
    },
};

export const POST_MESSAGES = {
    SUCCESS: {
        CREATE_POST: "게시글이 등록되었습니다.",
        UPDATE_POST: "게시글이 수정되었습니다.",
        DELETE_POST: "게시글이 삭제되었습니다.",
    },

    ERROR: {
        NOT_FOUND_POST: "게시글을 찾을 수 없습니다.",
    },
};
