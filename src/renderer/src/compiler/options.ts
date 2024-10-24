export type  CCODEParam = {
    name: string,
    commet?: string,
}

export type  CCODEConfig = {
    name: string,
    paramSet: CCODEParam[],
}
export type  CCODE = Record<string, CCODEConfig>

export type MachineTypeConfig = {
    area: string,
    brand: string,
    CCODE: CCODE
}