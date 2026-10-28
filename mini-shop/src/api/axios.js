import axios from "axios";
import notify from "devextreme/ui/notify";
import router from "../router";
import { ApiError, HTTP_STATUS_MESSAGES } from "./apiError";

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
    (response) => {
        const status = response.status;
        const url = response.config.url;
        const defaultMsg =
            HTTP_STATUS_MESSAGES[status] || "Thao tác thành công!";
        console.log(
            `%c[API SUCCESS ${status}] %c${url}`,
            "color: #0f9d58; font-weight: bold; background: #e6f4ea; padding: 2px 6px; border-radius: 4px;",
            "color: #1a73e8; font-weight: bold;",
            `\n👉 Thông báo: ${defaultMsg}`,
            `\n👉 Dữ liệu trả về:`,
            response.data,
        );
        return response;
    },

    async (error) => {
        const originalRequest = error.config;
        const status = error.response ? error.response.status : 0;
        const url = originalRequest?.url || "Unknown URL";
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

        const rawMessage = error.response?.data?.message || error.message || "";

        // Tận dụng ApiError để tự động chuyển câu sang tiếng Việt:
        const normalizedError =
            error instanceof ApiError
                ? error
                : new ApiError(status, rawMessage, error);

        console.error(
            `%c[API ERROR ${normalizedError.status}] %c${url}`,
            "color: #d93025; font-weight: bold; background: #fce8e6; padding: 2px 6px; border-radius: 4px;",
            "color: #d93025; font-weight: bold;",
            `\n🚨 Nguyên nhân: ${normalizedError.message}`,
            `\n🚨 Chi tiết lỗi:`,
            error.response?.data || error,
        );

        if (status !== 401) {
            notify(normalizedError.message, "error", 3000);
        }

        return Promise.reject(normalizedError);
    },
);

export default api;
