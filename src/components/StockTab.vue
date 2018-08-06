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
          <tr v-for="(code, index) in tabInfo.codes"
                       :key="code"
                       v-on:click="makeActive (index)">
            <stock-row :index="index"
                       :securities-columns="securitiesColumns"
                       :marketdata-columns="marketdataColumns"
                       :securities="getSecurities (code)"
                       :marketdata="getMarketdata (code)"
                       :is-row-current="isRowCurrent (index)">
            </stock-row>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import StockRow from './StockRow'

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
    getSecurities (code) {
      return this.securitiesJson.securities.data.find(item => item[0] === code)
    },
    getMarketdata (code) {
      return this.securitiesJson.marketdata.data.find(item => item[0] === code)
    },
    makeActive (index) {
      if (this.currentRowIndex !== index) {
        this.currentRowIndex = index
      } else {
        this.currentRowIndex = -1
      }
    },
    isRowCurrent (index) {
      return index === this.currentRowIndex
    }
  },
  computed: {
    securitiesColumns () {
      return this.securitiesJson.securities.columns
    },
    marketdataColumns () {
      return this.securitiesJson.marketdata.columns
    }
  },
  watch: {
    tabInfo: function () {
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
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: #C8102E;
    vertical-align: middle;
    white-space: nowrap;
    text-transform: uppercase;
    padding-top: 10px;
  }
  .tab-body {

  }
  .tab-table {
    border-collapse: collapse;
    border-spacing: 0;
    margin: 0;
    width: 100%;
  }
  .tab-table thead td {
    background-color: #ccc;
    font-weight: bold;
  }
  .tab-table tr {
    cursor: pointer;
  }
</style>
