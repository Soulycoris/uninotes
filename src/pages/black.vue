<template>
  <view>{{ title }}</view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "class",
})
export default class extends Vue {
  private title: string = "Hello";
}
</script>
<style lang="scss" scoped></style>
