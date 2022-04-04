<template>
  <div class="shadow-sm border p-2 bg-light rounded-lg">
    <div class="mb-1 row no-gutters justify-content-between">
      <div class="col-auto">Masque {{ syncedConfig.id }}</div>
      <div class="col-auto">
        <a
          href="#"
          class="text-danger"
          @click.prevent="$emit('delete', syncedConfig.id)"
        >
          <font-awesome-icon :icon="faMinusCircle" />
        </a>
      </div>
    </div>
    <div class="form-row">
      <div class="col-6">
        <b-form-group label="x :" label-cols="auto" label-size="sm">
          <b-form-input
            v-model.number="syncedConfig.x"
            type="number"
            :debounce="debounce"
            size="sm"
          />
        </b-form-group>
      </div>
      <div class="col-6">
        <b-form-group label="y :" label-cols="auto" label-size="sm">
          <b-form-input
            v-model.number="syncedConfig.y"
            type="number"
            :debounce="debounce"
            size="sm"
          />
        </b-form-group>
      </div>
      <div class="col-6">
        <b-form-group label="h :" label-cols="auto" label-size="sm">
          <b-form-input
            v-model.number="syncedConfig.height"
            type="number"
            :debounce="debounce"
            size="sm"
          />
        </b-form-group>
      </div>
      <div class="col-6">
        <b-form-group label="l :" label-cols="auto" label-size="sm">
          <b-form-input
            v-model.number="syncedConfig.width"
            type="number"
            :debounce="debounce"
            size="sm"
          />
        </b-form-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PDFDocument } from "pdf-lib";
import { Component, Prop, PropSync, Vue, Watch } from "vue-property-decorator";
import { documentToApplyMasksTo, mask, pageToApplyMasksTo } from "@/types/mask";
import { BFormInput, BFormGroup } from "bootstrap-vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faMinusCircle } from "@fortawesome/pro-duotone-svg-icons";

@Component({
  components: {
    BFormGroup,
    BFormInput,
    FontAwesomeIcon,
  },
})
export default class MaskConfigurator extends Vue {
  @PropSync("config", { type: Object }) syncedConfig!: mask;
  @Prop({ type: Array }) documents!: PDFDocument[];

  debounce = 500;
  faMinusCircle = faMinusCircle;

  async initConfigDocuments(): Promise<void> {
    this.syncedConfig.documents = [];

    // For each document in the config
    for (let i = 0; i < this.documents.length; i += 1) {
      const pdf = await PDFDocument.load(await this.documents[i].save());
      const pages = pdf.getPages();

      // Add pages config
      pages.forEach((page, index) => {
        Object.assign(page, {
          name: `${index + 1}`,
          applyMask: true,
        } as pageToApplyMasksTo);
      });

      // Add the configured document
      this.syncedConfig.documents.push(
        Object.assign(pdf, {
          pages: pages,
          name: `${i + 1}`,
        } as documentToApplyMasksTo)
      );
    }
  }

  async created(): Promise<void> {
    this.initConfigDocuments();
  }

  @Watch("documents", { immediate: true, deep: true })
  onDocumentChanged(): void {
    // this.initConfigDocuments();
  }
}
</script>
