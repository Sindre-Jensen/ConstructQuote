export interface LineItem {
  id: string
  user_id: string
  name: string
  default_price: number
  created_at: string
}

export interface Quote {
  id: string
  user_id: string
  client_name: string
  job: string
  status: 'draft' | 'sent' | 'accepted' | 'declined'
  total: number
  expires: string | null
  created_at: string
}

export interface QuoteItem {
  id: string
  quote_id: string
  name: string
  quantity: number
  price: number
}

export interface QuoteWithItems extends Quote {
  items: QuoteItem[]
}
