<template>
  <div id="app">
    <StockWidget :data="data"/>
  </div>
</template>

<script>
import data from './assets/data.json'

import StockWidget from './components/StockWidget'

export default {
  name: 'App',
  components: {
    StockWidget
  },
  data () {
    return {
      data
    }
  }
}
</script>

<style>
  #app {
    font-family: Arial, sans-serif;
    color: #2c3e50;
  }
</style>
