<template>
  <div class="tab">
    <div class="tab-title">
      {{ tabInfo.title }}
    </div>
    <div class="tab-body">
      <table class="tab-table"
             v-for="(code, index) in tabInfo.codes"
             :key="code">
      <thead>
      </thead>
      <tbody>
        <tr class="data"
            :class="rowColor (index)"
            v-on:click="makeActive (index)">
          <td class="name"
              title="Stock Index Name"
              align="top" width="40%">
            <a v-bind:href="getLink(code)" target="_blank" onclick="return false">
              <span>{{ getSecurities(code)[getSecuritiesColumnIndex('SHORTNAME')] }}</span>
            </a>
          </td>
          <td class="date"
              title="Date"
              align="top" width="20%">
            <span>{{ getMarketdata(code)[getMarketdataColumnIndex('TRADEDATE')] | formatDate }}</span>
          </td>
          <td class="time"
              title="Time"
              align="top" width="15%">
            <span>{{ getMarketdata(code)[getMarketdataColumnIndex('UPDATETIME')] | formatTime }}</span>
          </td>
          <td class="number"
              title="Current Value"
              align="top" width="15%">
            <span>{{ getMarketdata(code)[getMarketdataColumnIndex('CURRENTVALUE')] | currencyDecimal }}</span>
          </td>
          <td class="percent"
              :class="percentColor(getMarketdata(code)[getMarketdataColumnIndex('LASTCHANGETOOPENPRC')])"
              title="Change in Current Value to Previous Trading Day Value, %"
              align="top" width="10%">
            <span>{{ getMarketdata(code)[getMarketdataColumnIndex('LASTCHANGETOOPENPRC')] | currencyDecimal }}%</span>
          </td>
        </tr>
        <tr class="chart"
            v-show="index === currentRowIndex">
          <td colspan="5"
              v-bind:title="getSecurities(code)[getSecuritiesColumnIndex('NAME')]">
            <div class="wrapper">
              <img v-bind:src="getChart(code)">
            </div>
          </td>
        </tr>
      </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'StockWidget',
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
    getSecuritiesColumnIndex (column) {
      let data = this.securitiesJson.securities.columns
      let index = 0
      for (let i = 0; i < data.length; i++) {
        if (data[i] === column) {
          index = i
        }
      }
      return index
    },
    getSecurities (code) {
      let data = this.securitiesJson.securities.data
      let index = 0
      for (let i = 0; i < data.length; i++) {
        if (data[i][0] === code) {
          index = i
        }
      }
      return this.securitiesJson.securities.data[index]
    },
    getMarketdataColumnIndex (column) {
      let data = this.securitiesJson.marketdata.columns
      let index = 0
      for (let i = 0; i < data.length; i++) {
        if (data[i] === column) {
          index = i
        }
      }
      return index
    },
    getMarketdata (code) {
      let data = this.securitiesJson.marketdata.data
      let index = 0
      for (let i = 0; i < data.length; i++) {
        if (data[i][0] === code) {
          index = i
        }
      }
      return this.securitiesJson.marketdata.data[index]
    },
    getChart (code) {
      let a = 'https://iss.moex.com/cs/engines/stock/markets/index/boardgroups/9/securities/'
      let b = '.png?c.width=450&z1.width=450&z1_c.width=450&c.height=168&z1.height=168&z1_c.height=168&template=adv_no_volume&_='
      let c = '&compare=&compare_template=adv_no_volume_comp&candles=72&interval=10'
      return a + code + b + this.getSecurities(code)[this.getSecuritiesColumnIndex('SEQNUM')] + c
    },
    getLink (code) {
      return 'https://www.moex.com/en/index/' + code
    },
    makeActive (index) {
      if (this.currentRowIndex !== index) {
        this.currentRowIndex = index
      } else {
        this.currentRowIndex = -1
      }
    },
    percentColor (percent) {
      if (percent > 0) {
        return 'trend-up'
      } else if (percent < 0) {
        return 'trend-down'
      } else {
        return 'trend-none'
      }
    },
    rowColor (index) {
      if (index === this.currentRowIndex) {
        return 'current'
      } else if (index === 0) {
        return 'first odd'
      } else if (index % 2 === 1) {
        return 'even'
      } else if (index % 2 === 0) {
        return 'odd'
      } else if (index === this.max) {
        return 'last odd'
      }
    }
  },
  watch: {
    tabInfo: function () {
      this.currentRowIndex = -1
    }
  },
  filters: {
    currencyDecimal (value) {
      return value.toFixed(2)
    },
    formatDate (value) {
      if (value) {
        return moment(String(value)).format('DD.MM.YYYY')
      }
    },
    formatTime (value) {
      if (value) {
        return value.substring(0, value.lastIndexOf(':'))
      }
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
  .tab-table tr {
    cursor: pointer;
  }
  .tab-table tr.current td {
    background-color: #c9cbd5;
  }
  .tab-table thead td {
    background-color: #ccc;
    font-weight: bold;
  }
  .tab-table tr.even td {
    background: #e9eaed none repeat scroll 0 0;
  }
  .tab-table td {
    padding: 5px;
  }
  .tab-table .wrapper img {
    width: 100%;
    overflow: hidden;
  }
  .tab-table td a {
    text-decoration: none;
    color: #336699;
  }
  .tab-table td.trend-up span {
    vertical-align: top;
    color: #090;
  }
  .tab-table td.trend-down span  {
    vertical-align: top;
    color: #c00;
    text-decoration: none;
  }
  .tab-table td.trend-none span  {
    vertical-align: top;
    color: #666;
  }
</style>
