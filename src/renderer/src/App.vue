<template>
  <a-layout class="h-[100%]">
    <a-layout-header class="p-[10px]">
      <ToolBar @transform="transform" @export-excel="exportExcel" @openConfigDialog="openConfigDialog" />
    </a-layout-header>
    <a-layout class="!h-[calc(100%-52px)] px-[10px] ">
      <a-layout-sider :width="400" :resize-directions="['right']">
        <SecsEditor ref="secsEditorRef"></SecsEditor>
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
import ConfigDialog from './components/Dialog/ConfigDialog.vue';
import { compile, compileToExcel} from './compiler/compile';

import { Message } from '@arco-design/web-vue';
import { onMounted, ref } from 'vue';
import { useAppStore } from './store';
import type { CCODEMap, CCODEConfig, MachineTypeConfig } from './compiler/options';

const code = ref('')
const secsEditorRef = ref()
const configDialogRef = ref()
const configDialogVisible = ref(false)
const appStore = useAppStore()

//开始转义
function transform() {
  try {
    const options: MachineTypeConfig = JSON.parse(appStore.config)
    if(!options){
      throw new Error('请先配置机器类型')
    }
    const secsMsg = secsEditorRef.value?.getSecsMsg()
    code.value = compile(secsMsg,options.CCODE) as string
  } catch (error: any) {
    Message.error({
      content: error.message,
    })
  }
}

function exportExcel() {
  try {
    const options: MachineTypeConfig = JSON.parse(appStore.config)
    if(!options){
      throw new Error('请先配置机器类型')
    }
    const secsMsg = secsEditorRef.value?.getSecsMsg()
    const data =  compileToExcel(secsMsg,options.CCODE)
    const excelData = [
      {name: 'mySheetName', data: data}
    ];
    window.extApi.exportExcel('template.xlsx',excelData)
  } catch (error: any) {
    Message.error({
      content: error.message,
    })
  }
}

const openConfigDialog = () => {
  configDialogVisible.value = true
}

onMounted(() => {
  appStore.refreshMachineTypeList()
})

</script>

<style scoped></style>