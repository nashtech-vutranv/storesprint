  interface IUser {
    version: number
    id: string
    erpId: string
    name: string
    fullName?: string
    createdAt: string
    modifiedAt: string
    firstName: string,
    lastName: string,
    emailAddress: string,
    status: string
  }
  
  export type {IUser}