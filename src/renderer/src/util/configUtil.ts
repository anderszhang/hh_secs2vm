import type { MachineTypeConfig } from '@renderer/compiler/options'
import { FILE_PATH } from '@share/constant'

export async function getAreaDict() {
  const str = await window.extApi.readFile(FILE_PATH.AREA_DICT_FILE)
  return JSON.parse(str)
}

export function saveAreaDict() {}

export async function getSupplierDict() {
  const str = await window.extApi.readFile(FILE_PATH.SUPPLIER_DICT_FILE)
  return JSON.parse(str)
}

export async function getEqpTypeConfig(eqpType: string): Promise<MachineTypeConfig> {
  const fileName = eqpType + '.json'
  const source = await window.extApi.readEqpConfigFile(fileName)
  const config:MachineTypeConfig= JSON.parse(source)
  return config
}

export async function getEqpTypeList() {
  const list = await window.extApi.getEqpTypeList()

  return list
    .filter((item) => {
      return item.endsWith('.json')
    })
    .map((item) => {
      // 去掉json后缀
      return item.slice(0, -5)
    })
}
