'use client'

import useInvoiceStore from '../lib/store'

export default function Totals() {
  const { items, tax, discount, setTax, setDiscount, themeColor } = useInvoiceStore()

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
  const taxValue = (subtotal * tax) / 100
  const discountValue = discount.isPercent ? (subtotal * discount.value) / 100 : discount.value
  const grandTotal = subtotal + taxValue - discountValue

  return (
    <div>
      <div className="flex items-center gap-3">
        <label className="w-20">Tax %</label>
        <input type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))} className="border p-1 rounded w-24" />
      </div>

      <div className="flex items-center gap-3 mt-2">
        <label className="w-20">Discount</label>
        <input type="number" value={discount.value} onChange={(e) => useInvoiceStore.getState().setDiscount({ ...discount, value: Number(e.target.value) })} className="border p-1 rounded w-24" />
        <select value={discount.isPercent ? 'percent' : 'flat'} onChange={(e) => useInvoiceStore.getState().setDiscount({ ...discount, isPercent: e.target.value === 'percent' })} className="border p-1 rounded">
          <option value="percent">%</option>
          <option value="flat">Flat</option>
        </select>
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Tax</span><span>₹{taxValue.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Discount</span><span>-₹{discountValue.toFixed(2)}</span></div>
        <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
      </div>
    </div>
  )
}