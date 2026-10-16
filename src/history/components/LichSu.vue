<template>
    <div v-if="record && record.changes" class="card shadow-sm border mb-4">
        <div class="card-header bg-light d-flex justify-content-between align-items-center py-2">
            <span class="fw-bold text-primary">{{ record.productName || 'Sản phẩm' }}</span>
            <small class="text-muted">Thời gian sửa: {{ record.time }}</small>
        </div>
        <div class="card-body p-2">
            <DxDataGrid :data-source="changeList" :show-borders="true" :column-auto-width="true"
                :row-alternation-enabled="true">
                <DxColumn data-field="field" caption="Trường thay đổi" alignment="center" width="180" />
                <DxColumn data-field="oldVal" caption="Dữ liệu trước khi sửa (Bản cũ)" cell-template="oldValTemplate" />
                <DxColumn data-field="newVal" caption="Dữ liệu sau khi sửa (Bản mới)" cell-template="newValTemplate" />

                <template #oldValTemplate="{ data }">
                    <span class="text-danger fw-semibold">{{ formatDisplay(data.data.field, data.value) }}</span>
                </template>

                <template #newValTemplate="{ data }">
                    <span class="text-success fw-bold">{{ formatDisplay(data.data.field, data.value) }}</span>
                </template>
            </DxDataGrid>
        </div>
    </div>
</template>

<script>
import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid'

export default {
    name: 'LichSu',
    components: {
        DxDataGrid,
        DxColumn
    },
    props: {
        record: {
            type: Object,
            required: true
        }
    },
    computed: {
        changeList() {
            if (!this.record || !this.record.changes) return []
            const fieldNames = {
                name: 'Tên sản phẩm',
                category: 'Danh mục',
                brand: 'Hãng',
                price: 'Giá (₫)',
                stock: 'Tồn kho',
                status: 'Trạng thái'
            }
            return Object.keys(this.record.changes).map(field => ({
                field: fieldNames[field] || field,
                oldVal: this.record.changes[field]?.oldVal,
                newVal: this.record.changes[field]?.newVal
            }))
        }
    },
    methods: {
        formatDisplay(field, val) {
            if (val === undefined || val === null) return '-'
            if (field === 'Trạng thái') {
                return val === 'active' ? 'Đang bán' : 'Ngừng bán'
            }
            if (field === 'Giá (₫)' && typeof val === 'number') {
                return new Intl.NumberFormat('vi-VN').format(val) + ' ₫'
            }
            return val
        }
    }
}
</script>