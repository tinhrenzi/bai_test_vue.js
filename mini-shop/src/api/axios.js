import axios from 'axios';
import notify from 'devextreme/ui/notify';
import { ApiError } from './apiError';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com',
    timeout: 8000,
})

let lamMoiToken = false
let choTokenMoi = []

function dangKyTokenMoi(callback) {
    choTokenMoi.push(callback);
}

function thongBaoTokenMoi(tokenMoi) {
    choTokenMoi.forEach((callback) => callback(tokenMoi));
    choTokenMoi = []
}

api.interceptors.request.use(
    (cauHinh) => {
        const token = localStorage.getItem('token');
        if (token && !cauHinh.headers.Authorization) {
            cauHinh.headers.Authorization = `Bearer ${token}`;
        }
        return cauHinh;
    },
    (loi) => Promise.reject(loi)
);

api.interceptors.response.use(
    (phanHoi) => {
        return phanHoi;
    },
    async (loi) => {
        const yeuCauGoc = loi.config;

        if (
            yeuCauGoc &&
            yeuCauGoc.method?.toLowerCase() === 'get' &&
            (!loi.response || loi.response.status >= 500)
        ) {
            yeuCauGoc._soLanThuLai = yeuCauGoc._soLanThuLai || 0;
            if (yeuCauGoc._soLanThuLai < 2) {
                yeuCauGoc._soLanThuLai += 1;
                console.warn(`[Tự thử lại] Lần ${yeuCauGoc._soLanThuLai} cho URL: ${yeuCauGoc.url}`);
                return api(yeuCauGoc);
            }
        }

        if (loi.response && loi.response.status === 401 && yeuCauGoc && !yeuCauGoc._daThuLamMoi) {
            yeuCauGoc._daThuLamMoi = true;

            if (lamMoiToken) {
                return new Promise((resolve) => {
                    dangKyTokenMoi((tokenMoi) => {
                        yeuCauGoc.headers.Authorization = `Bearer ${tokenMoi}`;
                        resolve(api(yeuCauGoc))
                    })
                })
            }


            lamMoiToken = true;
            try {
                const tokenLamMoi = localStorage.getItem('refreshToken');
                if (!tokenLamMoi) {
                    throw new Error('Không tìm thấy refresh token trong bộ nhớ')
                }

                const ketQua = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com'}/auth/refresh`,
                    {
                        refreshToken: tokenLamMoi,
                        expiresInMins: 30
                    }
                );

                const tokenMoi = ketQua.data.token || ketQua.data.accessToken;
                const refreshTokenMoi = ketQua.data.refreshToken;

                localStorage.setItem('token', tokenMoi);
                if (refreshTokenMoi) {
                    localStorage.setItem('refreshToken', refreshTokenMoi);
                }

                thongBaoTokenMoi(tokenMoi);
                yeuCauGoc.headers.Authorization = `Bearer ${tokenMoi}`;
                return api(yeuCauGoc);
            } catch (error) {
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('user')

                notify('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'error', 3000);
                window.location.href = '/login';
                return Promise.reject(new ApiError(401, 'Phiên đăng nhập đã hết hạn', error));
            } finally {
                lamMoiToken = false;
            }
        }
        const maLoi = loi.response ? loi.response.status : 0;
        const thongBaoLoi =
            loi.response?.data?.message ||
            loi.message ||
            'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
        const loiChuanHoa = new ApiError(maLoi, thongBaoLoi, loi);
        if (maLoi !== 401) {
            notify(loiChuanHoa.message, 'error', 3000);
        }
        return Promise.reject(loiChuanHoa);
    }

)


export default api
