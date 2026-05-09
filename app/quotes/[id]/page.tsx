'use client'

import { useEffect, useState, use } from 'react'
import { supabase } from '@/lib/supabase'
import { Quote, QuoteItem } from '@/lib/types'
import { useRouter } from 'next/navigation'
import QuoteTable from '@/components/QuoteTable'

export default function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [items, setItems] = useState<QuoteItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchQuote()
  }, [resolvedParams.id])

  const fetchQuote = async () => {
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
      setLoading(false)
      return
    }

    setQuote(quoteData)

    const { data: itemsData, error: itemsError } = await supabase
      .from('quote_items')
      .select('*')
      .eq('quote_id', resolvedParams.id)

    if (itemsError) {
      console.error('Error fetching items:', itemsError)
    } else {
      setItems(itemsData || [])
    }
    setLoading(false)
  }

  const handleDuplicate = async () => {
    if (!quote) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      const { data: newQuote, error: quoteError } = await supabase
        .from('quotes')
        .insert({
          user_id: user.id,
          client_name: quote.client_name + ' (copy)',
        })
        .select()
        .single()

      if (quoteError) throw quoteError

      const itemsToInsert = items.map(item => ({
        quote_id: newQuote.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('quote_items')
        .insert(itemsToInsert)

      if (itemsError) throw itemsError

      router.push(`/quotes/${newQuote.id}`)
    } catch (error) {
      console.error('Error duplicating quote:', error)
      alert('Error duplicating quote')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this quote?')) return

    try {
      const { error } = await supabase.from('quotes').delete().eq('id', resolvedParams.id)
      if (error) throw error
      router.push('/dashboard')
    } catch (error) {
      console.error('Error deleting quote:', error)
      alert('Error deleting quote')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-gray-600">Loading...</div>
  }

  if (!quote) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-gray-600">Quote not found</div>
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
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{quote.client_name}</h2>
            <p className="text-gray-500">
              Created: {new Date(quote.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href={`/quotes/${resolvedParams.id}/edit`}
              className="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Edit
            </a>
            <button
              onClick={handleDuplicate}
              className="bg-white border border-gray-300 text-gray-900 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Duplicate
            </button>
            <button
              onClick={handlePrint}
              className="bg-white border border-gray-300 text-gray-900 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Export PDF
            </button>
            <button
              onClick={handleDelete}
              className="bg-white border border-gray-300 text-gray-900 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="print-area bg-gray-50 border border-gray-200 rounded-lg p-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Quote</h3>
          <p className="mb-6 text-gray-600"><strong>Client:</strong> {quote.client_name}</p>
          {quote.job && <p className="mb-6 text-gray-600"><strong>Job:</strong> {quote.job}</p>}
          
          <QuoteTable
            items={items}
            onUpdateItem={() => {}}
            onRemoveItem={() => {}}
            editable={false}
          />

          {/* Tax breakdown */}
          <div className="mt-8 border-t border-gray-300 pt-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">
                {new Intl.NumberFormat('en-IE', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                }).format(items.reduce((sum, item) => sum + (item.quantity * item.price), 0))}
              </span>
            </div>
            {quote.tax_percentage && quote.tax_percentage > 0 && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  {quote.tax_label || 'Tax'} ({quote.tax_percentage}%)
                </span>
                <span className="font-semibold text-gray-900">
                  {new Intl.NumberFormat('en-IE', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0,
                  }).format(items.reduce((sum, item) => sum + (item.quantity * item.price), 0) * (quote.tax_percentage / 100))}
                </span>
              </div>
            )}
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-300">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">
                {new Intl.NumberFormat('en-IE', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                }).format(quote.total || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          nav, button {
            display: none !important;
          }
          .print-area {
            box-shadow: none;
            border: none;
          }
        }
      `}</style>
    </div>
  )
}
