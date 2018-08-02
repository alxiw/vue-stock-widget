<template>
  <div class="widget">
    <section v-if="axiosErrored">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>
    <section v-else>
      <div class="widget-title">
        {{ data.title }}
      </div>
      <div v-if="axiosLoading"
           class="widget-loading">
      </div>
      <div v-else
           class="widget-body">
        <button class="widget-button-tab"
            v-for="(tab, index) in data.tabs"
            :key="index"
            v-bind:class="['widget-button-tab', { current: currentTabIndex === index }]"
            v-on:click="click(index)">
          <span>{{ tab.title }}</span>
        </button>
        <stock-tab :tab-info="data.tabs[currentTabIndex]" :securities-json="securitiesJson"/>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

import StockTab from '../components/StockTab'

export default {
  name: 'StockWidget',
  components: {
    StockTab
  },
  props: {
    data: Object
  },
  data () {
    return {
      securitiesList: [],
      securitiesJson: [],
      axiosLoading: true,
      axiosErrored: false,
      currentTabIndex: 0
    }
  },
  mounted () {
    let link = 'http://iss.moex.com/iss/engines/stock/markets/index/securities.json?securities='
    for (let i = 0; i < this.data.tabs.length; i++) {
      for (let j = 0; j < this.data.tabs[i].codes.length; j++) {
        this.securitiesList.push(this.data.tabs[i].codes[j])
      }
    }
    axios
      .get(link + this.securitiesList.join(','))
      .then(response => (this.securitiesJson = response.data))
      .catch(error => {
        console.log(error)
        this.axiosErrored = true
      })
      .finally(() => (this.axiosLoading = false))
  },
  methods: {
    click (index) {
      this.currentTabIndex = index
    }
  }
}
</script>

<style scoped>
  .widget {
    padding-top: 5px;
    padding-bottom: 10px;
  }
  .widget-title {
    font-size: 20px;
    font-weight: 700;
    color: #C8102E;
    vertical-align: middle;
    white-space: nowrap;
    text-transform: uppercase;
  }
  .widget-loading {
    background: #eee url("https://assets.moex.com/widgets/assets/facebook-ajax-loader.gif") no-repeat center center;
    padding: 25px 0;
  }
  .widget-body {

  }
  .widget-button-tab {
    border: 1px solid #ccc;
    cursor: pointer;
    background: #f0f0f0;
    border-radius: 6px;
    padding: 3px 7px;
    margin-top: 5px;
    margin-bottom: 7px;
    margin-right: 5px;
    font-size: 14px;
    text-transform: uppercase;
  }
  .widget-button-tab:hover {
    background: #e0e0e0;
  }
  .widget-button-tab.current {
    background: #c8c8c8;
  }
</style>
