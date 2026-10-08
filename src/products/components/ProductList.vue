<script setup>
import products from '../data/products.json'
import ProductCard from './ProductCard.vue'


</script>

<template>
    <section aria-labelledby="products-heading">
        <div class="d-flex flex-column flex-sm-row align-items-sm-end justify-content-between gap-1 mb-3">
            <h1 id="products-heading" class="h3 mb-0">Danh sách sản phẩm</h1>
            <p class="text-body-secondary mb-0">{{ products.length }} sản phẩm</p>
        </div>

        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3 g-lg-4">
            <div v-for="product in products" :key="product.id" class="col">
                <ProductCard :product="product" />
            </div>
        </div>
    </section>
</template>