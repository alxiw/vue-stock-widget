<template>
  <div class="row">
    <table>
    <thead>
    </thead>
    <tbody>
    <tr class="data"
        :class="rowColor (index)">
      <td class="name"
          title="Stock Index Name"
          >
        <a v-bind:href="link" target="_blank" onclick="event.stopPropagation()">
          <span>{{ securities[securitiesColumns.indexOf('SHORTNAME')] }}</span>
        </a>
      </td>
      <td class="date"
          title="Date"
          >
        <span>{{ marketdata[marketdataColumns.indexOf('TRADEDATE')] | formatDate }}</span>
      </td>
      <td class="time"
          title="Time"
          >
        <span>{{ marketdata[marketdataColumns.indexOf('UPDATETIME')] | formatTime }}</span>
      </td>
      <td class="number"
          title="Current Value"
          >
        <span>{{ marketdata[marketdataColumns.indexOf('CURRENTVALUE')] | currencyDecimal }}</span>
      </td>
      <td class="percent"
          :class="percentColor(marketdata[marketdataColumns.indexOf('LASTCHANGETOOPENPRC')])"
          title="Change in Current Value to Previous Trading Day Value, %"
          >
        <span>{{ marketdata[marketdataColumns.indexOf('LASTCHANGETOOPENPRC')] | currencyDecimal }}%</span>
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
    </tbody>
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
  data () {
    return {

    }
  },
  methods: {
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
      if (this.isRowCurrent) {
        return 'current'
      } else if (index % 2 === 1) {
        return 'even'
      } else if (index % 2 === 0) {
        return 'odd'
      }
    }
  },
  computed: {
    link () {
      return 'https://www.moex.com/en/index/' + this.marketdata[this.marketdataColumns.indexOf('SECID')]
    },
    chart () {
      let a = 'https://iss.moex.com/cs/engines/stock/markets/index/boardgroups/9/securities/'
      let b = '.png?c.width=450&z1.width=450&z1_c.width=450&c.height=168&z1.height=168&z1_c.height=168&template=adv_no_volume&_='
      let c = '&compare=&compare_template=adv_no_volume_comp&candles=72&interval=10'
      let code = this.marketdata[this.marketdataColumns.indexOf('SECID')]
      let number = this.marketdata[this.marketdataColumns.indexOf('SEQNUM')]
      return a + code + b + number + c
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

<style>
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
