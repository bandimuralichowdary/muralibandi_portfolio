import create from 'zustand'

const useInvoiceStore = create((set) => ({
  items: [],
  logo: null,
  tax: 18,
  discount: { value: 0, isPercent: true },
  themeColor: '#7c3aed',
  addItem: (item) => set((s) => ({ items: [...s.items, { ...item }] })),
  removeItem: (idx) => set((s) => ({ items: s.items.filter((_, i) => i !== idx) })),
  updateItem: (idx, item) => set((s) => ({ items: s.items.map((it, i) => (i === idx ? item : it)) })),
  setLogo: (dataUrl) => set({ logo: dataUrl }),
  setTax: (val) => set({ tax: val }),
  setDiscount: (d) => set({ discount: d }),
  setThemeColor: (c) => set({ themeColor: c })
}))

export default useInvoiceStore