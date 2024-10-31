<template>
  <div class="w-[100%] flex justify-between ">
    <a-space size="large">
      <a-select :options="appStore.eqpTypeList" v-model="appStore.eqpType" :style="{ width: '200px' }"
        placeholder="Equipment Type" allow-search allow-clear @change="(eqpType)=>appStore.readEqpTypeConfig(eqpType as string)"/>

      <!-- 编辑配置 -->
      <a-button :disabled="!appStore.eqpType" @click="openConfigDialog">
        <template #icon>
          <icon-edit />
        </template>
      </a-button>
      <!-- 新增配置 -->
      <a-button :disabled="!!appStore.eqpType" @click="openConfigDialog">
        <template #icon>
          <icon-plus />
        </template>
      </a-button>

      <a-button type="primary" :disabled="!appStore.eqpType" @click="transform">Transform</a-button>
    </a-space>
    <a-space size="large" class="justify-end">
      <a-button>Copy</a-button>
      <a-button>Save</a-button>
      <a-button @click="exportExcel">Export Excel</a-button>
    </a-space>
  </div>


</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IconPlus, IconEdit } from '@arco-design/web-vue/es/icon'
import { useAppStore } from '@renderer/store';

import { secs } from './Editor/lastFile';

const secsMsg = ref('')
const appStore = useAppStore()


const emit = defineEmits<{
  'transform': [msg: string],
  'exportExcel': [],
  'openConfigDialog': []
}>()


const transform = () => {
  emit('transform', secsMsg.value)
}

const exportExcel = () => {
  emit('exportExcel')
}
const openConfigDialog = () => {
  emit('openConfigDialog')
}

onMounted(() => {
  secsMsg.value = secs
})
</script>
