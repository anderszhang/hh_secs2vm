<template>
  <a-modal width="70%" v-model:visible="props.visible" @before-open="handleBeforeOpen" @ok="handleOk"
    title-align="start" @cancel="handleCancel" okText="Confirm" cancelText="Exit" :mask-closable="false"
    body-class="pt-[0px]" >
    <template #title>
      <span class="mr-[5px]">{{ appStore.eqpType }}</span>
      Config
    </template>
    <a-tabs default-active-key="table"  @change="handleTabChange">
      <a-tab-pane key="table" title="Table" :no-footer="true">
        <TableView v-if="props.visible"/>
      </a-tab-pane>
      <a-tab-pane key="json" title="JSON">
        <Editor class="mt-[10px] !h-[600px]" v-model:model-value="eqpTypeConfigStr" language="json"></Editor>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed,watch, Ref, ref } from 'vue'
import Editor from '@renderer/components/Editor/index.vue'
import TableView from './TableView.vue'
import { template } from './DefaultTemplate'
import { useAppStore } from '@renderer/store';
import { Message } from '@arco-design/web-vue';


const eqpTypeConfigStr:Ref<string> = ref('')

const appStore = useAppStore()

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const handleOk = () => {
  const {eqpType,supplier} = appStore.eqpTypeConfig!
  if(!eqpType || !supplier){
    Message.error({
      content: 'EqpType and Supplier can not be empty!'
    })
    return
  }

  const fileName = `${eqpType}.json`
  // 保存配置文件
  window.extApi.writeEqpConfigFile(fileName, eqpTypeConfigStr.value).then(() => {
    // 保存成功后，更新配置
    appStore.refreshEqpType(eqpType)
    appStore.refreshEqpTypeList()
    emit('close')
  })
}

const handleCancel = () => {
  appStore.eqpTypeConfig = appStore.eqpTypeConfigBackup
  emit('close')
}

const handleBeforeOpen = () => {
  appStore.eqpTypeConfigBackup = appStore.eqpTypeConfig
  // 如果有值，为编辑状态
  if (appStore.eqpType) {
    eqpTypeConfigStr.value = JSON.stringify(appStore.eqpTypeConfig,null,2)
  } else {
    eqpTypeConfigStr.value = JSON.stringify(template, null, 2)
  }
}

const handleTabChange = (key: string|number) => {
  if (key === 'json') {
    // paraset
    eqpTypeConfigStr.value = JSON.stringify(appStore.eqpTypeConfig, null, 2)
  }
}


</script>
<style scoped>
.warning {
  color: red
}

.border-warning {
  border-color: red;
}

:deep(.arco-tabs-content) {
  padding: 0px !important;
}
</style>
