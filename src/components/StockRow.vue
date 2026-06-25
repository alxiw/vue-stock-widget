<template>
  <tr class="data"
      :class="rowColor"
      @click="$emit('active')">
    <td class="name"
        title="Stock Index Name">
      <a :href="link" target="_blank" @click.stop>
        <span>{{ shortName }}</span>
      </a>
    </td>
    <td class="date"
        title="Date">
      <span>{{ formatDate(tradeDate) }}</span>
    </td>
    <td class="time"
        title="Time">
      <span>{{ formatTime(updateTime) }}</span>
    </td>
    <td class="number"
        title="Current Value">
      <span>{{ currencyDecimal(currentValue) }}</span>
    </td>
    <td class="percent"
        :class="percentColor"
        title="Change in Current Value to Previous Trading Day Value, %">
      <span>{{ currencyDecimal(lastChangeToOpenPrc) }}%</span>
    </td>
  </tr>
  <tr class="chart"
      v-show="isRowCurrent">
    <td colspan="5">
      <div class="wrapper">
        <img v-bind:src="chart" alt="">
      </div>
    </td>
  </tr>
</template>

<script>

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
  emits: ['active'],
  methods: {
    currencyDecimal (value) {
      if (value === null || value === undefined || value === '') return ''
      return typeof value === 'number' ? value.toFixed(2) : value
    },
    formatDate (value) {
      if (!value) return ''
      const parts = value.split('-')
      if (parts.length !== 3) return value
      const [y, m, d] = parts
      return `${d}.${m}.${y}`
    },
    formatTime (value) {
      if (!value) return ''
      const lastColon = value.lastIndexOf(':')
      return lastColon !== -1 ? value.substring(0, lastColon) : value
    }
  },
  computed: {
    securitiesMap () {
      if (!this.securities || !this.securitiesColumns) return {}
      return Object.fromEntries(this.securitiesColumns.map((column, index) => [column, this.securities[index]]))
    },
    marketdataMap () {
      if (!this.marketdata || !this.marketdataColumns) return {}
      return Object.fromEntries(this.marketdataColumns.map((column, index) => [column, this.marketdata[index]]))
    },
    shortName () {
      return this.securitiesMap.SHORTNAME || ''
    },
    tradeDate () {
      return this.marketdataMap.TRADEDATE
    },
    updateTime () {
      return this.marketdataMap.UPDATETIME
    },
    currentValue () {
      return this.marketdataMap.CURRENTVALUE
    },
    lastChangeToOpenPrc () {
      return this.marketdataMap.LASTCHANGETOOPENPRC
    },
    link () {
      const secId = this.marketdataMap.SECID
      return secId ? `https://www.moex.com/en/index/${secId}` : '#'
    },
    chart () {
      const secId = this.marketdataMap.SECID
      const seqNum = this.marketdataMap.SEQNUM
      if (!secId || !seqNum) return ''
      return `/cs/engines/stock/markets/index/boardgroups/9/securities/${secId}.png?c.width=450&z1.width=450&z1_c.width=450&c.height=168&z1.height=168&z1_c.height=168&template=adv_no_volume&_=${seqNum}&compare=&compare_template=adv_no_volume_comp&candles=72&interval=10`
    },
    rowColor () {
      if (this.isRowCurrent) return 'current'
      return this.index % 2 === 1 ? 'even' : 'odd'
    },
    percentColor () {
      const val = this.lastChangeToOpenPrc
      if (val > 0) return 'trend-up'
      if (val < 0) return 'trend-down'
      return 'trend-none'
    }
  }
}
</script>

<style scoped>
  tr.current td {
    background-color: #c9cbd5;
  }
  tr.even td {
    background-color: #e9eaed;
  }
  tr.odd td {
    background-color: #fff;
  }
  td {
    padding: 5px;
    vertical-align: top;
  }
  td.name {
    width: 40%;
  }
  td.date {
    width: 20%;
  }
  td.time {
    width: 15%;
  }
  td.number {
    width: 15%;
  }
  td.percent {
    width: 10%;
  }
  td a {
    text-decoration: none;
    color: #336699;
  }
  .trend-up span {
    color: #090;
  }
  .trend-down span  {
    color: #c00;
  }
  .trend-none span  {
    color: #666;
  }
  .wrapper img {
    display: block;
    width: 100%;
  }
</style>
