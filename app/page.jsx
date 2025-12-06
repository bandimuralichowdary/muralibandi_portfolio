// File: app/page.jsx
import Link from 'next/link'

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Invoice Generator</h1>
      <p className="mb-6">Generate branded invoices and export to PDF.</p>
      <div className="flex gap-4">
        <Link href="/invoice" className="px-4 py-2 bg-accent text-white rounded" style={{ '--accent': '#7c3aed' }}>
          Open Invoice App
        </Link>
      </div>
    </main>
  )
}