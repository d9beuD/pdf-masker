<template>
  <div class="row h-100 no-gutters bg-white">
    <div
      id="left-pane"
      class="col-auto h-100 border-right pl-2 pt-2 pr-2 scroll-container"
    >
      <div class="font-weight-bold border-bottom mb-3">
        <font-awesome-icon :icon="faFilePdf" />
        Choisir un/des PDF
      </div>
      <b-form-group>
        <b-form-file
          v-model="fileList"
          multiple
          accept=".pdf"
          browse-text="Choisir"
        />
      </b-form-group>
      <b-button-group class="w-100">
        <b-button
          class="flex-grow-0"
          :disabled="index <= 0"
          @click="index -= 1"
        >
          -
        </b-button>
        <b-button class="flex-grow-1" disabled>{{ index + 1 }}</b-button>
        <b-button
          class="flex-grow-0"
          :disabled="index >= fileList.length - 1"
          @click="index += 1"
        >
          +
        </b-button>
      </b-button-group>
      <div id="mask-list" class="scroll-content scroll-container">
        <div class="d-flex border-bottom mt-4 sticky-top font-weight-bold">
          <div>
            <font-awesome-icon :icon="faDrawSquare" />
            Masques
          </div>
          <a href="#" class="ml-auto" @click.prevent="addMask">
            <font-awesome-icon :icon="faPlusCircle" size="lg" />
          </a>
        </div>
        <div class="scroll-content border-bottom">
          <template v-if="masks.length > 0">
            <div class="mt-3">
              <MaskConfigurator
                class="mb-2"
                v-for="(mask, index) in masks"
                :key="mask.id"
                :config.sync="masks[index]"
                :documents.sync="pdfDocList"
                @delete="removeMask"
              />
            </div>
          </template>
          <template v-else>
            <div class="text-center text-muted">
              <small>Aucun masque</small>
            </div>
          </template>
        </div>
      </div>
      <div class="py-2">
        <b-button variant="primary" block @click="save">
          <font-awesome-icon :icon="faFloppyDisk" swap-opacity />
          Enregistrer
        </b-button>
      </div>
    </div>
    <div id="preview" class="col h-100">
      <div class="h-100" v-for="pdf in fileList" :key="pdf.name">
        <template v-if="fileList.length > 0">
          <iframe id="pdf" :src="preview"></iframe>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { BFormFile, BFormGroup, BButtonGroup, BButton } from "bootstrap-vue";
import { fileToPdf, getEditedPdfList } from "@/utils/pdf";
import { PDFDocument, rgb } from "pdf-lib";
import { mask } from "@/types/mask";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faDrawSquare,
  faFilePdf,
  faFloppyDisk,
  faPlusCircle,
} from "@fortawesome/pro-duotone-svg-icons";
import MaskConfigurator from "./MaskConfigurator.vue";
import { ipcRenderer } from "electron";
import { mapMutations, mapState } from "vuex";

@Component({
  components: {
    BButton,
    BButtonGroup,
    BFormFile,
    BFormGroup,
    FontAwesomeIcon,
    MaskConfigurator,
  },
  computed: { ...mapState({ maskList: "masks" }) },
  methods: { ...mapMutations(["updateMaskList"]) },
})
export default class PDFEditor extends Vue {
  fileList: File[] = [];
  index = 0;
  preview = "";
  counter = 0;
  pdfDocList: PDFDocument[] = [];
  previewPdfDocList: PDFDocument[] = [];
  maskList!: mask[];
  updateMaskList!: (masks: mask[]) => void;

  faDrawSquare = faDrawSquare;
  faFilePdf = faFilePdf;
  faFloppyDisk = faFloppyDisk;
  faPlusCircle = faPlusCircle;

  get masks(): mask[] {
    return this.maskList;
  }

  set masks(masks: mask[]) {
    this.updateMaskList(masks);
  }

  async updatePreview(): Promise<void> {
    // Update lists, preview included
    this.previewPdfDocList = await this.getEditedPdfPreviewList(
      this.pdfDocList
    );

    // Create preview data URI
    if (this.previewPdfDocList.length > 0) {
      const pdfDoc = this.previewPdfDocList[this.index];
      this.preview = await pdfDoc.saveAsBase64({ dataUri: true });
    }
  }

  addMask(): void {
    const mask: mask = {
      id: `${(this.counter += 1)}`,
      color: rgb(1, 1, 1),
      height: 50,
      width: 170,
      x: 300,
      y: 635,
      documents: [],
    };

    this.masks.push(mask);
    // eslint-disable-next-line no-self-assign
    this.masks = this.masks;
  }

  removeMask(id: string): void {
    const index = this.masks.findIndex((mask) => mask.id === id);
    this.masks.splice(index, 1);
    // eslint-disable-next-line no-self-assign
    this.masks = this.masks;
  }

  async getPdfList(files: File[]): Promise<PDFDocument[]> {
    const pdfList: PDFDocument[] = [];

    // For each file, convert it to a PDF document
    for (let i = 0; i < files.length; i += 1) {
      pdfList.push(await fileToPdf(files[i]));
    }

    return pdfList;
  }

  async getEditedPdfPreviewList(
    pdfDocuments: PDFDocument[]
  ): Promise<PDFDocument[]> {
    return await getEditedPdfList(pdfDocuments, this.masks, true);
  }

  async save(): Promise<void> {
    const documents = await getEditedPdfList(
      this.pdfDocList,
      this.masks,
      false
    );
    const base64Documents: string[] = [];

    for (let i = 0; i < documents.length; i += 1) {
      base64Documents.push(await documents[i].saveAsBase64());
    }

    ipcRenderer.invoke("dialog:save", base64Documents);
  }

  mounted(): void {
    this.counter = Math.max(
      0,
      ...this.maskList.map((mask) => {
        return Number.isInteger(Number.parseInt(mask.id))
          ? Number.parseInt(mask.id)
          : 0;
      })
    );
  }

  @Watch("index", { immediate: true })
  onIndexChanged(): void {
    this.updatePreview();
  }

  @Watch("fileList", { immediate: true, deep: true })
  async onFileListChanged(): Promise<void> {
    this.pdfDocList = await this.getPdfList(this.fileList);
    this.updatePreview();
  }

  @Watch("masks", { immediate: true, deep: true })
  onMasksChanged(): void {
    this.updatePreview();
    // eslint-disable-next-line no-self-assign
    this.masks = this.masks;
  }
}
</script>

<style scoped>
iframe {
  height: 100%;
  width: 100%;
  border: none;
}

#left-pane {
  width: 17rem;
  max-height: 100vh !important;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

#preview {
  background-color: #414447;
}

.scroll-content {
  flex: 1 1 auto;
  overflow: auto;
}

.scroll-container {
  display: flex;
  flex-direction: column;
}
</style>
