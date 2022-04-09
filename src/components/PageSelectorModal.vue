<template>
  <b-modal ref="modal" :id="id" :title="title" centered scrollable>
    <div v-for="document in documents" :key="document.name" class="mb-2">
      <b-form-checkbox v-model="document.applyMask">
        {{ document.name }}
      </b-form-checkbox>
      <div v-for="page in document.pages" :key="page.name" class="pl-3">
        <b-form-checkbox v-model="page.applyMask">
          {{ page.name }}
        </b-form-checkbox>
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { BModal, BFormCheckbox } from "bootstrap-vue";
import { documentToApplyMasksTo } from "@/types/mask";

@Component({ components: { BModal, BFormCheckbox } })
export default class PageSelectorModal extends Vue {
  @Prop({ type: String, required: true }) id!: string;
  @Prop({ type: Array, required: true }) documents!: documentToApplyMasksTo[];
  @Prop({ type: String, required: true }) maskName!: string;

  get title(): string {
    return "Sélection des pages - Masque " + this.maskName;
  }
}
</script>
