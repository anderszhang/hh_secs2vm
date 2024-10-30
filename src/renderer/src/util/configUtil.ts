const FILE_PATH = {
    CONFIG_DIR : '/config',
    AREA_DICT_FILE: '/config/dict/area.json',
    SUPPLIER_DICT_FILE: '/config/dict/supplier.json'
}

export async function  getAreaDict(){
   const str = await window.extApi.readFile(FILE_PATH.AREA_DICT_FILE)
   return JSON.parse(str)
}

export function saveAreaDict(){
    
}