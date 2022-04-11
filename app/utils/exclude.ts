export function exclude<T, K extends keyof T>(
    type: T,
    ...keys: K[]
): Omit<T, K> {
    for (let key of keys) {
        delete type[key];
    }

    return type;
}
