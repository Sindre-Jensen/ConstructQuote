'use client'

import { useEffect, useState, use } from 'react'
import { supabase } from '@/lib/supabase'
import { LineItem, QuoteItem } from '@/lib/types'
import { useRouter } from 'next/navigation'
import QuoteTable from '@/components/QuoteTable'
import AddItem from '@/components/AddItem'

export default function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [clientName, setClientName] = useState('')
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchQuoteData()
    fetchLineItems()
  }, [resolvedParams.id])

  const fetchQuoteData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: quoteData, error: quoteError } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', resolvedParams.id)
      .single()

    if (quoteError) {
      console.error('Error fetching quote:', quoteError)
    } else {
      setClientName(quoteData.client_name)
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('quote_items')
      .select('*')
      .eq('quote_id', resolvedParams.id)

    if (itemsError) {
      console.error('Error fetching items:', itemsError)
    } else {
      setQuoteItems(itemsData || [])
    }
    setInitialLoading(false)
  }

  const fetchLineItems = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('line_items')
      .select('*')
      .eq('user_id', user.id)
      .order('name')

    if (error) {
      console.error('Error fetching line items:', error)
    } else {
      setLineItems(data || [])
    }
  }

  const handleAddLineItem = (item: LineItem) => {
    const newQuoteItem: QuoteItem = {
      id: crypto.randomUUID(),
      quote_id: resolvedParams.id,
      name: item.name,
      quantity: 1,
      price: item.default_price,
    }
    setQuoteItems([...quoteItems, newQuoteItem])
  }

  const handleAddCustomItem = (name: string, price: number) => {
    const newQuoteItem: QuoteItem = {
      id: crypto.randomUUID(),
      quote_id: resolvedParams.id,
      name,
      quantity: 1,
      price,
    }
    setQuoteItems([...quoteItems, newQuoteItem])
  }

  const handleUpdateItem = (id: string, field: 'quantity' | 'price', value: number) => {
    setQuoteItems(quoteItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const handleRemoveItem = (id: string) => {
    setQuoteItems(quoteItems.filter(item => item.id !== id))
  }

  const handleSave = async () => {
    if (!clientName || quoteItems.length === 0) {
      alert('Please enter a client name and add at least one item')
      return
    }

    setLoading(true)
    try {
      const { error: quoteError } = await supabase
        .from('quotes')
        .update({
          client_name: clientName,
        })
        .eq('id', resolvedParams.id)

      if (quoteError) throw quoteError

      const { error: deleteError } = await supabase
        .from('quote_items')
        .delete()
        .eq('quote_id', resolvedParams.id)

      if (deleteError) throw deleteError

      const itemsToInsert = quoteItems.map(item => ({
        quote_id: resolvedParams.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('quote_items')
        .insert(itemsToInsert)

      if (itemsError) throw itemsError

      router.push(`/quotes/${resolvedParams.id}`)
    } catch (error) {
      console.error('Error saving quote:', error)
      alert('Error saving quote')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-gray-600">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">ConstructQuote</h1>
          <a href={`/quotes/${resolvedParams.id}`} className="text-gray-600 hover:text-gray-900 hover:underline">Cancel</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Edit Quote</h2>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <label className="block text-sm font-medium mb-2 text-gray-700">Client Name</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter client name"
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <AddItem
            lineItems={lineItems}
            onAddLineItem={handleAddLineItem}
            onAddCustomItem={handleAddCustomItem}
          />
        </div>

        {quoteItems.length > 0 && (
          <>
            <div className="mb-6">
              <QuoteTable
                items={quoteItems}
                onUpdateItem={handleUpdateItem}
                onRemoveItem={handleRemoveItem}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 font-semibold"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
