<template>
  <div>
    <b-form-checkbox v-model="syncedDocument.applyMask">
      {{ syncedDocument.name }}
    </b-form-checkbox>
    <div class="pl-4">
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

  get atLeastOneChecked(): boolean {
    let atLeastOneChecked = false;

    this.syncedDocument.pages.forEach((page) => {
      if (page.applyMask) {
        atLeastOneChecked = true;
      }
    });

    return atLeastOneChecked;
  }

  onPageUpdated(): void {
    this.syncedDocument.applyMask = this.atLeastOneChecked;
  }

  @Watch("syncedDocument.applyMask", { immediate: false })
  onApplyMaskChanged(value: boolean): void {
    // If document has been unchecked
    if (!value) {
      this.syncedDocument.pages.forEach((page) => (page.applyMask = false));
    }

    // If document has been checked
    if (value && !this.atLeastOneChecked) {
      this.syncedDocument.pages.forEach((page) => (page.applyMask = true));
    }
  }
}
</script>
