<template>
    <section class="container py-4">
        <!-- Nút quay lại và tiêu đề -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="h4 mb-0">Lịch sử chỉnh sửa sản phẩm</h2>
            <button class="btn btn-outline-secondary" type="button" @click="$router.push({ name: 'products' })">
                ← Quay lại danh sách
            </button>
        </div>
        <!-- Tạm thời in ra xem đã lấy được lịch sử chưa -->
        <div v-if="productHistories.length">
            <LichSu :record="productHistories[0]" />
        </div>
        <div v-else class="alert alert-warning">
            Chưa có lịch sử chỉnh sửa nào cho sản phẩm này.
        </div>
    </section>
</template>
<script>
import { mapGetters } from 'vuex';
import LichSu from './components/LichSu.vue';

export default {
    name: 'FormLichSu',
    components: { LichSu },
    computed: {
        ...mapGetters('LichSu', ['histories']),

        productHistories() {
            const productId = this.$route.query.productId
            return this.histories.filter(h => String(h.productId) === String(productId))
        }
    }
}
</script>

<style lang="scss" scoped></style>