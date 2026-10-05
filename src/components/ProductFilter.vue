<template>
    <nav class="row g-2 align-items-center px-3 px-md-4 mb-4">
        <!-- Chia bố cục 3:1 trên desktop; xếp dọc trên màn hình nhỏ. -->
        <div class="col-12 col-lg-9">
            <form class="d-flex flex-column flex-sm-row gap-2" role="search" @submit.prevent="handleSearch">
                <select v-model="category" class="form-select" aria-label="Lọc theo danh mục">
                    <option value="">Danh mục</option>
                    <option v-for="item in categories" :key="item" :value="item">
                        {{ item }}
                    </option>
                </select>
                <select v-model="brands" class="form-select" aria-label="Lọc theo hãng">
                    <option value="">Hãng</option>
                    <option v-for="item in brandsList" :key="item" :value="item">
                        {{ item }}
                    </option>
                </select>
                <select v-model="status" class="form-select" aria-label="Lọc theo trạng thái">
                    <option value="">Trạng thái</option>
                    <option v-for="item in statusList" :key="item.value" :value="item.value">
                        {{ item.label }}
                    </option>
                </select>
                <input v-model="keyword" class="form-control" type="search" placeholder="Tìm kiếm sản phẩm"
                    aria-label="Tìm kiếm sản phẩm" />
                <button class="btn btn-primary flex-shrink-0" type="submit">Tìm kiếm</button>
            </form>
        </div>
        <div class="col-12 col-lg-3 d-flex justify-content-lg-end">
            <button type="button" @click="handleReset" class="btn btn-secondary">Làm mới</button>
        </div>
    </nav>
</template>
<script>
export default {
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
        }
    },
    emits: ['search', 'reset'],
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