<template>
  <a-modal width="70%" v-model:visible="props.visible" @ok="handleOk" @cancel="handleCancel" okText="Confirm"
    cancelText="Exit">
    <template #title> Config </template>
    <a-tabs default-active-key="json">
      <a-tab-pane key="json" title="JSON">

        <Editor class="mt-[10px] !h-[600px]" v-model="config"></Editor>
      </a-tab-pane>
      <a-tab-pane key="table" title="Table"> Content of Tab Panel 2 </a-tab-pane>

    </a-tabs>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Editor from '@renderer/components/Editor/index.vue'
import { template } from './DefaultTemplate'

const visible = ref(false)
const config = ref()

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
const open = (machineType?: string) => {
  visible.value = true
  // 编辑模式
  if (machineType) {
    // 读取配置文件

  } else {
    // 新建模式
    config.value = template
  }
}
const handleOk = () => {
  emit('close')
}

const handleCancel = () => {
  emit('close')
}


</script>
