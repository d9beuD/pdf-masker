<template>
  <div class="row h-100 no-gutters">
    <div class="col-md-3 col-xl-2 h-100 border-right p-2">
      <b-form-group label="Choisir un PDF :">
        <b-form-file v-model="pdfList" multiple accept=".pdf"></b-form-file>
      </b-form-group>
      <b-button-group>
        <b-button :disabled="index <= 0" @click="index -= 1">-</b-button>
        <b-button disabled>{{ index + 1 }}</b-button>
        <b-button :disabled="index >= pdfList.length - 1" @click="index += 1">
          +
        </b-button>
      </b-button-group>
    </div>
    <div class="col">
      <div class="h-100" v-for="pdf in pdfList" :key="pdf.name">
        <template v-if="pdfList.length > 0">
          <iframe id="pdf" :src="lastData"></iframe>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { BFormFile, BFormGroup, BButtonGroup, BButton } from "bootstrap-vue";
import { pdfToObjectUrl } from "@/utils/file";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";

@Component({
  components: {
    BButton,
    BButtonGroup,
    BFormFile,
    BFormGroup,
  },
})
export default class PDFEditor extends Vue {
  pdfList: File[] = [];
  index = 0;
  lastData = "";

  get uri(): string {
    return pdfToObjectUrl(this.pdfList[this.index]);
  }

  async listChanged(): Promise<string | void> {
    const buffer = await this.pdfList[this.index].arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer);

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize();

    // Draw a string of text diagonally across the first page
    firstPage.drawRectangle({
      x: 200,
      y: height / 2 + 300,
      color: rgb(1, 1, 1),
    });

    return (this.lastData = await pdfDoc.saveAsBase64({ dataUri: true }));
  }

  @Watch("uri", { immediate: true })
  onUriChanged(): void {
    this.listChanged();
  }

  @Watch("index", { immediate: true })
  onIndexChanged(): void {
    this.listChanged();
  }

  @Watch("pdfList", { immediate: true })
  onListChanged(): void {
    this.listChanged();
  }
}
</script>

<style scoped>
iframe {
  height: 100%;
  width: 100%;
  border: none;
}
</style>
