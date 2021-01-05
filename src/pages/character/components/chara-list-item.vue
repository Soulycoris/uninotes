<template>
  <view>
    <view
      class="char-list-item"
      v-for="item in charaList"
      :key="item.unit_id"
      :data-unitId="item.unit_id"
      @click="charaBaseTo(item.unit_id)"
    >
      <view
        class="item-icon"
        :class="computedClassPositioning(item.search_area_width)"
      >
      </view>
      <view class="item-head-img">
        <img
          :src="
            `http://localhost:3000/redive/estertion/icon/unit/${
              item.rarity === 6 ? item.prefab_id + 60 : item.prefab_id + 30
            }`
          "
          alt=""
          srcset=""
        />
      </view>
      <view class="item-name">
        <view class="item-jpn">{{ item.unit_name }}</view>
        <view class="item-cnn">
          {{ item.actual_name || item.unit_name }}
        </view>
      </view>
      <view class="item-other">
        <text v-if="sort">{{ item[sort] || '' }}</text>
        <view slot v-else></view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    charaList: {
      type: Array,
      default() {
        return [];
      },
    },
    sort: {
      type: String,
      default() {
        return '';
      },
    },
  },
  data() {
    return {
      title: 'Hello',
    };
  },
  methods: {
    charaBaseTo(unitid) {
      this.$emit('on-click', unitid);
    },
    computedClassPositioning(width) {
      if (width <= 300) {
        return 'type1';
      } else if (width <= 600) {
        return 'type2';
      } else {
        return 'type3';
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.char-list-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px;
  &:hover {
    background-color: #373737;
  }
  .item-icon {
    width: 40rpx;
    height: 40rpx;
    background: url('/static/img/AtlasCommon.png') no-repeat;
    background-size: cover;
    margin-right: 20rpx;
    &.type1 {
      background-position-x: 0;
    }
    &.type2 {
      background-position-x: -40rpx;
    }
    &.type3 {
      background-position-x: -80rpx;
    }
  }
  .item-head-img {
    width: 134rpx;
    margin-right: 16px;
    img {
      width: 100%;
    }
  }
  .item-name {
    height: auto;
    display: flex;
    flex-direction: column;
    max-width: 80vw;
    .item-jpn {
      font-size: 15px;
      padding: 8px 0;
    }
    .item-cnn {
      font-size: 12px;
      padding: 8px 0;
    }
  }
  .item-other {
    position: absolute;
    right: 0;
    padding-right: 16px;
  }
}
</style>
