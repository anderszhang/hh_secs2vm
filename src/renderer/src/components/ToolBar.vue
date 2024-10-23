<template>
  <div class="w-[100%] flex justify-between ">
    <a-space size="large">
      <a-cascader :options="options" v-model="machineType" default-value="HHQK" expand-trigger="hover" :style="{ width: '200px' }"
        placeholder="Machine Type" allow-clear />
        <!-- 编辑配置 -->
      <a-button :disabled="!machineType" @click="openConfigDialog">
        <template #icon>
          <icon-edit />
        </template>
      </a-button>
      <!-- 新增配置 -->
      <a-button  :disabled="!!machineType" @click="openConfigDialog">
        <template #icon>
          <icon-plus />
        </template>
      </a-button>

      <a-button type="primary" @click="transform">Transform</a-button>
    </a-space>
    <a-space size="large" class="justify-end">
      <a-button>Copy</a-button>
      <a-button>Save</a-button>
      <a-button>Export Excel</a-button>
    </a-space>
  </div>


</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { IconPlus, IconEdit } from '@arco-design/web-vue/es/icon'

import { secs } from './Editor/lastFile';

const secsMsg = ref('')
const machineType = ref('')

const options = reactive([
  {
    value: 'CMP',
    label: 'CMP',
    children: [
      {
        value: 'HHQK',
        label: 'HHQK'
      }
    ]
  }
])

const emit = defineEmits<{
  'transform': [msg: string],
  'openConfigDialog': [machineType: string]
}>()

const transform = () => {
  emit('transform', secsMsg.value)
}

const openConfigDialog = () => {
  emit('openConfigDialog', machineType.value)
}

onMounted(() => {
  secsMsg.value = secs
})
</script>
