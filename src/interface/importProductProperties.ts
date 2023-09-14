export interface IImportProductPropertiesResult {
    total: number
    success: number
    errorMessage: string
    invalidProperties: IInvalidProperties[]
}

export interface IInvalidProperties {
    lineNumber: number
    erpId: string
    name: string
    type: string
    isLocaleSensitive: string
    status: string
    failedReason: string
}