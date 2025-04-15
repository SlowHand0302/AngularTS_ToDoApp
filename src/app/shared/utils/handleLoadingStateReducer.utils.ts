export function addLoadingState<T extends { loading: Set<string> }>(state: T, key: string): T {
    return { ...state, loading: new Set([...state.loading, key]) };
}

export function removeLoadingState<T extends { loading: Set<string> }>(state: T, key: string): T {
    return { ...state, loading: new Set([...state.loading].filter((item) => item !== key)) };
}
