<template>
  <div id="app">
    <StockWidget :data="data"/>
    <StockWidget :data="next"/>
  </div>
</template>

<script>
import data from './assets/data.json'
import next from './assets/next.json'

import StockWidget from './components/StockWidget'

export default {
  name: 'App',
  components: {
    StockWidget
  },
  data () {
    return {
      data,
      next
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
