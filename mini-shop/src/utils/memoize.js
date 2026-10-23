export function memoize(func, resolver) {
    const cache = new Map();

    function memoized(...args) {
        const key = resolver
            ? resolver.apply(this, args)
            : JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = func.apply(this, args);
        cache.set(key, result);
        return result;
    }

    memoized.cache = cache;
    memoized.clear = () => cache.clear();

    return memoized;
}
