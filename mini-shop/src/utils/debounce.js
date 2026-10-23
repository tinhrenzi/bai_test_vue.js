export function debounce(func, wait = 300) {
    let timeoutId = null;

    function debounced(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
            timeoutId = null;
        }, wait);
    }

    debounced.cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    return debounced;
}
