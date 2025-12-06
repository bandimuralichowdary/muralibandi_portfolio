'use client'

import { useState } from 'react'
import ItemTable from '../../components/ItemTable'
import Totals from '../../components/Totals'
import LogoUploader from '../../components/LogoUploader'
import ThemePicker from '../../components/ThemePicker'
import InvoicePreview from '../../components/InvoicePreview'
import { exportInvoicePDF } from '../../lib/pdf'
import useInvoiceStore from '../../lib/store'

export default function InvoicePage() {
  const [clientName, setClientName] = useState('')
  const { items, tax, discount, themeColor } = useInvoiceStore()

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Invoice Builder</h2>

        <div className="space-y-3 bg-white p-4 rounded shadow">
          <label className="block">Client Name</label>
          <input className="w-full border p-2 rounded" value={clientName} onChange={(e) => setClientName(e.target.value)} />
        </div>

        <ItemTable />

        <div className="bg-white p-4 rounded shadow space-y-3">
          <Totals />
        </div>

        <div className="flex gap-2">
          <LogoUploader />
          <ThemePicker />
          <button
            className="px-4 py-2 rounded bg-accent text-white"
            onClick={() => exportInvoicePDF('invoice-preview')}
            style={{ '--accent': themeColor }}
          >
            Download PDF
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Preview</h2>
        <div className="bg-white p-4 rounded shadow">
          <InvoicePreview clientName={clientName} id="invoice-preview" />
        </div>
      </section>
    </div>
  )
}