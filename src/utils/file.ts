import { PDFDocument } from "pdf-lib";
import fs from "fs";

export function pdfToObjectUrl(pdf: File): string {
  return URL.createObjectURL(pdf);
}

export function createPdf(uri: string): Promise<PDFDocument> {
  fs.readFileSync(uri);
  const pdf = PDFDocument.load(uri);
  return pdf;
}
