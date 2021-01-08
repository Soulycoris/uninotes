<template>
  <view class="chara-base" v-if="charaBase.unitRarity">
    <view class="chara-img">
      <img :src="`http://localhost:3000/redive/estertion/card/full/${charaBase.unitRarity.length === 6 ? charaBase.charaBase[0].prefab_id + 60 : charaBase.charaBase[0].prefab_id + 30}`" alt="" srcset="" />
    </view>
    <chara-list-item :charaList="charaBase.charaBase || []" @on-click="charaBaseTo"> </chara-list-item>
    <view class="chara-state">
      <view class="chara-state-box chara-state-level">
        <view class="chara-tag">状态参数</view>
        <view class="chara-level">Lv {{ level }}&nbsp;&nbsp;&nbsp;&nbsp;Rank {{ rank }}</view>
      </view>
      <view class="chara-state-box">
        <view> 通常攻击待机时间：{{ charaBase.charaBase[0].normal_atk_cast_time }}s </view>
      </view>
      <view class="chara-state-box">
        <view class="chara-state-status">
          <view class="chara-state-item" v-for="(value, name) in unitStatus" :key="name">
            <view class="chara-state-item-tag">{{name | stateText}}</view>
            <view class="chara-state-item-text">{{value}}</view>
          </view>
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
            {{ charaBase.unitAttackPattern.length > 1 ? index + 1 : "" }}
          </view>
        </view>
        <view class="chara-state-box" :key="pattern.pattern_id + index + 'loop'">
          <view class="chara-state-skill-loop">
            <view class="chara-state-skill-loop-item" v-for="item in pattern.loop_end" :key="'pattern' + item">
              <view>
                {{ item | filterLoopTopText(pattern) }}
              </view>
              <img :src="`http://localhost:3000/redive/estertion/icon/skill/${skillType(item, pattern)}`" alt="" />
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
        <view class="chara-state-box" :key="skill.skill_id + 'name'">
          <view class="chara-state-skill">
            <img :src="`http://localhost:3000/redive/estertion/icon/skill/${skill.icon_type}`" alt="" />
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
          <view v-for="(item, index) in skill.actionDataArr || []" :key="index+'des'"> {{ index + 1 }}. {{ item.description }} </view>
        </view>
      </template>
    </view>
  </view>
</template>
<script>
import charaListItem from "../components/chara-list-item.vue";
export default {
  name: "chara-base",
  data() {
    return {
      title: "Hello",
      unit_id: "",
      level: 184,
      rank: 19,
      uniqueEquipmentLevel: 189,
      charaBase: {},
      unitStatus: {
        atk: 0,
        def: 0,
        magic_str: 0,
        magic_def: 0,
        physical_critical: 0,
        magic_critical: 0,
        hp: 0,
        life_steal: 0,
        energy_recovery_rate: 0,
        energy_reduce_rate: 0,
        accuracy: 0,
        dodge: 0,
        wave_hp_recovery: 0,
        wave_energy_recovery: 0,
        magic_penetrate: 0,
        physical_penetrate: 0,
        hp_recovery_rate: 0,
      },
    };
  },
  filters: {
    filterLoopTopText(value, pattern) {
      if (value == pattern.loop_start) {
        return "循环开始";
      } else if (value == pattern.loop_end) {
        return "循环结束";
      }
      return "\u00a0";
    },
    filterLoopBottomText(index, pattern) {
      let atk_type = pattern[`atk_pattern_${index}`];
      let text = "";
      switch (atk_type) {
        case 1:
          text = "普通攻击";
          break;
        case 1001:
          text = "Main 1";
          break;
        case 1002:
          text = "Main 2";
          break;
        case 2001:
          text = "SP 1";
          break;
        case 2002:
          text = "SP 2";
          break;
        case 2003:
          text = "SP 3";
          break;
        default:
          text = "\u00a0";
          break;
      }
      return text;
    },
    stateText(key){
      const stateText = {
        hp: 'HP',
        atk: '物理攻击',
        def: '物理防御',
        magic_str: '魔法攻击',
        magic_def: '魔法防御',
        physical_critical: '物理暴击',
        magic_critical: '魔法暴击',
        accuracy: '命中',
        dodge: '闪避',
        life_steal: '生命吸收',
        wave_hp_recovery: 'HP自动回复',
        wave_energy_recovery: 'TP自动回复',
        hp_recovery_rate: '回复量上升',
        energy_recovery_rate: 'TP上升',
        energy_reduce_rate: 'TP消耗减轻',
        magic_penetrate: '魔法穿透',
        physical_penetrate: '物理穿透',
      }
      return stateText[key] || ''
    }
  },
  computed: {
    // computedLoop() {
    //   if (!this.charaBase.charaBase) {
    //     return 0;
    //   }
    //   return this.charaBase.unitAttackPattern.loop_end;
    // },
  },
  onLoad(option) {
    this.unit_id = option.unit_id;
    this.getCharaBase(option.unit_id);
    this.getMaxLevel()
    this.getMaxUniqueEquipmentLevel()
  },
  // onReady() {
  //   this.getCharaBase(this.unit_id);
  // },
  components: { charaListItem },
  methods: {
    getMaxLevel() {
      uni.request({
        url: "http://localhost:3000/get/unit_data/maxLevel",
        success: (res) => {
          if (res.data) {
            this.level = --res.data;
          }
        },
      });
    },
    getMaxUniqueEquipmentLevel() {
      uni.request({
        url: "http://localhost:3000/get/unit_data/maxUniqueEquipmentLevel",
        success: (res) => {
          if (res.data) {
            this.uniqueEquipmentLevel = --res.data;
          }
        },
      });
    },
    getCharaBase(unitId) {
      uni.request({
        url: "http://localhost:3000/get/unit_data/base/" + unitId,
        success: (res) => {
          if (res.data) {
            this.charaBase = res.data;
            this.rank = this.charaBase.charaPromotionStatus[0].promotion_level;
            this.skillActionInit();
            this.stateInit();
          }
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
          for (let index = 0; index < this.charaBase.skillAction.length; index++) {
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
    stateInit() {
      this.charaBase.charaStoryStatus.forEach((element) => {
        for (let i = 1; i <= 5; i++) {
          const key = element["status_type_" + i];
          const value = +element["status_rate_" + i];
          switch (key) {
            case 1:
              this.unitStatus.hp += value;
              break;
            case 2:
              this.unitStatus.atk += value;
              break;
            case 3:
              this.unitStatus.def += value;
              break;
            case 4:
              this.unitStatus.magic_str += value;
              break;
            case 5:
              this.unitStatus.magic_def += value;
              break;
            case 6:
              this.unitStatus.physical_critical += value;
              break;
            case 7:
              this.unitStatus.magic_critical += value;
              break;
            case 8:
              this.unitStatus.dodge += value;
              break;
            case 9:
              this.unitStatus.life_steal += value;
              break;
            case 10:
              this.unitStatus.wave_hp_recovery += value;
              break;
            case 11:
              this.unitStatus.wave_energy_recovery += value;
              break;
            case 15:
              this.unitStatus.hp_recovery_rate += value;
              break;
            case 17:
              this.unitStatus.accuracy += value;
              break;
            default:
              break;
          }
        }
      });
      this.charaBase.equipments.forEach((e) => {
        for (const key in this.unitStatus) {
          this.unitStatus[key] += 2 * e[key];
        }
      });
      const unitRarity = this.charaBase.unitRarity[0];
      const charaPromotionStatus = this.charaBase.charaPromotionStatus[0];
      const uniqueEquipment = this.charaBase.uniqueEquipment[0]
      const uniqueEquipmentEnhance = this.charaBase.uniqueEquipmentEnhance[0]
      for (const key in this.unitStatus) {
        this.unitStatus[key] = Math.round(this.unitStatus[key] + charaPromotionStatus[key] + unitRarity[key] + unitRarity[`${key}_growth`] * (this.level + this.rank));
        if (uniqueEquipment) {
          this.unitStatus[key] += Math.ceil(uniqueEquipment[key] + uniqueEquipmentEnhance[key] * this.uniqueEquipmentLevel);
        }
      }


    },

    charaBaseTo() {},
    skillType(index, pattern) {
      let skill_id = 0;
      let icon_type = 1003;
      let unitSkillData = this.charaBase.unitSkillData[0];
      switch (pattern[`atk_pattern_${index}`]) {
        case 1001:
          skill_id = unitSkillData.main_skill_1;
          break;
        case 1002:
          skill_id = unitSkillData.main_skill_2;
          break;
        case 2001:
          skill_id = unitSkillData.sp_skill_1;
          break;
        case 2002:
          skill_id = unitSkillData.sp_skill_2;
          break;
        case 2003:
          skill_id = unitSkillData.sp_skill_3;
          break;
        case 1:
          icon_type = this.charaBase.charaBase[0].atk_type === 1 ? 101011 : 101251;
          break;
        default:
          break;
      }

      for (let index = 0, length = this.charaBase.skillData.length; index < length; index++) {
        const element = this.charaBase.skillData[index];
        if (element.skill_id == skill_id && skill_id) {
          icon_type = element.icon_type;
          break;
        }
      }
      return icon_type;
    },
    filterSkill(skill_id) {
      let skillKey = "",
        text = "";
      for (const key in this.charaBase.unitSkillData[0]) {
        if (skill_id === this.charaBase.unitSkillData[0][key]) {
          skillKey = key;
        }
      }
      // console.log(skillKey);
      switch (skillKey) {
        case "union_burst":
          text = "UB";
          break;
        case "union_burst_evolution":
          text = "UB+";
          break;
        case "main_skill_1":
          text = "Main 1";
          break;
        case "main_skill_evolution_1":
          text = "Main 1+";
          break;
        case "main_skill_2":
          text = "Main 2";
          break;
        case "sp_skill_1":
          text = "SP 1";
          break;
        case "sp_skill_2":
          text = "SP 2";
          break;
        case "sp_skill_3":
          text = "SP 3";
          break;
        case "sp_skill_evolution_1":
          text = "SP +";
          break;
        case "ex_skill_1":
          text = "EX";
          break;
        case "ex_skill_evolution_1":
          text = "EX+";
          break;
        default:
          text = "EX";
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
      padding: 1rpx 9rpx 6rpx 9rpx;
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
    .chara-state-status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
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
