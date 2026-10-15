<template>
    <!-- Product Filter -->
    <nav class="row g-2 align-items-center px-3 px-md-4 mb-4">
        <!-- Chia bố cục 3:1 trên desktop; xếp dọc trên màn hình nhỏ. -->
        <div class="col-12 col-lg-9">
            <form class="d-flex flex-column flex-sm-row gap-2" role="search" @submit.prevent="handleSearch">
                <DxSelectBox v-model:value="category" :items="categories" :show-clear-button="true"
                    placeholder="Danh mục" class="flex-grow-1" />
                <DxSelectBox v-model:value="brands" :items="brandsList" :show-clear-button="true" placeholder="Hãng"
                    class="flex-grow-1" />

                <DxSelectBox v-model:value="status" :items="statusList" display-expr="label" value-expr="value"
                    :show-clear-button="true" placeholder="Trạng thái" class="flex-grow-1" />

                <DxTextBox v-model:value="keyword" mode="search" :show-clear-button="true"
                    placeholder="Tìm kiếm sản phẩm" class="flex-grow-1" />

                <DxButton text="Tìm kiếm" type="default" styling-mode="contained" :use-submit-behavior="true"
                    class="flex-shrink-0" />
            </form>
        </div>
        <div class="col-12 col-lg-3 d-flex justify-content-lg-end">
            <DxButton text="Xóa bộ lọc" type="normal" styling-mode="outlined" @click="handleResets" />
        </div>
        <div class="col-12 d-flex flex-wrap gap-2">
            <button type="button" class="btn"
                :class="sortBy.startsWith('price-') ? 'btn-outline-primary' : 'btn-outline-secondary'"
                @click="$emit('sort-price')">
                Giá
                <span v-if="sortBy === 'price-desc'">↓ Cao đến thấp</span>
                <span v-else-if="sortBy === 'price-asc'">↑ Thấp đến cao</span>
                <span v-else>↕ Mặc định</span>
            </button>
            <button type="button" class="btn"
                :class="sortBy.startsWith('date-') ? 'btn-outline-primary' : 'btn-outline-secondary'"
                @click="$emit('sort-date')">
                Ngày tạo
                <span v-if="sortBy === 'date-desc'">↓ Mới nhất</span>
                <span v-else-if="sortBy === 'date-asc'">↑ Cũ nhất</span>
                <span v-else>↕ Mặc định</span>
            </button>
        </div>
    </nav>
</template>
<script>
import { DxSelectBox } from 'devextreme-vue/select-box'
import { DxTextBox } from 'devextreme-vue/text-box'
import { DxButton } from 'devextreme-vue/button'
export default {
    name: 'ProductFilter',
    components: {
        DxSelectBox,
        DxTextBox,
        DxButton
    },
    props: {
        categories: {
            type: Array,
            required: true
        },
        brandsList: {
            type: Array,
            required: true
        },
        statusList: {
            type: Array,
            required: true
        },
        sortBy: {
            type: String,
            default: ''
        }
    },
    emits: ['search', 'reset', 'sort-price', 'sort-date'],
    data() {
        return {
            category: '',
            brands: '',
            status: '',
            keyword: ''
        }
    },
    methods: {
        handleSearch() {
            this.$emit('search', {
                category: this.category,
                brands: this.brands,
                status: this.status,
                keyword: this.keyword
            })
        },
        handleReset() {
            this.category = '';
            this.brands = '';
            this.status = '';
            this.keyword = '';
            this.$emit('reset')
        }
    }
}
</script>