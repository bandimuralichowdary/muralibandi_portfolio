export function calculateTotals(items, tax, discount) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
  const taxValue = (subtotal * tax) / 100
  const discountValue = discount.isPercent ? (subtotal * discount.value) / 100 : discount.value
  const total = subtotal + taxValue - discountValue
  return { subtotal, taxValue, discountValue, total }
}