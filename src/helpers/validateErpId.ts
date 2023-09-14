export const isValidErpId = (erpId: string) => {
    return /^[a-z\d]{1,64}$/.test(erpId)
}