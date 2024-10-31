// stores/counter.js
import { defineStore } from 'pinia'

import { getAreaDict, getSupplierDict, getEqpTypeList,getEqpTypeConfig } from '@renderer/util/configUtil'
import { MachineTypeConfig } from '@renderer/compiler/options'
interface State {
  eqpType: string
  secsMsg: string
  vmTemplate: string
  eqpTypeList: string[]
  areas: string[]
  suppliers: string[]
  eqpTypeConfig: MachineTypeConfig|Record<string, never>
  eqpTypeConfigBackup: MachineTypeConfig|Record<string, never>
}

export const useAppStore = defineStore('appStore', {
  state: (): State => {
    return {
      eqpType: '',
      secsMsg: '',
      vmTemplate: '',
      eqpTypeList: [],
      areas: [],
      suppliers: [],
      eqpTypeConfig: {},
      eqpTypeConfigBackup: {}
    }
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    refreshEqpType(type: string) {
      this.eqpType = type
      this.readEqpTypeConfig(type)
    },

    async refreshEqpTypeList() {
      this.eqpTypeList = await getEqpTypeList()
    },

    async readEqpTypeConfig(eqpType: string) {
      const config = await getEqpTypeConfig(eqpType)
      this.eqpTypeConfig = config
    },

    async init() {
      this.refreshEqpTypeList()
      this.areas = await getAreaDict()
      this.suppliers = await getSupplierDict()
    }
  }
})
