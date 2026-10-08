<script>
export default {
    name: 'ProductCard',
    props: {
        product: {
            type: Object,
            required: true
        }
    },
    emits: ['edit', 'delete'],
    methods: {
        // Hiển thị giá theo nhóm hàng nghìn, không thêm ký hiệu tiền tệ.
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN').format(price);
        }
    }
}
</script>

<template>
    <div class="card shadow-sm border mb-3">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h6 class="card-title fw-bold mb-0">{{ product.name }}</h6>
                <span
                    :class="product.status === 'active' ? 'badge bg-success-subtle text-success' : 'badge bg-secondary-subtle text-secondary'">
                    {{ product.status === 'active' ? 'Đang bán' : 'Ngừng bán' }}
                </span>
            </div>

            <!-- Hiển thị danh mục và hãng thành hai thông tin riêng. -->
            <p class="text-muted small mb-1">Danh mục: {{ product.category }}</p>
            <p class="text-muted small mb-2">Hãng: {{ product.brand }}</p>

            <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="fs-5 fw-bold text-primary">{{ formatPrice(product.price) }}</span>
                <div>
                    <span v-if="product.stock === 0" class="badge bg-danger">Hết hàng</span>
                    <span v-else class="small text-secondary">Kho: <strong>{{ product.stock }}</strong></span>
                </div>
            </div>

            <div class="d-flex gap-2">
                <!-- Chuyển thao tác trên sản phẩm lên component cha xử lý. -->
                <button class="btn btn-warning" type="button" @click="$emit('edit', product)">Sửa</button>
                <button class="btn btn-danger" type="button" @click="$emit('delete', product.id)">Xóa</button>
            </div>
        </div>
    </div>
</template>