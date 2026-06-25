<template>
  <div class="tab">
    <div class="tab-title">
      {{ tabInfo.title }}
    </div>
    <div class="tab-body">
      <table class="tab-table">
        <thead>
        </thead>
        <tbody>
        <template v-for="(stock, index) in preparedStocks" :key="stock.code">
            <stock-row :index="index"
                       :securities-columns="securitiesColumns"
                       :marketdata-columns="marketdataColumns"
                       :securities="stock.securities"
                       :marketdata="stock.marketdata"
                       :is-row-current="isRowCurrent(index)"
                       @active="makeActive(index)">
            </stock-row>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import StockRow from './StockRow.vue'

export default {
  name: 'StockTab',
  components: {
    StockRow
  },
  props: {
    tabInfo: Object,
    securitiesJson: Object
  },
  data () {
    return {
      currentRowIndex: -1
    }
  },
  methods: {
    makeActive (index) {
      this.currentRowIndex = this.currentRowIndex === index ? -1 : index
    },
    isRowCurrent (index) {
      return index === this.currentRowIndex
    }
  },
  computed: {
    securitiesColumns () {
      return this.securitiesJson?.securities?.columns || []
    },
    marketdataColumns () {
      return this.securitiesJson?.marketdata?.columns || []
    },
    preparedStocks () {
      const codes = this.tabInfo?.codes
      const securitiesData = this.securitiesJson?.securities?.data
      const marketdataData = this.securitiesJson?.marketdata?.data

      if (!codes || !securitiesData || !marketdataData) return []

      const securitiesMap = new Map(securitiesData.map(item => [item[0], item]))
      const marketdataMap = new Map(marketdataData.map(item => [item[0], item]))

      return codes
        .map(code => ({
          code,
          securities: securitiesMap.get(code),
          marketdata: marketdataMap.get(code)
        }))
        .filter(item => item.securities && item.marketdata)
    },
  },
  watch: {
    tabInfo () {
      this.currentRowIndex = -1
    }
  }
}
</script>

<style scoped>
  .tab {
    border: 1px solid #ccc;
  }
  .tab-title {
    padding-top: 10px;
    color: #c8102e;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .tab-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    margin: 0;
  }
  .tab-table thead th,
  .tab-table thead td {
    background-color: #ccc;
    font-weight: bold;
  }
  .tab-table :deep(tr) {
    cursor: pointer;
  }
</style>
