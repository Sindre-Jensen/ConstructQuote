'use client'

import { useState } from 'react'
import { LineItem } from '@/lib/types'

interface AddItemProps {
  lineItems: LineItem[]
  onAddLineItem: (item: LineItem) => void
  onAddCustomItem: (name: string, price: number) => void
}

export default function AddItem({ lineItems, onAddLineItem, onAddCustomItem }: AddItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customPrice, setCustomPrice] = useState('')

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault()
    if (customName && customPrice) {
      onAddCustomItem(customName, parseFloat(customPrice))
      setCustomName('')
      setCustomPrice('')
      setIsOpen(false)
    }
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
      >
        Add Item
      </button>

      {isOpen && (
        <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h3 className="font-semibold mb-4 text-gray-900">Select from Library</h3>
          
          {lineItems.length === 0 ? (
            <p className="text-gray-500 text-sm mb-4">No line items in your library. Add a custom item below or go to the Items page.</p>
          ) : (
            <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
              {lineItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onAddLineItem(item)
                    setIsOpen(false)
                  }}
                  className="w-full text-left p-3 bg-white border border-gray-200 rounded hover:bg-gray-100 flex justify-between transition-colors"
                >
                  <span className="text-gray-900">{item.name}</span>
                  <span className="text-gray-600">${item.default_price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          )}

          <h3 className="font-semibold mb-4 text-gray-900">Add Custom Item</h3>
          <form onSubmit={handleAddCustom} className="space-y-4">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Item name"
              required
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              placeholder="Price"
              required
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Add Custom Item
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
