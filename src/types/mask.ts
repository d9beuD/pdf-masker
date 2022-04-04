import { PDFDocument, PDFPage, PDFPageDrawRectangleOptions } from "pdf-lib";

export interface mask extends PDFPageDrawRectangleOptions {
  documents: documentToApplyMasksTo[];
  id: string;
}

export interface configurable {
  applyMask: boolean;
  name?: string;
}

export interface documentToApplyMasksTo extends configurable, PDFDocument {
  pages: pageToApplyMasksTo[];
}

export interface pageToApplyMasksTo extends configurable, PDFPage {}
