export interface Service {
  id: number
  name: string
  description: string
  provider: string
  price: number
  rating: number
  category: string
  image: string
}

export interface FinancialData {
  revenue: {
    current: number
    change: number
  }
  orders: {
    current: number
    change: number
  }
  services: {
    current: number
    change: number
  }
  totalValue: {
    current: number
    change: number
  }
}

export interface Message {
  id: number
  sender: string
  message: string
  timestamp: string
  read: boolean
}
