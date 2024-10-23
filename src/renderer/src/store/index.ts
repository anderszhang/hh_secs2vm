// stores/counter.js
import { defineStore } from 'pinia'

export const useAppStore = defineStore('counter', {
  state: () => {
    return { 
      machineType: '', 
      secsMsg:'',
      config: null
    }
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    chooseMachineType(type: string) {
      this.machineType = type
    }
  },
})