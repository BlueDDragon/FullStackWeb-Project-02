type DataType = 
    { type: "User" } |
    { type: "Post" } |
    { type: "LikePost" };

function loadDataJSON<T>(key: String): T {
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem(`data_${key}`) || "{}");
    }

    return JSON.parse("{}");
}

function saveDataJSON<T>(key: string, value: T) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(`data_${key}`, JSON.stringify(value));
    }
}

function getKey(type: DataType): string {
    switch (type.type) {
        default:
            return `${type.type.toLowerCase()}`;
    }
}

export function loadData<T>(type: DataType) {
    return loadDataJSON<T>(getKey(type));
}

export function saveData<T>(type: DataType, value: T) {
    saveDataJSON(getKey(type), value);
}