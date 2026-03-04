export interface Invoice {
    id: number
    booking_id: number
    number: string
    amount: number
    currency: string
    status: 'draft' | 'issued' | 'paid' | 'cancelled'
    issued_at?: string | null
    paid_at?: string | null
    cancelled_at?: string | null
    created_at: string
    updated_at: string
}

export interface InvoiceState {
    invoices: Invoice[]
    currentInvoice: Invoice | null
    loading: boolean
    error: string | null
}
