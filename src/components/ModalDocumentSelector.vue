<template>
  <div>
    <b-form-checkbox v-model="syncedDocument.applyMask">
      {{ syncedDocument.name }}
    </b-form-checkbox>
    <div>
      <ModalPageSelector
        v-for="(page, index) in syncedDocument.pages"
        :key="page.name"
        :page.sync="syncedDocument.pages[index]"
        @updated="onPageUpdated"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, PropSync, Vue, Watch } from "vue-property-decorator";
import { BModal, BFormCheckbox } from "bootstrap-vue";
import { documentToApplyMasksTo } from "@/types/mask";
import ModalPageSelector from "./ModalPageSelector.vue";

@Component({ components: { BModal, BFormCheckbox, ModalPageSelector } })
export default class ModalDocumentSelector extends Vue {
  @PropSync("document", { type: Object, required: true })
  syncedDocument!: documentToApplyMasksTo;

  onPageUpdated(): void {
    //
  }

  @Watch("syncedDocument.applyMask", { immediate: true })
  onApplyMaskChanged(value: boolean, old: boolean): void {
    // If document has been unchecked
    if (old && !value) {
      this.syncedDocument.pages.forEach((page) => (page.applyMask = false));
    }

    // If document has been checked
    if (!old && value) {
      this.syncedDocument.pages.forEach((page) => (page.applyMask = true));
    }
  }
}
</script>
