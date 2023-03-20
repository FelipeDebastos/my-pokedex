<template>
  <div id="app" class="container">
    <v-img
      src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg"
      height="300"
      width="600"
    />
    <pokemon-list />
  </div>
</template>
 
<script>
import PokemonList from "../components/PokemonList.vue";
import { VImg } from "vuetify/components";

export default {
  name: "PokemonDetails",
  components: {
    PokemonList,
    VImg,
  },
};
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
