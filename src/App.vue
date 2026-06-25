<template>
  <div id="app">
    <StockWidget :data="data"/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import data from './assets/data.json'
import StockWidget from './components/StockWidget.vue'

const widgetData = ref(data)
</script>

<style>
  #app {
    font-family: Arial, sans-serif;
    color: #2c3e50;
  }
</style>
