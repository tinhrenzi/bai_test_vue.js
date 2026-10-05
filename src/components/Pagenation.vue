<template>
    <nav aria-label="Điều hướng trang" class="d-flex justify-content-center mt-4">
        <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button
                    type="button"
                    class="page-link"
                    :disabled="currentPage === 1"
                    @click="changePage(currentPage - 1)"
                >
                    Trước
                </button>
            </li>
            <!-- Tạo nút trang theo totalPages do component cha truyền xuống. -->
            <li
                v-for="page in totalPages"
                :key="page"
                class="page-item"
                :class="{ active: page === currentPage }"
            >
                <button
                    type="button"
                    class="page-link"
                    :aria-current="page === currentPage ? 'page' : null"
                    @click="changePage(page)"
                >
                    {{ page }}
                </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button
                    type="button"
                    class="page-link"
                    :disabled="currentPage === totalPages"
                    @click="changePage(currentPage + 1)"
                >
                    Sau
                </button>
            </li>
        </ul>
    </nav>
</template>
<script>
export default {
    name: 'Pagenation',
    props: {
        currentPage: {
            type: Number,
            default: 1
        },
        totalPages: {
            type: Number,
            default: 1
        }
    },
    emits: ['page-changed'],
    methods: {
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.$emit('page-changed', page);
            }
        }
    }
}
</script>