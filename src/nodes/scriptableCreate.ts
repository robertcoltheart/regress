export interface ScriptableCreate<T> {
    createScript: (node: T) => string;
}

