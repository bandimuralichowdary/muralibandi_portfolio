'use client'

import useInvoiceStore from '../lib/store'

export default function LogoUploader() {
  const { logo, setLogo, themeColor } = useInvoiceStore()

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogo(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center gap-2">
      <label className="block text-sm">Logo</label>
      <input type="file" accept="image/*" onChange={onFile} />
      {logo && <img src={logo} alt="logo" className="h-10 w-10 object-contain" />}
    </div>
  )
}