<template>
    <Editor class="!h-[calc(100%-5px)]"  v-model="code" language="xml" />
  </template>
  <script setup lang="ts">
  import { ref, watch } from 'vue'

  import Editor from '@renderer/components/Editor/index.vue'

  
  const code = ref('')

  const props = defineProps<{
    code:string
  }>()
  
  watch(() => props.code, (newVal) => {
    code.value = newVal
  })

  
  </script>
  