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
      <span v-else>{{ appStore.machineType }}</span>
      Config
    </template>
    <a-tabs default-active-key="json">
      <a-tab-pane key="json" title="JSON">

        <Editor class="mt-[10px] !h-[600px]" v-model:model-value="config" language="json"></Editor>
      </a-tab-pane>
      <a-tab-pane key="table" title="Table"> Content of Tab Panel 2 </a-tab-pane>

    </a-tabs>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Editor from '@renderer/components/Editor/index.vue'
import { template } from './DefaultTemplate'
import { useAppStore } from '@renderer/store';
import { machine } from 'os';

const config = ref('')
const machineTypeInput = ref('')

const appStore = useAppStore()


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
  const fileName = `${appStore.machineType || machineTypeInput.value}.vm`
  const source = JSON.stringify(config.value,null, 2)
  window.extApi.writeFile(fileName,source).then(()=>{
    emit('close')
  })

}

const handleCancel = () => {
  emit('close')
}

const handleBeforeOpen = () => {
  // 如果有值，为编辑状态
  if (appStore.machineType) {
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
</style>
