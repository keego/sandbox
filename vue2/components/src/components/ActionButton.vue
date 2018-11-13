<template>
  <div>
    <div>
      saving to cloud
    </div>
    <div>
      Save
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ActionButton extends Vue {
  @Prop() private msg!: string;
}
</script>

<style scoped>
.loading {

}
</style>
