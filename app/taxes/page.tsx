'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { SavedTax } from '@/lib/types'
import { useRouter } from 'next/navigation'

export default function TaxesPage() {
  const [savedTaxes, setSavedTaxes] = useState<SavedTax[]>([])
  const [label, setLabel] = useState('')
  const [percentage, setPercentage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchSavedTaxes()
  }, [])

  const fetchSavedTaxes = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!label || !percentage) return

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      const { error } = await supabase.from('saved_taxes').insert({
        user_id: user.id,
        label,
        percentage: parseFloat(percentage),
      })

      if (error) throw error

      setLabel('')
      setPercentage('')
      fetchSavedTaxes()
    } catch (error) {
      console.error('Error adding saved tax:', error)
      alert('Error adding saved tax')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved tax?')) return

    try {
      const { error } = await supabase.from('saved_taxes').delete().eq('id', id)
      if (error) throw error
      setSavedTaxes(savedTaxes.filter(tax => tax.id !== id))
    } catch (error) {
      console.error('Error deleting saved tax:', error)
      alert('Error deleting saved tax')
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
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Saved Tax Rates</h2>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <form onSubmit={handleAdd} className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., VAT, Sales Tax"
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Percentage (%)</label>
              <input
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="e.g., 21"
                min="0"
                max="100"
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 font-semibold w-full"
              >
                {loading ? 'Adding...' : 'Add Tax'}
              </button>
            </div>
          </form>
        </div>

        {savedTaxes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No saved tax rates yet. Add one above to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedTaxes.map((tax) => (
              <div
                key={tax.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-900">{tax.label}</p>
                  <p className="text-sm text-gray-500">{tax.percentage}%</p>
                </div>
                <button
                  onClick={() => handleDelete(tax.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete saved tax"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
