'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { LineItem, QuoteItem, QuoteTax, SavedTax } from '@/lib/types'
import { useRouter } from 'next/navigation'
import QuoteTable from '@/components/QuoteTable'
import AddItem from '@/components/AddItem'

interface TaxInput {
  id: string
  label: string
  percentage: string
}

export default function NewQuotePage() {
  const [clientName, setClientName] = useState('')
  const [jobName, setJobName] = useState('')
  const [taxes, setTaxes] = useState<TaxInput[]>([])
  const [savedTaxes, setSavedTaxes] = useState<SavedTax[]>([])
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchLineItems()
    fetchSavedTaxes()
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

  const fetchSavedTaxes = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('saved_taxes')
      .select('*')
      .eq('user_id', user.id)
      .order('label')

    if (error) {
      console.error('Error fetching saved taxes:', error)
    } else {
      setSavedTaxes(data || [])
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

  const handleAddTax = () => {
    setTaxes([...taxes, { id: crypto.randomUUID(), label: '', percentage: '' }])
  }

  const handleRemoveTax = (id: string) => {
    setTaxes(taxes.filter(tax => tax.id !== id))
  }

  const handleUpdateTax = (id: string, field: 'label' | 'percentage', value: string) => {
    setTaxes(taxes.map(tax => 
      tax.id === id ? { ...tax, [field]: value } : tax
    ))
  }

  const handleAddSavedTax = (savedTax: SavedTax) => {
    const newTax: TaxInput = {
      id: crypto.randomUUID(),
      label: savedTax.label,
      percentage: savedTax.percentage.toString(),
    }
    setTaxes([...taxes, newTax])
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
      const totalTax = taxes.reduce((sum, tax) => sum + (subtotal * (parseFloat(tax.percentage) / 100)), 0)
      const total = subtotal + totalTax

      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .insert({
          user_id: user.id,
          client_name: clientName,
          job: jobName || clientName,
          total: total,
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

      // Insert taxes
      const taxesToInsert = taxes
        .filter(tax => tax.label && tax.percentage)
        .map(tax => ({
          quote_id: quote.id,
          label: tax.label,
          percentage: parseFloat(tax.percentage),
        }))

      if (taxesToInsert.length > 0) {
        const { error: taxesError } = await supabase
          .from('quote_taxes')
          .insert(taxesToInsert)

        if (taxesError) throw taxesError
      }

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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-700">Tax Rates (Optional)</h3>
            <button
              type="button"
              onClick={handleAddTax}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              + Add Tax
            </button>
          </div>
          
          {savedTaxes.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Quick-add saved taxes:</p>
              <div className="flex flex-wrap gap-2">
                {savedTaxes.map((savedTax) => (
                  <button
                    key={savedTax.id}
                    type="button"
                    onClick={() => handleAddSavedTax(savedTax)}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {savedTax.label} ({savedTax.percentage}%)
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {taxes.length === 0 ? (
            <p className="text-sm text-gray-500">No taxes added</p>
          ) : (
            <div className="space-y-3">
              {taxes.map((tax) => (
                <div key={tax.id} className="grid grid-cols-[1fr,100px,40px] gap-3 items-center">
                  <input
                    type="text"
                    value={tax.label}
                    onChange={(e) => handleUpdateTax(tax.id, 'label', e.target.value)}
                    placeholder="e.g., VAT, Sales Tax"
                    className="border border-gray-300 rounded-lg p-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={tax.percentage}
                    onChange={(e) => handleUpdateTax(tax.id, 'percentage', e.target.value)}
                    placeholder="%"
                    min="0"
                    max="100"
                    className="border border-gray-300 rounded-lg p-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTax(tax.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
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
