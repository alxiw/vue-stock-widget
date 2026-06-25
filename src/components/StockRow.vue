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

<script setup lang="ts">
import { computed } from 'vue'

type MoexRowMap = Record<string, string | number | null>

const props = defineProps<{
  index: number
  securitiesColumns: string[]
  marketdataColumns: string[]
  securities: (string | number | null)[]
  marketdata: (string | number | null)[]
  isRowCurrent: boolean
}>()

defineEmits<{
  (e: 'active'): void
}>()

const securitiesMap = computed<MoexRowMap>(() => {
  if (!props.securities || !props.securitiesColumns) return {}
  return Object.fromEntries(props.securitiesColumns.map((column, idx) => [column, props.securities[idx]]))
})

const marketdataMap = computed<MoexRowMap>(() => {
  if (!props.marketdata || !props.marketdataColumns) return {}
  return Object.fromEntries(props.marketdataColumns.map((column, idx) => [column, props.marketdata[idx]]))
})

const shortName = computed<string>(() => String(securitiesMap.value.SHORTNAME || ''))
const tradeDate = computed<string | null>(() => marketdataMap.value.TRADEDATE as string | null)
const updateTime = computed<string | null>(() => marketdataMap.value.UPDATETIME as string | null)
const currentValue = computed<number | null>(() => marketdataMap.value.CURRENTVALUE as number | null)
const lastChangeToOpenPrc = computed<number | null>(() => marketdataMap.value.LASTCHANGETOOPENPRC as number | null)

const link = computed<string>(() => {
  const secId = marketdataMap.value.SECID
  return secId ? `https://www.moex.com/en/index/${secId}` : '#'
})

const chart = computed<string>(() => {
  const secId = marketdataMap.value.SECID
  const seqNum = marketdataMap.value.SEQNUM
  if (!secId || !seqNum) return ''
  return `/cs/engines/stock/markets/index/boardgroups/9/securities/${secId}.png?c.width=450&z1.width=450&z1_c.width=450&c.height=168&z1.height=168&z1_c.height=168&template=adv_no_volume&_=${seqNum}&compare=&compare_template=adv_no_volume_comp&candles=72&interval=10`
})

const rowColor = computed<string>(() => {
  if (props.isRowCurrent) return 'current'
  return props.index % 2 === 1 ? 'even' : 'odd'
})

const percentColor = computed<string>(() => {
  const val = lastChangeToOpenPrc.value
  if (val === null || val === undefined) return 'trend-none'
  if (val > 0) return 'trend-up'
  if (val < 0) return 'trend-down'
  return 'trend-none'
})

function currencyDecimal (value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return ''
  return typeof value === 'number' ? value.toFixed(2) : String(value)
}

function formatDate (value: string | null | undefined): string {
  if (!value) return ''
  return value.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3.$2.$1')
}

function formatTime (value: string | null | undefined): string {
  if (!value) return ''
  return value.slice(0, 5)
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
