<template>
  <view class="chara-profile">
    <!-- <chara-list-item class="char-list" :chara-list="getCharaData.charaBase" :show-positioning="false"> </chara-list-item> -->
    <view class="line"></view>
    <view class="chara-pro-main">
      <view class="chara-pro-area">
        <view>{{ getCharaBase.catch_copy }}</view>
        <view class="chara-state-status">个人情报</view>
        <view class="chara-state-status">
          <view class="chara-state-item">
            <view class="chara-state-item-tag">{{ $t(`character.charaBase.height`) }}</view>
            <view class="chara-state-item-text">{{ getCharaBase.height }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import charaListItem from "@/components/character/chara-list-item.vue";

@Component({
  name: "profile",
  computed: {
    ...mapGetters(["getLevel", "getRank", "getUniqueEquipmentLevel", "getCharaData", "getCharaBase", "getCharaStatus"]),
  },
  components: { charaListItem },
})
export default class extends Vue {
  private unit_id: number = 0;

  public onLoad(option: any): void {
    this.unit_id = +option.unit_id;
  }
}
</script>
<style lang="scss" scoped>
.line {
  height: 1px;
  background-color: #333;
}
.chara-profile {
  .chara-pro-main {
    .chara-pro-area {
      margin: 16rpx;
      border-radius: 4px;
      font-size: $uni-font-size-base;
      background-color: #292929;
      .chara-state-status {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-top: 16rpx;
      }
      .chara-state-item {
        display: flex;
        justify-content: space-between;
        width: 48%;
        margin-top: 16rpx;
        border-bottom: 1px solid #525252;
        .chara-state-item-tag {
          background-color: #525252;
          padding: 1rpx 6rpx 1rpx 6rpx;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }
      }
    }
  }
}
</style>
