// src/components/DownloadPdf.jsx
import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DownloadPdf = ({ item }) => {
  const generatePdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Lost & Found Item Report', 14, 20);

    doc.setFontSize(12);
    const tableColumn = ['Field', 'Details'];
    const tableRows = [];

    tableRows.push(['Title', item.title]);
    tableRows.push(['Description', item.description]);
    tableRows.push(['Date', item.date]);
    tableRows.push(['Location', item.location]);
    if (item.type) tableRows.push(['Type', item.type]);
    if (item.email) tableRows.push(['Contact Email', item.email]);

    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save(`Item_Report_${item.title}.pdf`);
  };

  return (
    <button
      onClick={generatePdf}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Download PDF
    </button>
  );
};

export default DownloadPdf;
