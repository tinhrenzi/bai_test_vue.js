<template>
    <nav class="navbar navbar-expand-lg px-3 px-md-4 mb-4">
        <div class="collapse navbar-collapse" id="productNavbar">
            <form class="d-flex flex-column flex-sm-row gap-2 mt-3 mt-lg-0" role="search"
                @submit.prevent="handleSearch">
                <select v-model="category" class="form-select" aria-label="Lọc theo danh mục">
                    <option value="">Tất cả danh mục</option>
                    <option v-for="item in categories" :key="item" :value="item">
                        {{ item }}
                    </option>
                </select>
                <input
                    v-model="keyword"
                    class="form-control"
                    type="search"
                    placeholder="Tìm kiếm sản phẩm"
                    aria-label="Tìm kiếm sản phẩm"
                />
                <button class="btn btn-primary flex-shrink-0" type="submit">Tìm kiếm</button>
            </form>
        </div>
        <button type="button" @click="handleReset" class="btn btn-secondary">Làm mới</button>
    </nav>
</template>
<script>
export default {
    props: {
        categories: {
            type: Array,
            required: true
        }
    },
    emits: ['search', 'reset'],
    data() {
        return {
            category: '',
            keyword: ''
        }
    },
    methods: {
        handleSearch() {
            this.$emit('search', {
                category: this.category,
                keyword: this.keyword
            })
        },
        handleReset() {
            this.category = '';
            this.keyword = '';
            this.$emit('reset')
        }
    }
}
</script>