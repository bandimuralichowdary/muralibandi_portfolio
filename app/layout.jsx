import './globals.css'

export const metadata = {
  title: 'Invoice Generator',
  description: 'Client-friendly invoice generator with PDF export'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-slate-900">{children}</body>
    </html>
  )
}
