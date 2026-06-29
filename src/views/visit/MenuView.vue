<template>
<PageLayout>
<section class="section-space">
<div class="page-container">
<h1 class="display-heading">Our Menu</h1>
<p>Explore our delicious selection of drinks and treats, all inspired by our feline friends.</p>
<table class="table">
<thead>
<tr>
<th class="bg-light">Hot Drinks</th>
<th class="bg-light">Cold Drinks</th>
<th class="bg-light">Treats</th>
</tr>
</thead>
<tbody>
<tr v-for="(item, index) in maxItems" :key="index">
<td 
v-if="hotDrinks[index]" 
class="bubble-column menu-cell"
@mouseenter="hoveredItem = `hot-${index}`"
@mouseleave="hoveredItem = null"
>
<span v-if="hoveredItem === `hot-${index}`" class="item-description">{{ hotDrinks[index].desc }}</span>
<span class="item-display">
{{ hotDrinks[index].name }} - {{ hotDrinks[index].price }}
</span>
</td>
<td v-else class="bubble-column"></td>
<td 
v-if="coldDrinks[index]" 
class="bubble-column menu-cell"
@mouseenter="hoveredItem = `cold-${index}`"
@mouseleave="hoveredItem = null"
>
<span v-if="hoveredItem === `cold-${index}`" class="item-description">{{ coldDrinks[index].desc }}</span>
<span class="item-display">
{{ coldDrinks[index].name }} - {{ coldDrinks[index].price }}
</span>
</td>
<td v-else class="bubble-column"></td>
<td 
v-if="treats[index]" 
class="bubble-column menu-cell"
@mouseenter="hoveredItem = `treats-${index}`"
@mouseleave="hoveredItem = null"
>
<span v-if="hoveredItem === `treats-${index}`" class="item-description">{{ treats[index].desc }}</span>
<span class="item-display">
{{ treats[index].name }} - {{ treats[index].price }}
</span>
</td>
<td v-else class="bubble-column"></td>
</tr>
</tbody>
</table>
</div>
</section>
</PageLayout>
</template>

<script setup>
import { ref } from 'vue';
import PageLayout from '../../components/layout/PageLayout.vue';
import menuData from '../../views/visit/menu.json';

const hotDrinks = ref(menuData.menuCategories[0].items);
const coldDrinks = ref(menuData.menuCategories[1].items);
const treats = ref(menuData.menuCategories[2].items);
const hoveredItem = ref(null);

const maxItems = Math.max(hotDrinks.value.length, coldDrinks.value.length, treats.value.length);
</script>

<style scoped>
.table {
 width: 100%;
 border-collapse: collapse;
 margin: 2rem 0;
}

.table th, .table td {
 border: 1px solid #ddd;
 padding: 8px;
 text-align: left;
}

.bubble-column {
 background-color: rgba(212, 184, 184, 0.9);
  border-radius: 8px;
  border-radius: 10px;
 border-color:black;
}

.menu-cell {
 cursor: pointer;
 transition: background-color 0.2s ease;
}

.menu-cell:hover {
 background-color: rgba(255, 245, 230, 1);
}

.item-display,
.item-description {
 display: block;
}

.item-description {
 font-style: italic;
 color: var(--color-accent);
 font-size: 0.9rem;
 line-height: 1.4;
 margin-bottom: 0.25rem;
}

.item-display {
 font-weight: 500;
}

.table th {
 background-color: #f2f2f2;
}

.owner-info {
 font-size: 0.8rem;
 color: var(--color-border);
 margin-top: 2rem;
}
</style>