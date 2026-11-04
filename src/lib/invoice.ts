function pdfEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export function downloadBookingInvoice(input: {
  id: string;
  studioTitle: string;
  bookingDate: string;
  startTime?: string;
  endTime?: string;
  totalPrice: number;
  userName: string;
  status: string;
}) {
  const lines = [
    "StudioSpace booking invoice",
    `Receipt: ${input.id}`,
    `Guest: ${input.userName}`,
    `Studio: ${input.studioTitle}`,
    `Date: ${input.bookingDate}`,
    `Hours: ${input.startTime || "--"} to ${input.endTime || "--"}`,
    `Status: ${input.status}`,
    `Total: $${Number(input.totalPrice || 0).toFixed(2)}`,
    "Thank you for creating with StudioSpace.",
  ];

  const content = lines
    .map((line, index) => `BT /F1 14 Tf 48 ${740 - index * 28} Td (${pdfEscape(line)}) Tj ET`)
    .join("\n");

  const objects = [
    "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj",
    "2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj",
    "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj",
    `4 0 obj<</Length ${content.length}>>stream\n${content}\nendstream\nendobj`,
    "5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (const object of objects) {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  }

  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer<</Size ${objects.length + 1}/Root 1 0 R>>\nstartxref\n${xref}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `studiospace-invoice-${input.id}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
