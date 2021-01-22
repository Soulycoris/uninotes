<template>
  <view class="chara-profile">
    <chara-list-item class="char-list" :chara-list="getCharaData.charaBase" :show-positioning="false"> </chara-list-item>
    <view class="line"></view>
    <view class="chara-pro-main">
      <view class="chara-pro-area">
        <view class="chara-state-box">{{ getCharaBase.catch_copy }}</view>
        <view class="chara-state-box">个人情报</view>
        <view class="chara-state-box">
          <view class="chara-state-status">
            <view class="chara-state-item" v-for="item in ['height', 'weight', 'age']" :key="item">
              <view class="chara-state-item-tag">{{ $t(`character.charaBase.${item}`) }}</view>
              <view class="chara-state-item-text">{{ getCharaBase[item] }}</view>
            </view>
            <view class="chara-state-item">
              <view class="chara-state-item-tag">{{ $t(`character.charaBase.birth`) }}</view>
              <view class="chara-state-item-text">{{ $t(`character.charaBase.birth_month`, { msg: getCharaBase.birth_month }) }}{{ $t(`character.charaBase.birth_day`, { msg: getCharaBase.birth_day }) }}</view>
            </view>
            <view class="chara-state-item" v-for="item in ['blood_type', 'race']" :key="item">
              <view class="chara-state-item-tag">{{ $t(`character.charaBase.${item}`) }}</view>
              <view class="chara-state-item-text">{{ getCharaBase[item] }}</view>
            </view>
            <view class="chara-state-item chara-state-item-full" v-for="item in ['guild', 'voice', 'favorite']" :key="item">
              <view class="chara-state-item-tag">{{ $t(`character.charaBase.${item}`) }}</view>
              <view class="chara-state-item-text">{{ getCharaBase[item] }}</view>
            </view>
          </view>
        </view>
        <view class="chara-state-box">{{ getCharaBase.self_text }}</view>
      </view>
      <view class="chara-pro-area">
        <view class="chara-state-box">
          <view class="chara-tag">专用装备</view>
        </view>
        <view class="chara-state-box">
          <view class="chara-unique-equipment">
            <view class="chara-unique-equipment-img">
              <img v-if="getCharaData.uniqueEquipment.length" :src="`${$hostConfig.resUrl}/icon/equipment/${getCharaData.uniqueEquipment[0].equipment_id}`" alt="" />
              <img v-else :src="`${$hostConfig.resUrl}/icon/equipment/999999`" alt="" />
            </view>
            <view class="chara-unique-equipment-text">{{ !getCharaData.uniqueEquipment.length ? "暂无专属装备" : getCharaData.uniqueEquipment[0].equipment_name }}</view>
          </view>
        </view>
      </view>
      <view class="chara-pro-area" v-for="promotion in getCharaData.charaPromotion" :key="promotion.promotion_level">
        <view class="chara-state-box">
          <view class="chara-tag">R{{ promotion.promotion_level }}</view>
        </view>
        <view class="chara-state-box">
          <view class="chara-equipment">
            <view class="chara-equipment-img">
              <template v-for="index in 6">
                <img :key="index" v-if="promotion[`equip_slot_${index}`] !== 999999" :src="`${$hostConfig.resUrl}/icon/equipment/${promotion[`equip_slot_${index}`]}`" alt="" />
                <img :key="index" v-else :src="`${$hostConfig.resUrl}/icon/equipment/999999`" alt="" />
              </template>
            </view>
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
      padding: 16rpx 12rpx;
      font-size: $uni-font-size-base;
      background-color: #292929;
    }
    .chara-unique-equipment {
      width: 100%;
      display: flex;
      align-items: center;
      .chara-unique-equipment-img {
        width: 100rpx;
        height: 100rpx;
        margin-right: 32rpx;
        img {
          max-width: 100%;
          height: auto;
        }
      }
    }
    .chara-equipment {
      width: 100%;
      .chara-equipment-img {
        display: flex;
        align-items: center;
        justify-content: space-between;
        img {
          max-width: 100rpx;
          height: auto;
        }
      }
    }
  }
}
</style>
