<template>
  <div class="my-[11px] pr-[10px] h-[calc(100%-22px)]">
    <a-space size="large" class="w-[100%] justify-end">
      <a-button >Copy</a-button>
      <a-button >Save</a-button>
      <a-button >Export Excel</a-button>
    </a-space>
  
    <Editor class="mt-[10px] !h-[calc(100%-42px)] " v-model="code" language="xml" />
  </div>
  </template>
  <script setup lang="ts">
  import { ref, reactive, watch } from 'vue'

  import Editor from '@renderer/components/Editor/index.vue'

  
  const code = ref('')

  const props = defineProps<{
    code:string
  }>()
  
  watch(() => props.code, (newVal) => {
    code.value = newVal
  })

  
  </script>
  