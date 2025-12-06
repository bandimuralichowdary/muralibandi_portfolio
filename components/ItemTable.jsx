'use client'

export default function ItemTable() {
  const [name, setName] = useState('')
  const [qty, setQty] = useState(1)
  const [price, setPrice] = useState(0)
  const { items, addItem, removeItem, updateItem } = useInvoiceStore()

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-medium mb-2">Items</h3>
      <div className="flex gap-2 mb-3">
        <input className="flex-1 border p-2 rounded" placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" className="w-20 border p-2 rounded" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
        <input type="number" className="w-32 border p-2 rounded" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        <button
          className="px-3 py-2 bg-accent text-white rounded"
          onClick={() => { addItem({ name, qty, price }); setName(''); setQty(1); setPrice(0); }}
          style={{ '--accent': useInvoiceStore.getState().themeColor }}
        >
          Add
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <tr key={idx} className="border-t">
              <td>{it.name}</td>
              <td>
                <input type="number" value={it.qty} min={1} className="w-16 border p-1 rounded" onChange={(e) => updateItem(idx, { ...it, qty: Number(e.target.value) })} />
              </td>
              <td>
                <input type="number" value={it.price} className="w-24 border p-1 rounded" onChange={(e) => updateItem(idx, { ...it, price: Number(e.target.value) })} />
              </td>
              <td>{(it.qty * it.price).toFixed(2)}</td>
              <td>
                <button className="text-sm text-red-600" onClick={() => removeItem(idx)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}