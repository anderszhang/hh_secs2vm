// stores/counter.js
import { defineStore } from 'pinia'
interface State {
  machineType: string,
  secsMsg: string,
  vmTemplate: string
  machineTypeList: string[],
  config: any
}

export const useAppStore = defineStore('counter', {
  state: ():State => {
    return { 
      machineType: '', 
      secsMsg:'',
      vmTemplate: '',
      machineTypeList: [],
      config: null
    }
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    refreshMachineType(type: string) {
      this.machineType = type
      this.readConfig(type)
    },

    async refreshMachineTypeList() {
      const list =  await window.extApi.getConfigList()
     
      const fileList = list.filter(item=>{
        return item.endsWith('.json')
      }).map(item=>{
         // 去掉json后缀
        return item.slice(0, -5)
      })
      this.machineTypeList = fileList
    },

    async readConfig(machineType:string) {
      const fileName = machineType + '.json'
      const source = await window.extApi.readConfigFile(fileName)
      this.config = source
    }
  },
})