// stores/counter.js
import { defineStore } from 'pinia'
interface State {
  eqpType: string,
  secsMsg: string,
  vmTemplate: string
  eqpTypeList: string[],
  areaOptions: string[]
  config: any
}

export const useAppStore = defineStore('appStore', {
  state: ():State => {
    return { 
      eqpType: '', 
      secsMsg:'',
      vmTemplate: '',
      eqpTypeList: [],
      areaOptions: [],
      config: null
    }
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    refreshEqpType(type: string) {
      this.eqpType = type
      this.readConfig(type)
    },

    async refreshEqpTypeList() {
      const list =  await window.extApi.getEqpTypeList()
     
      const fileList = list.filter(item=>{
        return item.endsWith('.json')
      }).map(item=>{
         // 去掉json后缀
        return item.slice(0, -5)
      })
      this.eqpTypeList = fileList
    },

    async readConfig(eqpType:string) {
      const fileName = eqpType + '.json'
      const source = await window.extApi.readEqpConfigFile(fileName)
      this.config = source
    }

    
  },
})