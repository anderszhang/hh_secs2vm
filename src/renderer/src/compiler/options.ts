export type  CCODEParam = {
    name: string,
    comment?: string,
}

export type  CCODEConfig = {
    name: string,
    paramSet: CCODEParam[],
}
export type  CCODEMap = Record<string, CCODEConfig>

export type MachineTypeConfig = {
    area: string,
    brand: string,
    CCODE: CCODEMap
}