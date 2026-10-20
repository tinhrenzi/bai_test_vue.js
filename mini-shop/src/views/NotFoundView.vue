<template>
    <div class="m3-page-container d-flex flex-column align-items-center justify-content-center text-center py-5" style="min-height: 70vh;">
        <h1 class="display-1 fw-bold text-primary mb-2">404</h1>
        <h3 class="fw-semibold text-dark mb-3">Trang không tồn tại</h3>
        <p class="text-muted mb-4" style="max-width: 450px;">
            Đường dẫn bạn yêu cầu không tìm thấy hoặc đã bị di chuyển. Vui lòng kiểm tra lại URL.
        </p>
        <router-link to="/" class="btn btn-primary m3-btn-pill px-4 py-2">
            <i class="dx-icon-home me-1"></i> Trở về trang chủ
        </router-link>
    </div>
</template>

<script>
export default {
    name: "NotFoundView"
};
</script>

<style scoped>
</style>
