<script>
import {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxPager,
    DxSorting
} from 'devextreme-vue/data-grid'
export default {

    name: 'ProductTable',
    components: {
        DxDataGrid,
        DxColumn,
        DxPaging,
        DxPager,
        DxSorting
    },
    props: {
        products: {
            type: Array,
            required: true
        }
    },
    emits: ['edit', 'delete', 'history'],
    methods: {
        // Hiển thị giá theo nhóm hàng nghìn, không thêm ký hiệu tiền tệ.
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN').format(price)
        }
    }
}
</script>
<template>
    <!-- Product Table -->
    <div class="table-responsive bg-white rounded shadow-sm border">
        <DxDataGrid :data-source="products" :show-borders="true" :row-alternation-enabled="true"
            :hover-state-enabled="true" key-expr="id">

            <DxPaging page-size="10" />

            <DxPager :show-page-size-selector="true" :allowed-page-sizes="[5, 10, 20]" :show-info="true"
                :show-navigation-buttons="true" />

            <DxSorting mode="single" />

            <DxColumn data-field="name" caption="Tên sản phẩm" />

            <DxColumn data-field="category" caption="Danh mục" />

            <DxColumn data-field="brand" caption="Hãng" />

            <DxColumn data-field="price" caption="Giá" data-type="number" cell-template="priceTemplate" />

            <DxColumn data-field="stock" caption="Tồn kho" data-type="number" cell-template="stockTemplate" />

            <DxColumn data-field="status" caption="Trạng thái" cell-template="statusTemplate" />

            <DxColumn caption="Hành động" :allow-sorting="false" alignment="center" cell-template="actionTemplate" />

            <DxColumn caption="Lịch sử" :allow-sorting="false" alignment="center" cell-template="historyTemplate" />

            <template #priceTemplate="{ data }">
                <span class="text-primary fw-bold">
                    {{ formatPrice(data.value) }}
                </span>
            </template>

            <template #stockTemplate="{ data }">
                <span v-if="data.value === 0" class="badge bg-danger">Hết hàng</span>
                <span v-else>{{ data.value }}</span>
            </template>

            <template #statusTemplate="{ data }">
                <span
                    :class="data.value === 'active' ? 'badge bg-success-subtle text-success' : 'badge bg-secondary-subtle text-secondary'">
                    {{ data.value === 'active' ? 'Đang bán' : 'Ngừng bán' }}
                </span>
            </template>

            <template #actionTemplate="{ data }">
                <button type="button" class="btn btn-sm btn-warning me-2" @click="$emit('edit', data.data)">Sửa</button>
                <button type="button" class="btn btn-sm btn-warning me-2"
                    @click="$emit('delete', data.data.id)">Xóa</button>
            </template>

            <template #historyTemplate="{ data }">
                <button type="button" class="btn btn-sm btn-warning me-2" @click="$emit('history', data.data.id)">Lịch
                    sử</button>
            </template>

        </DxDataGrid>
    </div>
</template>