<template>
  <a-modal width="70%" v-model:visible="props.visible" @before-open="handleBeforeOpen" @ok="handleOk"
    @cancel="handleCancel" okText="Confirm" cancelText="Exit" :mask-closable="false" body-class="pt-[0px]">
    <template #title>
      <span v-if="!appStore.machineType">
        <span class="warning mr-[5px]">*</span>
        <a-input v-model="machineTypeInput"
          :class="{ 'w-[250px] mr-[5px]': true, 'border-warning': !machineTypeInput.length }"
          placeholder="Please enter machine type" allow-clear />
      </span>
      <span class="mr-[5px]" v-else>{{ appStore.machineType }}</span>
      Config
    </template>
    <a-tabs default-active-key="json">
      <a-tab-pane key="json" title="JSON" >

        <Editor class="mt-[10px] !h-[600px]" v-model:model-value="config" language="json" ></Editor>
      </a-tab-pane>
      <a-tab-pane key="table" title="Table" :no-footer="true">
        <vue-excel-editor v-model="jsondata">
          <vue-excel-column field="name"   label="name"  width="100px"     type="string"  />
          <vue-excel-column field="comment"   label="comment"  width="320px"    type="string" />

      </vue-excel-editor>
      </a-tab-pane>

    </a-tabs>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import Editor from '@renderer/components/Editor/index.vue'
import { template } from './DefaultTemplate'
import { useAppStore } from '@renderer/store';

const config = ref('')
const machineTypeInput = ref('')

const appStore = useAppStore()
// const jsondata = ref(template.CCODE[1001].paramSet)
const sheetIndex = ref(0);

const jsondata = computed(() => {
  if(!appStore.config){
    return []
  }
   const config = JSON.parse(appStore.config).CCODE;
   const keys = Object.keys(config)
   if(keys.length > 0 && keys.length > sheetIndex.value){
    return config[keys[sheetIndex.value]].paramSet
   }
   return []
})

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const handleOk = () => {

  if (appStore.machineType) {
    //修改的情况
  } else {
    // 新增时，如果没有输入机型
    if (machineTypeInput.value.length == 0) {
      return
    }
  }
  const machineType = appStore.machineType || machineTypeInput.value
  const fileName = `${machineType}.json`
  // 保存配置文件
  window.extApi.writeConfigFile(fileName, config.value).then(()=>{
    // 保存成功后，更新配置
    appStore.refreshMachineType(machineType)
    appStore.refreshMachineTypeList()
    emit('close')
  })

}

const handleCancel = () => {
  emit('close')
}

const handleBeforeOpen = () => {
  // 如果有值，为编辑状态
  if (appStore.machineType) {
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
