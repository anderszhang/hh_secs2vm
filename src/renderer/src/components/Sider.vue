<template>
  <a-space size="large">
    <a-cascader
      :options="options"
      default-value="HHQK"
      expand-trigger="hover"
      :style="{ width: '200px' }"
      placeholder="Machine Type"
      allow-clear
    />
    <a-button>
      <template #icon>
        <icon-plus />
      </template>
    </a-button>
    <a-button  @click="transform">CCID</a-button>
    <a-button type="primary" @click="transform">Transform</a-button>
  </a-space>

  <Editor class="mt-[10px] !h-[calc(100%-42px)]" v-model="secsMsg"></Editor>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'
import Editor from '@renderer/components/Editor/index.vue'
import { secs } from './Editor/lastFile';

const secsMsg = ref('')
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
  'transform': [msg: string]
}>()

const transform = () => {
  emit('transform', secsMsg.value)
}

onMounted(() => {
  secsMsg.value = secs
})
</script>
