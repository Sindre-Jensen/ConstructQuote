'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Quote } from '@/lib/types'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700' },
  declined: { label: 'Declined', color: 'bg-red-100 text-red-700' },
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatExpires(dateString: string | null) {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function DashboardPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching quotes:', error)
    } else {
      setQuotes(data || [])
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Calculate stats
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const quotesThisMonth = quotes.filter(quote => {
    const date = new Date(quote.created_at)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  }).length

  const awaitingResponse = quotes.filter(q => q.status === 'sent').length

  const valueSent = quotes
    .filter(q => q.status === 'sent' && q.total)
    .reduce((sum, q) => sum + (q.total || 0), 0)

  const acceptedValue = quotes
    .filter(q => q.status === 'accepted' && q.total)
    .reduce((sum, q) => sum + (q.total || 0), 0)

  const acceptedCount = quotes.filter(q => q.status === 'accepted').length

  const sentCount = quotes.filter(q => q.status === 'sent').length

  const filteredQuotes = quotes.filter(quote => {
    return quote.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.job.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleQuoteClick = (quoteId: string) => {
    router.push(`/quotes/${quoteId}`)
  }

  const handleDelete = async (quoteId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this quote?')) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('quotes').delete().eq('id', quoteId).eq('user_id', user.id)
    if (error) {
      console.error('Error deleting quote:', error)
      alert('Failed to delete quote: ' + error.message)
    } else {
      setQuotes(quotes.filter(q => q.id !== quoteId))
    }
  }

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    const { error } = await supabase.from('quotes').update({ status: newStatus }).eq('id', quoteId)
    if (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    } else {
      setQuotes(quotes.map(q => q.id === quoteId ? { ...q, status: newStatus as Quote['status'] } : q))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Image
            src="/ConstruQuote_Logo.png"
            alt="ConstruQuote logo"
            width={65}
            height={55}
            priority
            className="object-contain"
          />
          <div className="flex items-center gap-6">
            <a href="/taxes" className="text-gray-600 hover:text-gray-900 transition-colors">
              Tax rates
            </a>
            <div className="relative">
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-xs text-gray-500 mb-1">Quotes this month</div>
            <div className="text-2xl font-bold text-gray-900">{quotesThisMonth}</div>
            <div className="text-xs text-gray-500 mt-1">{awaitingResponse} awaiting response</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-xs text-gray-500 mb-1">Value sent</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(valueSent)}</div>
            <div className="text-xs text-gray-500 mt-1">across {sentCount} quotes</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-xs text-gray-500 mb-1">Accepted</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(acceptedValue)}</div>
            <div className="text-xs text-gray-500 mt-1">{acceptedCount} jobs confirmed</div>
          </div>
        </div>

        {/* Section header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Quotes</h2>
          <div className="flex gap-3">
            <a
              href="/items"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              Price list
            </a>
            <a
              href="/quotes/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New quote
            </a>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by client or job..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quote list */}
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No quotes found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQuotes.map((quote) => {
              const status = (quote.status as keyof typeof statusConfig) || 'draft'
              const { label, color } = statusConfig[status]
              const expires = formatExpires(quote.expires)
              return (
                <div
                  key={quote.id}
                  className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-gray-300 transition-colors cursor-pointer"
                  onClick={() => handleQuoteClick(quote.id)}
                >
                  {/* Left: job info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-lg truncate">{quote.job}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {quote.client_name} · {formatDate(quote.created_at)}
                      {expires && (
                        <span className="text-amber-600"> · expires {expires}</span>
                      )}
                    </p>
                  </div>

                  {/* Right: status + total + delete */}
                  <div className="flex items-center gap-3 shrink-0">
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className={`px-2 py-1 rounded-md text-xs font-medium border-0 cursor-pointer ${color}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="accepted">Accepted</option>
                      <option value="declined">Declined</option>
                    </select>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">
                        {quote.total ? formatCurrency(quote.total) : '€0'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDelete(quote.id, e)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete quote"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
