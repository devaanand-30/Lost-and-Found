import PDFDocument from 'pdfkit';

export const generatePdf = async (req, res) => {
  const { title, description, location, date } = req.body;

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');

  doc.pipe(res);
  doc.fontSize(18).text('Lost & Found Report', { underline: true });
  doc.moveDown();
  doc.text(`Title: ${title}`);
  doc.text(`Description: ${description}`);
  doc.text(`Location: ${location}`);
  doc.text(`Date: ${date}`);
  doc.end();
};