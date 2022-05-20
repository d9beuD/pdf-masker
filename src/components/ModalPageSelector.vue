<template>
  <b-form-checkbox v-model="syncedPage.applyMask">
    {{ syncedPage.name }}
  </b-form-checkbox>
</template>

<script lang="ts">
import { configurable } from "@/types/mask";
import { Component, PropSync, Vue, Watch } from "vue-property-decorator";
import { BFormCheckbox } from "bootstrap-vue";

@Component({ components: { BFormCheckbox } })
export default class ModalPageSelector extends Vue {
  @PropSync("page", { type: Object, required: true })
  syncedPage!: configurable;

  @Watch("syncedPage.applyMask")
  onApplyMaskChanged(): void {
    this.$nextTick(() => {
      this.$emit("updated");
    });
  }
}
</script>
