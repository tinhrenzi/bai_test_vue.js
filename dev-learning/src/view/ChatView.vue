<template>
    <DxCardView 
        @context-menu-preparing="addMenuItems">
    </DxCardView>
</template>
 
<script setup>
import 'devextreme/dist/css/dx.fluent.blue.light.css';
 
import DxCardView from 'devextreme-vue/card-view';
 
const addMenuItems = (e) => {
    if (e.target == 'headerPanel') {
        // e.items can be undefined
        if (!e.items) e.items = [];
 
        // Add a custom menu item
        e.items.push({
            text: 'Log Column Caption',
            onItemClick: () => {
                console.log(e.column.caption);
            }
        });
    } 
}
</script>
