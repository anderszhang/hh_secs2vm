<template>
  <a-layout class="h-[100%]">
    <a-layout-sider :resize-directions="['right']" class="p-[10px]">
      <Sider @transform="transform"></Sider>
    </a-layout-sider>
    <a-layout-content class="w-[50%]">
      <VmEditor :code=code></VmEditor>
    </a-layout-content>
  </a-layout>

</template>
<script setup lang="ts">
import Sider from '@renderer/components/Sider.vue'
import VmEditor from './components/VmEditor.vue';
import { compile } from './compiler/compile';
import { Message } from '@arco-design/web-vue';
import { ref } from 'vue';

const code = ref('')

function transform(secsMsg:string){
  try {
    code.value = compile(secsMsg)
  } catch (error: any) {
    Message.error({
      content: error.message,
    })
  }
}
</script>

<style scoped></style>