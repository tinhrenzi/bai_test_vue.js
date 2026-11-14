<template>
    <div></div>
</template>

<script setup>
import {
    removeDuplicates,
    enrichOrders,
    revenueByMonth,
} from "../ultils/orders.js";

import { orders, customers, products } from "../data/data.js";

const result = enrichOrders(orders, customers, products);

const results = revenueByMonth(result.orders);

console.log("Dữ liệu ban đầu:", orders);
console.log("Dữ liệu sau xử lý:", result);
console.log("Doanh thu theo tháng:", results);
console.log("Cảnh báo:", result.warnings);

console.log("Mảng có bị thay đổi không:", orders === result.orders);
</script>

<style scoped></style>
