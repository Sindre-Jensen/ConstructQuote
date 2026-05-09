'use client'

import { QuoteItem } from '@/lib/types'

interface QuoteTableProps {
  items: QuoteItem[]
  onUpdateItem: (id: string, field: 'quantity' | 'price', value: number) => void
  onRemoveItem: (id: string) => void
  editable?: boolean
}

export default function QuoteTable({ items, onUpdateItem, onRemoveItem, editable = true }: QuoteTableProps) {
  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4 font-medium text-gray-700">Item name</th>
            <th className="text-left p-4 font-medium text-gray-700 w-28">Quantity</th>
            <th className="text-left p-4 font-medium text-gray-700 w-36">Price</th>
            <th className="text-left p-4 font-medium text-gray-700 w-36">Total</th>
            {editable && <th className="w-16"></th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-gray-200">
              <td className="p-4 text-gray-900">{item.name}</td>
              <td className="p-4">
                {editable ? (
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                    className="w-24 border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                ) : (
                  <span className="text-gray-900">{item.quantity}</span>
                )}
              </td>
              <td className="p-4">
                {editable ? (
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => onUpdateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                    className="w-32 border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                ) : (
                  <span className="text-gray-900">${item.price.toFixed(2)}</span>
                )}
              </td>
              <td className="p-4 font-medium text-gray-900">${(item.quantity * item.price).toFixed(2)}</td>
              {editable && (
                <td className="p-4">
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    Remove
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan={3} className="p-4 font-bold text-right text-gray-900">Total:</td>
            <td className="p-4 font-bold text-gray-900">${total.toFixed(2)}</td>
            {editable && <td></td>}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
