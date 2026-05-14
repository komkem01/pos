export interface CashCount {
  bills1000: number
  bills500: number
  bills100: number
  bills50: number
  bills20: number
  coinsTotal: number
}

export type ShiftStatus = 'open' | 'closed'

export interface Shift {
  id: string
  openedAt: string
  closedAt?: string
  openedBy: string
  initialFund: number
  status: ShiftStatus
  systemCashSales: number
  systemQrSales: number
  actualCashCount?: CashCount
  actualCashTotal?: number
  cashVariance?: number
  closingNote?: string
}
