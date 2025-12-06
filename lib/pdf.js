import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportInvoicePDF(elementId) {
  const el = document.getElementById(elementId)
  if (!el) return
  const originalBg = el.style.backgroundColor
  // optional: set white bg for better export
  el.style.backgroundColor = '#fff'
  const canvas = await html2canvas(el, { scale: 3, useCORS: true })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  let position = 0
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  // if content taller than page, add pages (basic)
  if (imgHeight > pageHeight) {
    let heightLeft = imgHeight - pageHeight
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
  }
  pdf.save('invoice.pdf')
  el.style.backgroundColor = originalBg
}