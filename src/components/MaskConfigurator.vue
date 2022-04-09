<template>
  <div class="shadow-sm border p-2 bg-light rounded-lg">
    <div class="mb-1 row no-gutters justify-content-between aling-items-center">
      <div class="col-auto small font-weight-bold">
        Masque {{ syncedConfig.id }}
      </div>
      <div class="col-auto">
        <a
          class="ml-2"
          href="#"
          title="Sélectionner les pages"
          @click.prevent
          v-b-modal="modalId"
          v-b-tooltip:app.window.hover.top
        >
          <font-awesome-icon :icon="faMemoCircleCheck" />
        </a>
        <a
          class="text-danger ml-2"
          href="#"
          title="Supprimer ce masque"
          @click.prevent="$emit('delete', syncedConfig.id)"
          v-b-tooltip:app.window.hover.top
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
    <PageSelectorModal
      :id="modalId"
      :documents="syncedConfig.documents"
      :maskName="syncedConfig.id"
    />
  </div>
</template>

<script lang="ts">
import { PDFDocument } from "pdf-lib";
import { Component, Prop, PropSync, Vue, Watch } from "vue-property-decorator";
import { mask } from "@/types/mask";
import { BFormInput, BFormGroup, VBModal, VBTooltip } from "bootstrap-vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faMemoCircleCheck,
  faMinusCircle,
} from "@fortawesome/pro-duotone-svg-icons";
import PageSelectorModal from "./PageSelectorModal.vue";
import uid from "@/utils/uid";

@Component({
  components: {
    BFormGroup,
    BFormInput,
    FontAwesomeIcon,
    PageSelectorModal,
  },
  directives: {
    "b-modal": VBModal,
    "b-tooltip": VBTooltip,
  },
})
export default class MaskConfigurator extends Vue {
  @PropSync("config", { type: Object }) syncedConfig!: mask;
  @Prop({ type: Array }) documents!: PDFDocument[];

  debounce = 500;

  faMemoCircleCheck = faMemoCircleCheck;
  faMinusCircle = faMinusCircle;

  get modalId(): string {
    return uid() + "page-selector-modal";
  }

  async initConfigDocuments(): Promise<void> {
    this.syncedConfig.documents = this.documents.map((document) => {
      return {
        applyMask: true,
        name: document.getTitle() as string,
        pages: document.getPages().map((page, index) => {
          return {
            name: `Page ${index + 1}`,
            applyMask: true,
          };
        }),
      };
    });
  }

  async created(): Promise<void> {
    this.initConfigDocuments();
  }

  @Watch("documents")
  onDocumentChanged(): void {
    this.initConfigDocuments();
  }
}
</script>
