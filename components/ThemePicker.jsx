'use client'

import useInvoiceStore from '../lib/store'

export default function ThemePicker() {
  const { themeColor, setThemeColor } = useInvoiceStore()
  const presets = ['#7c3aed', '#b45309', '#0ea5e9', '#059669']

  return (
    <div className="flex items-center gap-2">
      <label className="block text-sm">Theme</label>
      <div className="flex gap-2">
        {presets.map((c) => (
          <button key={c} className="h-8 w-8 rounded" style={{ background: c }} onClick={() => setThemeColor(c)} />
        ))}
      </div>
    </div>
  )
}