<template>
  <a-layout class="h-[100%]">
    <a-layout-header class="p-[10px]">
      <ToolBar @transform="transform" @openConfigDialog="openConfigDialog" />
    </a-layout-header>
    <a-layout class="!h-[calc(100%-52px)] px-[10px] ">
      <a-layout-sider :width="400" :resize-directions="['right']">
        <SecsEditor ref="secsEditorRef" @transform="transform"></SecsEditor>
      </a-layout-sider>
      <a-layout-content class="w-[50%]">
        <VmEditor :code=code></VmEditor>
      </a-layout-content>
    </a-layout>
    <ConfigDialog :visible="configDialogVisible" ref="configDialogRef" @close="configDialogVisible = false" />
  </a-layout>

</template>
<script setup lang="ts">
import ToolBar from './components/ToolBar.vue';
import SecsEditor from '@renderer/components/SecsEditor.vue'
import VmEditor from './components/VmEditor.vue';
import ConfigDialog from './components/Dialog/ConfigDialog.vue'
import { compile } from './compiler/compile';
import { Message } from '@arco-design/web-vue';
import { ref } from 'vue';

const code = ref('')
const secsEditorRef = ref()
const configDialogRef = ref()
const configDialogVisible = ref(false)

//开始转义
function transform() {
  try {
    const secsMsg = secsEditorRef.value?.getSecsMsg()
    code.value = compile(secsMsg)
  } catch (error: any) {
    Message.error({
      content: error.message,
    })
  }
}

const openConfigDialog = (machineType: string) => {
  configDialogVisible.value = true
  // configDialogRef.value?.open(machineType)
}
</script>

<style scoped></style>