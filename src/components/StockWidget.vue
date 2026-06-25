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
            :key="tab.title"
            :class="{ current: currentTabIndex === index }"
            @click="selectTab(index)">
          {{ tab.title }}
        </button>
        <stock-tab :tab-info="data.tabs[currentTabIndex]"
                   :securities-json="securitiesJson">
        </stock-tab>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

import StockTab from './StockTab.vue'

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
      securitiesJson: {},
      axiosLoading: true,
      axiosErrored: false,
      currentTabIndex: 0
    }
  },
  created () {
    this.fetchSecuritiesJson()
  },
  methods: {
    fetchSecuritiesJson () {
      const uniqueCodes = [
        ...new Set(this.data.tabs.flatMap(tab => tab.codes || []))
      ]
      if (uniqueCodes.length === 0) {
        this.axiosLoading = false
        return
      }
      const link = `/iss/engines/stock/markets/index/securities.json?securities=${uniqueCodes.join(',')}`
      axios
        .get(link)
        .then(response => (this.securitiesJson = response.data))
        .catch(error => {
          console.log(error)
          this.axiosErrored = true
        })
        .finally(() => (this.axiosLoading = false))
    },
    selectTab (index) {
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
    color: #c8102e;
    font-size: 20px;
    font-weight: 700;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .widget-loading {
    padding: 25px 0;
    background: #eee url("https://assets.moex.com/widgets/assets/facebook-ajax-loader.gif") no-repeat center center;
  }
  .widget-body {
    width: 100%
  }
  .widget-button-tab {
    margin-top: 5px;
    margin-bottom: 7px;
    margin-right: 5px;
    padding: 3px 7px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: #f0f0f0;
    color: #333;
    font-size: 14px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .widget-button-tab:hover {
    background: #e0e0e0;
  }
  .widget-button-tab.current {
    background: #c8c8c8;
  }
</style>
