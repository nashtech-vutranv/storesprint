export interface ICustomer {
    activity: number
    balance: number
    company: string
    country: {
      name: string
      code: string
    },
    date: string
    id: number
    name: string
    representative: {
      name: string
      image: string
    },
    status: string
    verified: boolean
}