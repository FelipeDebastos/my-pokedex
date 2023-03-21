<template>
  <v-text-field
    :value="value"
    :label="label"
    @input="$emit('input', $event)"
    solo
    placeholder="Pokemon"
    clearable
    clear-icon="mdi-close-circle-outline"
    append-icon="mdi-magnify"
  />
</template>
  
  <script>
import { VTextField } from "vuetify/components";
export default {
  name: "TextField",
  props: {
    value: String,
    label: String,
  },
  components: {
    VTextField,
  },
};
</script>
  