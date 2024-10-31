<template>
  <div class="py-[10px]">
    <a-form :model="appStore.eqpTypeConfig" layout="inline" size="small" :rules="rules">
      <a-form-item label="Equipment Type" name="eqpType" required>
        <a-select v-model="appStore.eqpTypeConfig.eqpType" :options="appStore.eqpTypeList" class="w-200px" allow-create
          allow-clear allow-search></a-select>
      </a-form-item>
      <a-form-item label="Area" name="area" required>
        <a-select v-model="appStore.eqpTypeConfig.area" :options="appStore.areas" class="w-200px" allow-create
          allow-clear allow-search></a-select>
      </a-form-item>
      <a-form-item label="Supplier" name="supplier" required>
        <a-select v-model="appStore.eqpTypeConfig.supplier" :options="appStore.suppliers" class="w-200px" allow-create
          allow-clear allow-search></a-select>
      </a-form-item>
    </a-form>
  </div>
  <div class="flex">
    <div class="w-[360px]">
      <a-typography-title :heading="6" class="!mt-0"> CCODE List </a-typography-title>
      <OnlineExcel ref="ccodeExcelRef" :data="CCODEList" :col-names="['CCODE', 'comment']" :col-widths="[10, 50]"
        @after-on-cell-mouse-down="afterOnCellMouseDown" />
    </div>
    <a-divider direction="vertical" class="mt-[20px]" />
    <div class="flex-1">
      <a-typography-title :heading="6" class="!mt-0"> {{ currentCCODEData.CCODE ? `CCODE: ${currentCCODEData.CCODE}` :
        '' }} PParmSet List</a-typography-title>
      <OnlineExcel ref="paramsExcelRef" :data="currentCCODEData.paramSet" :col-names="['name', 'comment']" />
    </div>

  </div>
</template>

<script lang="ts" setup>
import { computed, watch, ref, onMounted } from 'vue';
import OnlineExcel from './OnlineExcel.vue';
import { useAppStore } from '@renderer/store';

const appStore = useAppStore()
const ccodeExcelRef = ref<InstanceType<typeof OnlineExcel>>()
const paramsExcelRef = ref<InstanceType<typeof OnlineExcel>>()
let lastRowId = -1

const rules = ref({
  eqpType: [
    {
      required: true,
      message: 'eqpType is required',
    },
  ],
  area: [
    {
      required: true,
      message: 'area is required',
    },
  ],
  supplier: [
    {
      required: true,
      message: 'supplier is required',
    },
  ]
})


const currentCCODEData = ref<{
  CCODE: string,
  comment: string,
  paramSet: any[]
}>({
  CCODE: '',
  comment: '',
  paramSet: []
});


const CCODEList = ref<{ CCODE: string, comment: string }[]>([])


const afterOnCellMouseDown = (row: number, col: number) => {
  if (lastRowId == row) return
  if(lastRowId > -1){
    updateEqpTypeConfig(lastRowId)
  }

  const CCODEMap = appStore.eqpTypeConfig!.CCODE
  const keys = Object.keys(CCODEMap)
  if (keys.length > 0 && keys.length > row) {
    
    const newCCODE = keys[row]
    currentCCODEData.value = {
      CCODE: newCCODE,
      comment: CCODEMap[newCCODE].name,
      paramSet: [...CCODEMap[newCCODE].paramSet]
    }
  } else {
    currentCCODEData.value = {
      CCODE: '',
      comment: '',
      paramSet: []
    }
  }

  lastRowId = row
}

function updateEqpTypeConfig(rowId) {
  // 收集数据，更新至 eqpTypeConfig
  const data = paramsExcelRef.value?.getData()
  
  // 过滤掉数组没个元素都null的空行
  const newData = data.filter((row) => {
    return row.some((cell) => cell !== null)
  })
  const paramSet = newData.map((row) => {
    return {
      name: row[0],
      comment: row[1]
    }
  })
  const ccodeRow = CCODEList.value[rowId]
  if(!ccodeRow.CCODE){
    return
  }
  appStore.eqpTypeConfig.CCODE[ccodeRow.CCODE] = {
    name: ccodeRow.comment || '',
    paramSet
  }
}

const updateStore =()=>{
  if(lastRowId > -1){
    updateEqpTypeConfig(lastRowId)
  }else{
    updateEqpTypeConfig(0)
  }
}

defineExpose({
  updateStore
})


onMounted(() => {
  const { eqpType, area, supplier } = appStore.eqpTypeConfig
  if(!eqpType){
    return
  }
  console.log(eqpType, area, supplier)
  const CCODEMap = appStore.eqpTypeConfig.CCODE
  const keys = Object.keys(CCODEMap)
  const list = keys.map((key) => {
    return {
      CCODE: key,
      comment: CCODEMap![key].name
    }
  })
  CCODEList.value = list
  afterOnCellMouseDown(0, 0)
})

</script>