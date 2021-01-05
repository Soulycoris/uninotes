<template>
  <view class="uni-combox" :style="comboxStyle" @click="toggleSelector">
    <view v-if="label" class="uni-combox__label" :style="labelStyle">
      <text>{{ label }}</text>
    </view>
    <view class="uni-combox__input-box">
      <text class="uni-combox__input">{{ inputVal }}</text>
    </view>
    <view class="uni-combox__selector" v-if="showSelector">
      <scroll-view scroll-y="true" class="uni-combox__selector-scroll">
        <view
          class="uni-combox__selector-item"
          v-for="(item, index) in candidates"
          :key="index"
          @click.stop="onSelectorClick(index)"
        >
          <text>{{ item.value }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
// import uniIcons from '../uni-icons/uni-icons.vue'
/**
 * Combox 组合输入框
 * @description 组合输入框一般用于既可以输入也可以选择的场景
 * @tutorial https://ext.dcloud.net.cn/plugin?id=1261
 * @property {String} label 左侧文字
 * @property {String} labelWidth 左侧内容宽度
 * @property {String} placeholder 输入框占位符
 * @property {Array} candidates 候选项列表
 * @property {String} emptyTips 筛选结果为空时显示的文字
 * @property {String} value 组合框的值
 */
export default {
  name: 'uniCombox',
  // components: {
  // 	uniIcons
  // },
  props: {
    label: {
      type: String,
      default: '',
    },
    comboxWidth: {
      type: String,
      default: 'auto',
    },
    labelWidth: {
      type: String,
      default: 'auto',
    },
    placeholder: {
      type: String,
      default: '',
    },
    candidates: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      showSelector: false,
      inputVal: '全部',
    };
  },
  computed: {
    comboxStyle() {
      if (this.comboxWidth === 'auto') {
        return {};
      }
      return {
        width: this.comboxWidth,
      };
    },
    labelStyle() {
      if (this.labelWidth === 'auto') {
        return {};
      }
      return {
        width: this.labelWidth,
      };
    },
  },
  methods: {
    toggleSelector() {
      this.showSelector = !this.showSelector;
    },
    onSelectorClick(index) {
      this.inputVal = this.candidates[index].value;
      this.showSelector = false;
      this.$emit('input', this.candidates[index].key);
    },
  },
};
</script>

<style lang="scss" scoped>
.uni-combox {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  height: 36px;
  flex-direction: row;
  align-items: center;
  // border-bottom: solid 1px #DDDDDD;
  position: relative;
}

.uni-combox__label {
  font-size: 16px;
  line-height: 22px;
  padding-right: 10px;
  color: #999999;
}

.uni-combox__input-box {
  position: relative;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex: 1;
  flex-direction: row;
  align-items: center;
}

.uni-combox__input {
  flex: 1;
  font-size: 16px;
  height: 22px;
  line-height: 22px;
}

.uni-combox__input-arrow {
  padding: 10px;
}

.uni-combox__selector {
  box-sizing: border-box;
  position: absolute;
  top: 42px;
  left: 0;
  width: 100%;
  background-color: #313131;
  border-radius: 6px;
  z-index: 2;
}

.uni-combox__selector-scroll {
  max-height: 200px;
  box-sizing: border-box;
}

.uni-combox__selector::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-bottom: solid 6px #313131;
  border-right: solid 6px transparent;
  border-left: solid 6px transparent;
  left: 50%;
  top: -6px;
  margin-left: -6px;
}

.uni-combox__selector-empty,
.uni-combox__selector-item {
  /* #ifdef APP-NVUE */
  display: flex;
  /* #endif */
  line-height: 36px;
  font-size: 14px;
  text-align: center;
  border-bottom: solid 1px #dddddd;
  margin: 0px 10px;
}

.uni-combox__selector-empty:last-child,
.uni-combox__selector-item:last-child {
  border-bottom: none;
}
</style>
