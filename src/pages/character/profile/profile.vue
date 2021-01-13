<template>
  <view class="chara-profile">
    <chara-list-item class="char-list" :chara-list="getCharaData.charaBase" :show-positioning="false"> </chara-list-item>
    <view></view>
    <view class="chara-profile-main">
      
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import charaListItem from "@/components/character/chara-list-item.vue";

@Component({
  name: "profile",
  computed: { ...mapGetters(["getLevel","getRank","getUniqueEquipmentLevel","getCharaData","getCharaStatus"]) },
  components: { charaListItem },
})
export default class extends Vue {
  private unit_id: number = 0;

  public onLoad(option: any): void {
    this.unit_id = +option.unit_id;
  }

}
</script>
<style lang="scss" scoped></style>
