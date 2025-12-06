'use client'

import useInvoiceStore from '../lib/store'

export default function InvoicePreview({ clientName, id }) {
  const { items, logo, tax, discount, themeColor } = useInvoiceStore()

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
  const taxValue = (subtotal * tax) / 100
  const discountValue = discount.isPercent ? (subtotal * discount.value) / 100 : discount.value
  const grandTotal = subtotal + taxValue - discountValue

  return (
    <div id={id} className="p-6" style={{ fontFamily: 'Inter, system-ui', color: '#111' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold" style={{ color: themeColor }}>Your Company</h3>
          <div className="text-sm">Address line 1</div>
        </div>
        <div>
          {logo ? <img src={logo} alt="logo" className="h-16 object-contain" /> : <div className="h-16 w-32 bg-gray-100 flex items-center justify-center">Logo</div>}
        </div>
      </div>

      <div className="mb-4">
        <div className="font-semibold">Bill To</div>
        <div className="text-sm">{clientName || 'Client name'}</div>
      </div>

      <table className="w-full text-sm border-collapse mb-4">
        <thead>
          <tr className="text-left border-b">
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <tr key={idx} className="border-b">
              <td>{it.name}</td>
              <td>{it.qty}</td>
              <td>₹{it.price.toFixed(2)}</td>
              <td>₹{(it.qty * it.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right space-y-1">
        <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
        <div>Tax: ₹{taxValue.toFixed(2)}</div>
        <div>Discount: -₹{discountValue.toFixed(2)}</div>
        <div className="font-bold text-lg">Total: ₹{grandTotal.toFixed(2)}</div>
      </div>

    </div>
  )
}