<template>
  <b-modal ref="modal" :id="id" :title="title" centered scrollable>
    <div
      v-for="(document, index) in documents"
      :key="document.name"
      class="mb-2"
    >
      <ModalDocumentSelector :document.sync="documents[index]" />
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { BModal, BFormCheckbox } from "bootstrap-vue";
import { documentToApplyMasksTo } from "@/types/mask";
import ModalDocumentSelector from "./ModalDocumentSelector.vue";

@Component({ components: { BModal, BFormCheckbox, ModalDocumentSelector } })
export default class ModalMask extends Vue {
  @Prop({ type: String, required: true }) id!: string;
  @Prop({ type: Array, required: true }) documents!: documentToApplyMasksTo[];
  @Prop({ type: String, required: true }) maskName!: string;

  get title(): string {
    return "Sélection des pages - Masque " + this.maskName;
  }
}
</script>
