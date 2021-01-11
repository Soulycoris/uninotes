<template>
  <view class="character">
    <!-- <uni-search-bar bgColor="#313131" @confirm="search" @input="searchInput" cancelButton="false"></uni-search-bar> -->
    <view class="fitter-bar">
      <uni-combox label="类型" :candidates="fitterArray.type" v-model="fitterActive.type"></uni-combox>
      <uni-combox label="位置" :candidates="fitterArray.position" v-model="fitterActive.position"></uni-combox>
      <uni-combox label="排序" :candidates="fitterArray.sort" v-model="fitterActive.sort"></uni-combox>
    </view>
    <chara-list-item class="char-list" :charaList="fitterCharaBase" :sort="fitterActive.sort" @on-click="charaBaseTo"> </chara-list-item>
  </view>
</template>
<script lang="ts">
// import Vue from "vue";
import uniSearchBar from "@dcloudio/uni-ui/lib/uni-search-bar/uni-search-bar.vue";
import uniCombox from "@/components/uni-combox/uni-combox.vue";
import charaListItem from "./components/chara-list-item.vue";
interface ComplexMessage {
  title: string;
  okMessage: string;
  cancelMessage: string;
}
interface fitterActive {
  position: number;
  type: number;
  sort: sort | "";
}
type sort = "" | "height" | "age" | "weight";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  name: "Character",
  components: { uniSearchBar, uniCombox, charaListItem },
})
export default class extends Vue {
  private charaList: charaBase[] = [];
  private searchInput: string = "";
  private fitterArray = {
    type: [
      { key: 0, value: "全部" },
      { key: 1, value: "物理" },
      { key: 2, value: "魔法" },
    ],
    position: [
      { key: 0, value: "全部" },
      { key: 300, value: "前卫" },
      { key: 600, value: "中卫" },
      { key: 900, value: "后卫" },
    ],
    sort: [
      { key: "", value: "全部" },
      { key: "height", value: "身高" },
      { key: "age", value: "年龄" },
      { key: "weight", value: "体重" },
    ],
  };
  private fitterActive: fitterActive = {
    position: 0,
    type: 0,
    sort: "",
  };

  public get fitterCharaBase() {
    let arr = this.charaList.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
    if (this.fitterActive.type) {
      arr = arr.filter((e) => e.atk_type === this.fitterActive.type);
    }
    if (this.fitterActive.position) {
      arr = arr.filter((e) => e.search_area_width < this.fitterActive.position && e.search_area_width > this.fitterActive.position - 300);
    }
    if (this.fitterActive.sort) {
      arr = arr.sort((a, b) => {
        if (this.fitterActive.sort) {
          return +a[this.fitterActive.sort] - +b[this.fitterActive.sort];
        }
        return 0
      });
    }
    return arr;
  }

  public mounted() {
    this.getCharaBase();
  }

  public getCharaBase(): void {
    uni.request({
      url: "http://localhost:3000/get/unit_data/list",
      success: (res) => {
        if (Array.isArray(res.data)) {
          this.charaList = res.data;
        }
      },
    });
  }

  public charaBaseTo(unitid: Number): void {
    uni.navigateTo({
      url: `/pages/character/base/base?unit_id=${unitid}`,
    });
  }
}
</script>
<style lang="scss">
.character {
  background-color: #202020;
}
.uni-searchbar {
  background-color: #202020;
}
.fitter-bar {
  display: flex;
  justify-content: space-around;
  box-shadow: #373737 1px 1px 1px;
}
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
    background: url("/static/img/AtlasCommon.png") no-repeat;
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
