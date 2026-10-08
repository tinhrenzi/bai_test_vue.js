<script>
export default {
    name: 'ProductTable',
    props: {
        products: {
            type: Array,
            required: true
        }
    },
    emits: ['edit', 'delete'],
    methods: {
        // Hiển thị giá theo nhóm hàng nghìn, không thêm ký hiệu tiền tệ.
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN').format(price)
        }
    }
}
</script>
<template>
    <div class="table-responsive bg-white rounded shadow-sm border">
        <table class="table table-hover align-middle mb-0">
            <!-- Goi bang -->
            <thead class="table-light">
                <tr>
                    <th>Tên sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Hãng</th>
                    <th>Giá</th>
                    <th>Tồn kho</th>
                    <th>Trạng thái</th>
                    <th class="text-end">Hành động</th>
                </tr>
            </thead>
            <tbody>
                <!-- Hiển thị danh sách: lặp qua products và tạo một hàng cho mỗi sản phẩm -->
                <tr v-for="product in products" :key="product.id">
                    <td class="fw-semibold">{{ product.name }}</td>
                    <td>{{ product.category }}</td>
                    <td>{{ product.brand }}</td>
                    <td class="text-primary fw-bold">{{ formatPrice(product.price) }}</td>
                    <td>
                        <span v-if="product.stock === 0" class="badge bg-danger">Hết hàng</span>
                        <span v-else>{{ product.stock }}</span>
                    </td>
                    <td>
                        <span
                            :class="product.status === 'active' ? 'badge bg-success-subtle text-success' : 'badge bg-secondary-subtle text-secondary'">
                            {{ product.status === 'active' ? 'Đang bán' : 'Ngừng bán' }}
                        </span>
                    </td>
                    <td class="text-end text-nowrap">
                        <!-- Chuyển thao tác trên sản phẩm lên component cha xử lý. -->
                        <button class="btn btn-warning me-2" type="button" @click="$emit('edit', product)">
                            Sửa
                        </button>
                        <button class="btn btn-danger" type="button" @click="$emit('delete', product.id)">
                            Xóa
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>