<template>
  <div class="row">
    <table>
      <tr class="data"
          :class="rowColor">
        <td class="name"
            title="Stock Index Name">
          <a v-bind:href="link" target="_blank" onclick="event.stopPropagation()">
            <span>{{ shortName }}</span>
          </a>
        </td>
        <td class="date"
            title="Date">
          <span>{{ tradeDate | formatDate }}</span>
        </td>
        <td class="time"
            title="Time">
          <span>{{ updateTime | formatTime }}</span>
        </td>
        <td class="number"
            title="Current Value">
          <span>{{ currentValue | currencyDecimal }}</span>
        </td>
        <td class="percent"
            :class="percentColor"
            title="Change in Current Value to Previous Trading Day Value, %">
          <span>{{ lastChangeToOpenPrc | currencyDecimal }}%</span>
        </td>
      </tr>
      <tr class="chart"
          v-show="isRowCurrent">
        <td colspan="5">
          <div class="wrapper">
            <img v-bind:src="chart">
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'StockRow',
  props: {
    index: Number,
    securitiesColumns: Array,
    marketdataColumns: Array,
    securities: Array,
    marketdata: Array,
    isRowCurrent: Boolean
  },
  methods: {
    getSecuritiesValue (value) {
      return this.securities[this.securitiesColumns.indexOf(value)]
    },
    getMarketdataValue (value) {
      return this.marketdata[this.marketdataColumns.indexOf(value)]
    }
  },
  computed: {
    shortName () {
      return this.getSecuritiesValue('SHORTNAME')
    },
    tradeDate () {
      return this.getMarketdataValue('TRADEDATE')
    },
    updateTime () {
      return this.getMarketdataValue('UPDATETIME')
    },
    currentValue () {
      return this.getMarketdataValue('CURRENTVALUE')
    },
    lastChangeToOpenPrc () {
      return this.getMarketdataValue('LASTCHANGETOOPENPRC')
    },
    link () {
      return 'https://www.moex.com/en/index/' + this.getMarketdataValue('SECID')
    },
    chart () {
      return 'https://iss.moex.com/cs/engines/stock/markets/index/boardgroups/9/securities/' +
        this.getMarketdataValue('SECID') +
        '.png?c.width=450&z1.width=450&z1_c.width=450&c.height=168&z1.height=168&z1_c.height=168&template=adv_no_volume&_=' +
        this.getMarketdataValue('SEQNUM') +
        '&compare=&compare_template=adv_no_volume_comp&candles=72&interval=10'
    },
    rowColor () {
      if (this.isRowCurrent) {
        return 'current'
      } else if (this.index % 2 === 1) {
        return 'even'
      } else if (this.index % 2 === 0) {
        return 'odd'
      } else {
        return 'even'
      }
    },
    percentColor () {
      if (this.lastChangeToOpenPrc > 0) {
        return 'trend-up'
      } else if (this.lastChangeToOpenPrc < 0) {
        return 'trend-down'
      } else {
        return 'trend-none'
      }
    }
  },
  filters: {
    currencyDecimal (value) {
      return value.toFixed(2)
    },
    formatDate (value) {
      if (value) return moment(String(value)).format('DD.MM.YYYY')
    },
    formatTime (value) {
      if (value) return value.substring(0, value.lastIndexOf(':'))
    }
  }
}
</script>

<style scoped>
  .row {
    border-collapse: collapse;
    border-spacing: 0;
    margin: 0;
    width: 100%;
  }
  .row table {
    border-collapse: collapse;
    border-spacing: 0;
    margin: 0;
    width: 100%;
  }
  .row tr.current td {
    background-color: #c9cbd5;
  }
  .row tr.even td {
    background: #e9eaed none repeat scroll 0 0;
  }
  .row tr.odd td {
    background: #fff none repeat scroll 0 0;
  }
  .row td.name {
    vertical-align: top;
    width: 40%;
  }
  .row td.date {
    vertical-align: top;
    width: 20%;
  }
  .row td.time {
    vertical-align: top;
    width: 15%;
  }
  .row td.number {
    vertical-align: top;
    width: 15%;
  }
  .row td.percent {
    vertical-align: top;
    width: 10%;
  }
  .row td {
    padding: 5px;
  }
  .row td a {
    text-decoration: none;
    color: #336699;
  }
  .row td.trend-up span {
    vertical-align: top;
    color: #090;
  }
  .row td.trend-down span  {
    vertical-align: top;
    color: #c00;
    text-decoration: none;
  }
  .row td.trend-none span  {
    vertical-align: top;
    color: #666;
  }
  .row .wrapper img {
    width: 100%;
    overflow: hidden;
  }
</style>
