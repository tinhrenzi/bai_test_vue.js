<template>
    <div class="m3-card-grid">
        <div v-for="n in count" :key="n" class="m3-product-card skeleton-card">
            <div class="m3-card-img-wrap skeleton-box img-skeleton"></div>
            <div class="m3-card-body">
                <div>
                    <div class="skeleton-box badge-skeleton mb-2"></div>
                    <div class="skeleton-box title-skeleton mb-1"></div>
                    <div class="skeleton-box title-skeleton-short mb-3"></div>
                    <div class="d-flex justify-content-between mb-2">
                        <div class="skeleton-box price-skeleton"></div>
                        <div class="skeleton-box rating-skeleton"></div>
                    </div>
                    <div class="skeleton-box stock-skeleton"></div>
                </div>
                <div class="m3-card-actions pt-3">
                    <div class="skeleton-box btn-skeleton"></div>
                    <div class="skeleton-box btn-skeleton"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProductSkeleton",
    props: {
        count: {
            type: Number,
            default: 12,
        },
    },
};
</script>

<style scoped>
.skeleton-box {
    background: linear-gradient(
        90deg,
        var(--md-sys-color-surface-container, #f0f4f9) 25%,
        var(--md-sys-color-surface-container-high, #e2e8f0) 50%,
        var(--md-sys-color-surface-container, #f0f4f9) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 6px;
}

@keyframes skeleton-loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

.img-skeleton {
    width: 100%;
    height: 180px;
    border-radius: 0;
}

.badge-skeleton {
    width: 70px;
    height: 18px;
    border-radius: 999px;
}

.title-skeleton {
    width: 90%;
    height: 16px;
}

.title-skeleton-short {
    width: 60%;
    height: 16px;
}

.price-skeleton {
    width: 60px;
    height: 20px;
}

.rating-skeleton {
    width: 45px;
    height: 18px;
}

.stock-skeleton {
    width: 80px;
    height: 14px;
}

.btn-skeleton {
    flex: 1;
    height: 32px;
    border-radius: 999px;
}
</style>
