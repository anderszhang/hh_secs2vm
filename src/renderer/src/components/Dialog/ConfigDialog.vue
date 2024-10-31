<template>
  <a-modal width="70%" v-model:visible="props.visible" @before-open="handleBeforeOpen" @ok="handleOk"
    @cancel="handleCancel" okText="Confirm" cancelText="Exit" :mask-closable="false" body-class="pt-[0px]">
    <template #title>
      <span v-if="!appStore.eqpType">
        <span class="warning mr-[5px]">*</span>
        <a-input v-model="eqpTypeInput"
          :class="{ 'w-[250px] mr-[5px]': true, 'border-warning': !eqpTypeInput.length }"
          placeholder="Please enter machine type" allow-clear />
      </span>
      <span class="mr-[5px]" v-else>{{ appStore.eqpType }}</span>
      Config
    </template>
    <a-tabs default-active-key="json" lazy-load>
      <a-tab-pane key="json" title="JSON" >
        <Editor class="mt-[10px] !h-[600px]" v-model:model-value="config" language="json" ></Editor>
      </a-tab-pane>
      <a-tab-pane key="table" title="Table" :no-footer="true">
        <TableView />
      </a-tab-pane>

    </a-tabs>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import Editor from '@renderer/components/Editor/index.vue'
import TableView from './TableView.vue'
import { template } from './DefaultTemplate'
import { useAppStore } from '@renderer/store';

const config = ref('')
const eqpTypeInput = ref('')

const appStore = useAppStore()
// const jsondata = ref(template.CCODE[1001].paramSet)


const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const handleOk = () => {

  if (appStore.eqpType) {
    //修改的情况
  } else {
    // 新增时，如果没有输入机型
    if (eqpTypeInput.value.length == 0) {
      return
    }
  }
  const eqpType = appStore.eqpType || eqpTypeInput.value
  const fileName = `${eqpType}.json`
  // 保存配置文件
  window.extApi.writeEqpConfigFile(fileName, config.value).then(()=>{
    // 保存成功后，更新配置
    appStore.refreshEqpType(eqpType)
    appStore.refreshEqpTypeList()
    emit('close')
  })

}

const handleCancel = () => {
  emit('close')
}

const handleBeforeOpen = () => {
  // 如果有值，为编辑状态
  if (appStore.eqpType) {
    config.value = appStore.config
  } else {
    config.value = JSON.stringify(template, null, 2)
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
:deep(.arco-tabs-content){
  padding: 0px !important;
}
</style>
