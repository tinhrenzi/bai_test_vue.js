<template>
    <div v-if="record && record.changes">
        <!-- 1. BẢNG DỮ LIỆU CŨ -->
        <div class="mb-4">
            <h6 class="fw-bold text-danger"> 1. Dữ liệu trước khi sửa (Bản cũ) - {{ record.time }}</h6>
            <div class="table-responsive bg-white rounded shadow-sm border">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Tên sản phẩm</th>
                            <th>Danh mục</th>
                            <th>Hãng</th>
                            <th>Giá</th>
                            <th>Tồn kho</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ record.changes.name?.oldVal }}</td>
                            <td>{{ record.changes.category?.oldVal }}</td>
                            <td>{{ record.changes.brand?.oldVal }}</td>
                            <td>{{ record.changes.price?.oldVal }}</td>
                            <td>{{ record.changes.stock?.oldVal }}</td>
                            <td>{{ record.changes.status?.oldVal === 'active' ? 'Đang bán' : 'Ngừng bán' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 2. BẢNG DỮ LIỆU MỚI -->
        <div>
            <h6 class="fw-bold text-success"> 2. Dữ liệu sau khi sửa (Bản mới)</h6>
            <div class="table-responsive bg-white rounded shadow-sm border">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Tên sản phẩm</th>
                            <th>Danh mục</th>
                            <th>Hãng</th>
                            <th>Giá</th>
                            <th>Tồn kho</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ record.changes.name?.newVal }}</td>
                            <td>{{ record.changes.category?.newVal }}</td>
                            <td>{{ record.changes.brand?.newVal }}</td>
                            <td>{{ record.changes.price?.newVal }}</td>
                            <td>{{ record.changes.stock?.newVal }}</td>
                            <td>{{ record.changes.status?.newVal === 'active' ? 'Đang bán' : 'Ngừng bán' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['record'],
}
</script>

<style lang="scss" scoped></style>