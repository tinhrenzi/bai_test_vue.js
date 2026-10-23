import axios from "axios";
import notify from "devextreme/ui/notify";
import { ApiError } from "./apiError";
import router from "../router";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://dummyjson.com";

const api = axios.create({
    baseURL,
    timeout: 8000,
});

let refreshPromise = null;

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            originalRequest &&
            originalRequest.method?.toLowerCase() === "get" &&
            (!error.response || error.response.status >= 500)
        ) {
            originalRequest._retryCount = originalRequest._retryCount || 0;
            if (originalRequest._retryCount < 2) {
                originalRequest._retryCount += 1;
                console.warn(
                    `[API Auto-Retry] Lần ${originalRequest._retryCount}/2 cho URL: ${originalRequest.url}`,
                );
                return api(originalRequest);
            }
        }

        if (
            error.response &&
            error.response.status === 401 &&
            originalRequest &&
            !originalRequest._isRetryAfterRefresh
        ) {
            originalRequest._isRetryAfterRefresh = true;

            if (!refreshPromise) {
                refreshPromise = (async () => {
                    try {
                        const refreshToken =
                            localStorage.getItem("refreshToken");
                        if (!refreshToken) {
                            throw new Error(
                                "Không tìm thấy refreshToken trong bộ nhớ.",
                            );
                        }

                        const refreshResponse = await axios.post(
                            `${baseURL}/auth/refresh`,
                            {
                                refreshToken,
                                expiresInMins: 30,
                            },
                        );

                        const tokenMoi =
                            refreshResponse.data.token ||
                            refreshResponse.data.accessToken;
                        const refreshTokenMoi =
                            refreshResponse.data.refreshToken;

                        localStorage.setItem("token", tokenMoi);
                        if (refreshTokenMoi) {
                            localStorage.setItem(
                                "refreshToken",
                                refreshTokenMoi,
                            );
                        }

                        return tokenMoi;
                    } catch (refreshErr) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("refreshToken");
                        localStorage.removeItem("user");

                        notify(
                            "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
                            "error",
                            3000,
                        );

                        const currentRoute = router.currentRoute?.value;
                        const currentPath =
                            currentRoute?.fullPath ||
                            window.location.pathname + window.location.search;
                        if (!currentRoute || currentRoute.path !== "/login") {
                            router.push({
                                path: "/login",
                                query: { redirect: currentPath },
                            });
                        }

                        throw new ApiError(
                            401,
                            "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
                            refreshErr,
                        );
                    } finally {
                        refreshPromise = null;
                    }
                })();
            }

            try {
                const tokenMoi = await refreshPromise;
                originalRequest.headers.Authorization = `Bearer ${tokenMoi}`;
                return api(originalRequest);
            } catch (pErr) {
                return Promise.reject(
                    pErr instanceof ApiError
                        ? pErr
                        : new ApiError(
                              401,
                              "Phiên đăng nhập đã hết hạn.",
                              pErr,
                          ),
                );
            }
        }

        const status = error.response
            ? error.response.status
            : error.status || 0;
        const message =
            error.response?.data?.message ||
            error.message ||
            "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng!";

        const normalizedError =
            error instanceof ApiError
                ? error
                : new ApiError(status, message, error);

        if (status !== 401) {
            notify(normalizedError.message, "error", 3000);
        }

        return Promise.reject(normalizedError);
    },
);

export default api;
