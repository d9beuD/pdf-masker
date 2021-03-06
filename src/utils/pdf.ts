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
    const pdfIndex = mask.documents.findIndex(
      (doc) => doc.name === pdf.getTitle()
    );
    const pagesToApplyMaskTo = mask.documents[pdfIndex].pages;

    // If PDF document is allowed to be masked
    if (mask.documents[pdfIndex].applyMask) {
      pdf.getPages().forEach((page, index) => {
        // If PDF page is allowed to be masked
        if (pagesToApplyMaskTo[index].applyMask) {
          // Apply mask
          page.drawRectangle(
            isPreview
              ? Object.assign({}, mask, {
                  borderColor: rgb(1, 0, 0),
                  borderWidth: 1,
                  opacity: 0.8,
                } as mask)
              : mask
          );
        }
      });
    }
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
