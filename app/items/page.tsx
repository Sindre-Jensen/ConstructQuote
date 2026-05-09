'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { LineItem } from '@/lib/types'
import { useRouter } from 'next/navigation'

export default function ItemsPage() {
  const [items, setItems] = useState<LineItem[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('line_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching items:', error)
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('line_items')
      .insert({
        user_id: user.id,
        name,
        default_price: parseFloat(price),
      })

    if (error) {
      console.error('Error adding item:', error)
    } else {
      setName('')
      setPrice('')
      fetchItems()
    }
  }

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase.from('line_items').delete().eq('id', id)
    if (error) {
      console.error('Error deleting item:', error)
    } else {
      fetchItems()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">ConstructQuote</h1>
          <div className="flex gap-6">
            <a href="/dashboard" className="text-gray-600 hover:text-gray-900 hover:underline">Dashboard</a>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Line Item Library</h2>

        <form onSubmit={handleAddItem} className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-4 text-gray-900">Add New Item</h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item name"
              required
              className="flex-1 border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Default price"
              required
              className="w-40 border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Add
            </button>
          </div>
        </form>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No items in your library yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.default_price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
