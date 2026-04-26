import { Bill } from "@/types/bill";

const escapePdfText = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const formatCurrency = (value = 0) => `Rs. ${value.toFixed(2)}`;

const addText = (lines: string[], text: string, x: number, y: number, size = 10) => {
  lines.push(`BT /F1 ${size} Tf ${x} ${y} Td (${escapePdfText(text)}) Tj ET`);
};

export const downloadBillPdf = (bill: Bill) => {
  const content: string[] = [];
  let y = 780;

  addText(content, "HealthNest Hospital", 48, y, 20);
  addText(content, `Invoice #${bill.id}`, 48, (y -= 28), 14);
  addText(content, `Date: ${bill.date}`, 48, (y -= 22));
  addText(content, `Patient: ${bill.patientName}`, 48, (y -= 18));
  if (bill.doctorName) addText(content, `Doctor: ${bill.doctorName}`, 48, (y -= 18));
  addText(content, `Status: ${bill.paymentStatus.toUpperCase()}`, 48, (y -= 18));
  if (bill.paymentMethod) addText(content, `Payment Method: ${bill.paymentMethod}`, 48, (y -= 18));

  y -= 28;
  addText(content, "Items", 48, y, 13);
  addText(content, "Description", 48, (y -= 24), 10);
  addText(content, "Qty", 330, y, 10);
  addText(content, "Amount", 420, y, 10);

  bill.items.forEach((item) => {
    y -= 20;
    addText(content, item.description.slice(0, 44), 48, y);
    addText(content, String(item.quantity), 330, y);
    addText(content, formatCurrency(item.amount), 420, y);
  });

  y -= 34;
  addText(content, `Subtotal: ${formatCurrency(bill.subtotal)}`, 330, y, 11);
  if (bill.discount) addText(content, `Discount: -${formatCurrency(bill.discount)}`, 330, (y -= 18), 11);
  if (bill.tax) addText(content, `Tax: ${formatCurrency(bill.tax)}`, 330, (y -= 18), 11);
  addText(content, `Total: ${formatCurrency(bill.total)}`, 330, (y -= 24), 14);

  if (bill.notes) {
    addText(content, "Notes", 48, (y -= 42), 12);
    addText(content, bill.notes.slice(0, 80), 48, (y -= 18), 10);
  }

  addText(content, "Thank you for choosing HealthNest Hospital.", 48, 54, 10);

  const stream = content.join("\n");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bill-${bill.id}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};