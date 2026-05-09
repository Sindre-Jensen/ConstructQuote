'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { LineItem, QuoteItem } from '@/lib/types'
import { useRouter } from 'next/navigation'
import QuoteTable from '@/components/QuoteTable'
import AddItem from '@/components/AddItem'

export default function NewQuotePage() {
  const [clientName, setClientName] = useState('')
  const [jobName, setJobName] = useState('')
  const [taxLabel, setTaxLabel] = useState('')
  const [taxPercentage, setTaxPercentage] = useState('')
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchLineItems()
  }, [])

  const fetchLineItems = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

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
      quote_id: '',
      name: item.name,
      quantity: 1,
      price: item.default_price,
    }
    setQuoteItems([...quoteItems, newQuoteItem])
  }

  const handleAddCustomItem = (name: string, price: number) => {
    const newQuoteItem: QuoteItem = {
      id: crypto.randomUUID(),
      quote_id: '',
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      const subtotal = quoteItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
      const taxPercent = taxPercentage ? parseFloat(taxPercentage) : 0
      const taxAmount = subtotal * (taxPercent / 100)
      const total = subtotal + taxAmount

      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .insert({
          user_id: user.id,
          client_name: clientName,
          job: jobName || clientName,
          total: total,
          tax_label: taxLabel || null,
          tax_percentage: taxPercent,
        })
        .select()
        .single()

      if (quoteError) throw quoteError

      const itemsToInsert = quoteItems.map(item => ({
        quote_id: quote.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('quote_items')
        .insert(itemsToInsert)

      if (itemsError) throw itemsError

      router.push(`/quotes/${quote.id}`)
    } catch (error) {
      console.error('Error saving quote:', error)
      alert('Error saving quote')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">ConstructQuote</h1>
          <a href="/dashboard" className="text-gray-600 hover:text-gray-900 hover:underline">Back to Dashboard</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">New Quote</h2>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <label className="block text-sm font-medium mb-2 text-gray-700">Client Name</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter client name"
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-4"
          />
          
          <label className="block text-sm font-medium mb-2 text-gray-700">Job Name</label>
          <input
            type="text"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            placeholder="Enter job description (optional)"
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-sm font-medium mb-4 text-gray-700">Tax (Optional)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Tax Label</label>
              <input
                type="text"
                value={taxLabel}
                onChange={(e) => setTaxLabel(e.target.value)}
                placeholder="e.g., VAT, Sales Tax"
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Tax Percentage (%)</label>
              <input
                type="number"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(e.target.value)}
                placeholder="e.g., 21"
                min="0"
                max="100"
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>
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
              {loading ? 'Saving...' : 'Save Quote'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
