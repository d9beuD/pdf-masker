import { mask } from "@/types/mask";
import { PDFDocument, rgb } from "pdf-lib";

export async function fileToPdf(file: File): Promise<PDFDocument> {
  const buffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  pdfDoc.setTitle(file.name);

  return pdfDoc;
}

export async function getEditedPdf(
  source: PDFDocument,
  masks: mask[],
  isPreview = false
): Promise<PDFDocument> {
  const pdf = await PDFDocument.load(await source.save());

  // For each mask config we have
  for (let i = 0; i < masks.length; i += 1) {
    const mask = masks[i];

    if (isPreview) {
      // add some style to better visualize the mask
      Object.assign(mask, {
        borderColor: rgb(1, 0, 0),
        borderWidth: 1,
        opacity: 0.8,
      } as mask);
    }

    pdf.getPages().forEach((page) => {
      // Apply masks
      page.drawRectangle(mask);
    });
  }

  return pdf;
}

export async function getEditedPdfList(
  pdfList: PDFDocument[],
  masks: mask[],
  isPreview = false
): Promise<PDFDocument[]> {
  const newPdfList: PDFDocument[] = [];

  // For each PDF document
  for (let i = 0; i < pdfList.length; i += 1) {
    newPdfList.push(await getEditedPdf(pdfList[i], masks, isPreview));
  }

  return newPdfList;
}
