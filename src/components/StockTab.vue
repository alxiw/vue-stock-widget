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
                       :is-row-current="index === currentRowIndex"
                       @active="makeActive(index)">
            </stock-row>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import StockRow from './StockRow.vue'

interface TabInfo {
  title: string
  codes: string[]
}

interface MoexDataBlock {
  columns: string[]
  data: any[][]
}

interface SecuritiesJson {
  securities?: MoexDataBlock
  marketdata?: MoexDataBlock
}

interface PreparedStock {
  code: string
  securities: any[]
  marketdata: any[]
}

const props = defineProps<{
  tabInfo: TabInfo
  securitiesJson: SecuritiesJson
}>()

const currentRowIndex = ref<number>(-1)

const securitiesColumns = computed<string[]>(() => {
  return props.securitiesJson?.securities?.columns || []
})

const marketdataColumns = computed<string[]>(() => {
  return props.securitiesJson?.marketdata?.columns || []
})

const preparedStocks = computed<PreparedStock[]>(() => {
  const codes = props.tabInfo?.codes
  const securitiesData = props.securitiesJson?.securities?.data
  const marketdataData = props.securitiesJson?.marketdata?.data

  if (!codes || !securitiesData || !marketdataData) return []

  const securitiesMap = new Map<string, any[]>(securitiesData.map(item => [item[0], item]))
  const marketdataMap = new Map<string, any[]>(marketdataData.map(item => [item[0], item]))

  return codes
    .map(code => ({
      code,
      securities: securitiesMap.get(code),
      marketdata: marketdataMap.get(code)
    }))
    .filter((item): item is PreparedStock => !!item.securities && !!item.marketdata)
})

function makeActive(index: number): void {
  currentRowIndex.value = currentRowIndex.value === index ? -1 : index
}

watch(() => props.tabInfo, () => {
  currentRowIndex.value = -1
})
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
