<template>
  <Editor class="!h-[calc(100%-5px)]"  v-model="secsMsg"></Editor>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

import Editor from '@renderer/components/Editor/index.vue'
import { secs } from './Editor/lastFile';


const secsMsg = ref('')

const getSecsMsg = ():string => {
  return secsMsg.value
}

defineExpose({
  getSecsMsg
})

onMounted(() => {
  secsMsg.value = secs
})
</script>
