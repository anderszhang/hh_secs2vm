<template>
  <div class="py-[10px]">
    <a-form :model="form" layout="inline" size="small" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-item label="Equipment Type" name="eqpType">
        <a-select v-model:value="form.eqpType" allow-create allow-clear allow-search></a-select>
      </a-form-item>
      <a-form-item label="Area" name="area">
        <a-select v-model:value="form.area" allow-create allow-clear allow-search></a-select>
      </a-form-item>
      <a-form-item label="Supplier" name="supplier">
        <a-select v-model:value="form.supplier" allow-create allow-clear allow-search></a-select>
      </a-form-item>
    </a-form>
  </div>
  <div class="flex">
    <div class="w-[360px]">
      <a-typography-title :heading="6" class="!mt-0"> CCODE </a-typography-title>
      <OnlineExcel :data="CCODEData" :col-names="['CCODE', 'comment']" :col-widths="[10, 50]"
        @after-on-cell-mouse-down="afterOnCellMouseDown" />
    </div>
    <a-divider direction="vertical" class="mt-[20px]" />
    <div class="flex-1">
      <a-typography-title :heading="6"  class="!mt-0"> PParmSet </a-typography-title>
      <OnlineExcel :data="paramSetData" :col-names="['name', 'comment']" />
    </div>

  </div>
</template>

<script lang="ts" setup>
import { computed, watch, ref } from 'vue';
import OnlineExcel from './OnlineExcel.vue';
import { useAppStore } from '@renderer/store';

const form = ref({
  eqpType: 'CCODE',
  area: 'all',
  supplier: 'all',
  
})

const ccodeIndex = ref(0);

const currentCcode = ref({
  CCODE:'',
  comment: '',
  paramSet: []
});
const appStore = useAppStore()

const CCODEData = computed(() => {
  if (!appStore.config) {
    return []
  }
  const config = JSON.parse(appStore.config).CCODE;
  const keys = Object.keys(config)
  return keys.map((key) => {
    return {
      CCODE: key,
      comment: config[key].name
    }
  })
})

const paramSetData = computed(() => {
  if (!appStore.config) {
    return []
  }
  const config = JSON.parse(appStore.config).CCODE;
  const keys = Object.keys(config)
  if (keys.length > 0 && keys.length > ccodeIndex.value) {
    return config[keys[ccodeIndex.value]].paramSet
  }
  return []
})


const afterOnCellMouseDown = (e: any,coords,td) => {
  const {row} = coords;
  ccodeIndex.value = row
}

watch(()=>ccodeIndex,() => {
  const length = CCODEData.value.length
  if (length > 0 && length > ccodeIndex.value) {
    //currentCcode.value = config[keys[ccodeIndex.value]]
  }
  
})
</script>