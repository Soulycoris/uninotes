<template>
  <view class="chara-base" v-if="charaBase.unitRarity">
    <view class="chara-img">
      <img
        :src="
          `http://localhost:3000/redive/estertion/card/full/${
            charaBase.unitRarity.length === 6
              ? charaBase.charaBase[0].prefab_id + 60
              : charaBase.charaBase[0].prefab_id + 30
          }`
        "
        alt=""
        srcset=""
      />
    </view>
    <chara-list-item
      :charaList="charaBase.charaBase || []"
      @on-click="charaBaseTo"
    >
    </chara-list-item>
    <view class="chara-state">
      <view class="chara-state-box chara-state-level">
        <view class="chara-tag">状态参数</view>
        <view class="chara-level">Lv178&nbsp;&nbsp;&nbsp;&nbsp;Rank18</view>
      </view>
      <view class="chara-state-box">
        <view>
          通常攻击待机时间：{{ charaBase.charaBase[0].normal_atk_cast_time }}s
        </view>
      </view>
      <view class="chara-state-box">
        <view class="chara-state-item">
          <view class="chara-state-item-tag">物理攻击力</view>
          <view class="chara-state-item-text">52</view>
        </view>
        <view class="chara-state-item">
          <view class="chara-state-item-tag">魔法攻击力</view>
          <view class="chara-state-item-text">52</view>
        </view>
      </view>
      <view class="chara-state-box">
        <view>
          *上记的状态参数为☆MAX，装备，专用装备最大强化，且包含羁绊剧情和Ex技能的值。
        </view>
      </view>
      <template v-for="(pattern, index) in charaBase.unitAttackPattern">
        <view class="chara-state-box" :key="pattern.pattern_id + index">
          <view class="chara-tag">
            技能循环
            {{ charaBase.unitAttackPattern.length > 1 ? index + 1 : '' }}
          </view>
        </view>
        <view
          class="chara-state-box"
          :key="pattern.pattern_id + index + 'loop'"
        >
          <view class="chara-state-skill-loop">
            <view
              class="chara-state-skill-loop-item"
              v-for="item in pattern.loop_end"
              :key="'pattern' + item"
            >
              <view>
                {{ item | filterLoopTopText(pattern) }}
              </view>
              <img
                :src="
                  `http://localhost:3000/redive/estertion/icon/skill/${skillType(
                    item,
                    pattern
                  )}`
                "
                alt=""
              />
              <view>
                {{ item | filterLoopBottomText(pattern) }}
              </view>
            </view>
          </view>
        </view>
      </template>

      <template v-for="skill in charaBase.skillData">
        <view class="chara-state-box" :key="skill.skill_id + 'tag'">
          <view class="chara-tag">{{ filterSkill(skill.skill_id) }}</view>
        </view>
        <view class="chara-state-box" :key="skill.skill_id">
          <view class="chara-state-skill">
            <img
              :src="
                `http://localhost:3000/redive/estertion/icon/skill/${skill.icon_type}`
              "
              alt=""
            />
          </view>
          <view class="chara-state-skill-name">
            <view class="chara-state-skill-name-text">
              {{ skill.name }}
            </view>
            <view> 待机时间： {{ skill.skill_cast_time }}s </view>
          </view>
        </view>
        <view class="chara-state-box" :key="skill.skill_id + 'desc'">
          <view>
            {{ skill.description }}
          </view>
        </view>
        <view class="chara-state-skill-action" :key="skill.skill_id + 'action'">
          <view>
            技能动作
          </view>
          <view
            v-for="(item, index) in skill.actionDataArr || []"
            :key="item.action_id"
          >
            {{ index + 1 }}. {{ item.description }}
          </view>
        </view>
      </template>
    </view>
  </view>
</template>
<script>
import charaListItem from '../components/chara-list-item.vue';
export default {
  name: 'chara-base',
  data() {
    return {
      title: 'Hello',
      unit_id: '',
      charaBase: {},
    };
  },
  filters: {
    filterLoopTopText(value, pattern) {
      if (value == pattern.loop_start) {
        return '循环开始';
      } else if (value == pattern.loop_end) {
        return '循环结束';
      }
      return '\u00a0';
    },
    filterLoopBottomText(index, pattern) {
      let atk_type = pattern[`atk_pattern_${index}`];
      let text = '';
      switch (atk_type) {
        case 1:
          text = '普通攻击';
          break;
        case 1001:
          text = 'Main 1';
          break;
        case 1002:
          text = 'Main 2';
          break;
        case 2001:
          text = 'SP 1';
          break;
        case 2002:
          text = 'SP 2';
          break;
        case 2003:
          text = 'SP 3';
          break;
        default:
          text = '\u00a0';
          break;
      }
      return text;
    },
  },
  computed: {
    computedLoop() {
      if (!this.charaBase.charaBase) {
        return 0;
      }
      return this.charaBase.unitAttackPattern.loop_end;
    },
  },
  onLoad(option) {
    // this.unit_id = option.unit_id;
    this.getCharaBase(option.unit_id);
  },
  // onReady() {
  //   this.getCharaBase(this.unit_id);
  // },
  components: { charaListItem },
  methods: {
    getCharaBase(unitId) {
      uni.request({
        url: 'http://localhost:3000/get/unit_data/base/' + unitId,
        success: (res) => {
          this.charaBase = res.data;
          this.skillActionInit();
        },
      });
    },
    skillActionInit() {
      this.charaBase.skillData.forEach((element) => {
        let actionArr = [],
          actionDataArr = [];
        for (const key in element) {
          if (/action_/.test(key) && element[key]) {
            actionArr.push(element[key]);
          }
        }
        actionArr.forEach((element) => {
          for (
            let index = 0;
            index < this.charaBase.skillAction.length;
            index++
          ) {
            const ele = this.charaBase.skillAction[index];
            if (ele.action_id === element) {
              actionDataArr.push(ele);
            }
          }
        });
        element.actionDataArr = actionDataArr;
        // console.log(actionDataArr);
      });
    },
    charaBaseTo() {},
    skillType(index, pattern) {
      let skill_id = 0;
      let icon_type = 1003;
      switch (pattern[`atk_pattern_${index}`]) {
        case 1001:
          skill_id = this.charaBase.unitSkillData[0].main_skill_1;
          break;
        case 1002:
          skill_id = this.charaBase.unitSkillData[0].main_skill_2;
          break;
        case 2001:
          skill_id = this.charaBase.unitSkillData[0].sp_skill_1;
          break;
        case 2002:
          skill_id = this.charaBase.unitSkillData[0].sp_skill_2;
          break;
        case 2003:
          skill_id = this.charaBase.unitSkillData[0].sp_skill_3;
          break;
        case 1:
          icon_type =
            this.charaBase.charaBase[0].atk_type === 1 ? 101011 : 101251;
          break;

        default:
          break;
      }

      for (let index = 0; index < this.charaBase.skillData.length; index++) {
        const element = this.charaBase.skillData[index];
        if (element.skill_id == skill_id && skill_id) {
          icon_type = element.icon_type;
          break;
        }
      }
      return icon_type;
    },
    filterSkill(skill_id) {
      let skillKey = '',
        text = '';
      for (const key in this.charaBase.unitSkillData[0]) {
        if (skill_id === this.charaBase.unitSkillData[0][key]) {
          skillKey = key;
        }
      }
      // console.log(skillKey);
      switch (skillKey) {
        case 'union_burst':
          text = 'UB';
          break;
        case 'union_burst_evolution':
          text = 'UB+';
          break;
        case 'main_skill_1':
          text = 'Main 1';
          break;
        case 'main_skill_evolution_1':
          text = 'Main 1+';
          break;
        case 'main_skill_2':
          text = 'Main 2';
          break;
        case 'sp_skill_1':
          text = 'SP 1';
          break;
        case 'sp_skill_2':
          text = 'SP 2';
          break;
        case 'sp_skill_3':
          text = 'SP 3';
          break;
        case 'ex_skill_1':
          text = 'EX';
          break;
        case 'ex_skill_evolution_1':
          text = 'EX+';
          break;
        default:
          text = 'EX';
          break;
      }
      return text;
    },
  },
};
</script>
<style lang="scss" scoped>
.chara-base {
  .chara-img {
    img {
      max-width: 100%;
    }
  }
  .chara-state {
    padding: 8px;
    border-top: 2px #303030;
    font-size: 14px;
    .chara-tag {
      display: inline;
      border-radius: 4px;
      padding: 0 9rpx 6rpx 9rpx;
      color: #fff;
      background-color: #773f99;
    }
    .chara-level {
      font-size: 14px;
    }
  }
  .chara-state-level {
    justify-content: space-between;
  }
  .chara-state-box {
    display: flex;
    align-items: center;
    // justify-content: space-between;
    margin-bottom: 20rpx;
    .chara-state-item {
      display: flex;
      justify-content: space-between;
      flex: 1;
      border-bottom: 1px solid #525252;
      &:first-child {
        margin-right: 8rpx;
      }
      &:last-child {
        margin-left: 8rpx;
      }
      .chara-state-item-tag {
        background-color: #525252;
        padding: 0 4rpx;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
    }
    .chara-state-skill-loop {
      display: flex;
      flex-wrap: wrap;
      .chara-state-skill-loop-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 8px;
        margin-right: 14rpx;
        margin-bottom: 14rpx;
        img {
          width: 105rpx;
          margin: 2px 0;
        }
      }
    }
    .chara-state-skill {
      img {
        width: 105rpx;
      }
    }

    .chara-state-skill-name {
      display: flex;
      flex-direction: column;
      padding: 0 8px;
      .chara-state-skill-name-text {
        margin-bottom: 18rpx;
      }
    }
  }
  .chara-state-skill-action {
    margin-bottom: 36rpx;
  }
}
</style>
