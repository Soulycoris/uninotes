import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";

// @Module 标记当前为module
// module本身有几种可以配置的属性
// 1、namespaced:boolean 启/停用 分模块
// 2、stateFactory:boolean 状态工厂
// 3、dynamic:boolean 在store创建之后，再添加到store中。 开启dynamic之后必须提供下面的属性
// 4、name:string 指定模块名称
// 5、store:Vuex.Store实体 提供初始的store

@Module
export default class Character extends VuexModule {
  unit_id: number = 0;
  level: number = 184;
  rank: number = 19;
  uniqueEquipmentLevel: number = 190;
  charaBase: charaBase = {
    unit_id: 0,
    unit_name: "",
    kana: "",
    prefab_id: 0,
    move_speed: 0,
    search_area_width: 0,
    atk_type: 0,
    normal_atk_cast_time: 0,
    guild_id: 0,
    comment: "",
    start_time: "",
    age: "",
    guild: "",
    race: "",
    height: "",
    weight: "",
    birth_month: "",
    birth_day: "",
    blood_type: "",
    favorite: "",
    voice: "",
    catch_copy: "",
    self_text: "",
    actual_name: "",
  };
  charaData: charaData = {
    charaBase: [],
    charaStoryStatus: [],
    unitRarity: [],
    charaPromotion: [],
    charaPromotionStatus: [],
    equipments: [],
    uniqueEquipment: [],
    uniqueEquipmentEnhance: [],
    unitSkillData: [],
    skillData: [],
    skillAction: [],
    unitAttackPattern: [],
  };
  charaStatus: charaStatus = {
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
  };

  get getLevel(): number {
    return this.level;
  }
  get getUnit_id(): number {
    return this.unit_id;
  }
  get getRank(): number {
    return this.rank;
  }
  get getUniqueEquipmentLevel(): number {
    return this.uniqueEquipmentLevel;
  }
  get getCharaData(): charaData {
    return this.charaData;
  }
  get getCharaBase(): charaBase {
    return this.charaBase;
  }
  get getCharaStatus(): charaStatus {
    return this.charaStatus;
  }

  @Mutation
  setUnitId(unit_id: number) {
    this.unit_id = unit_id;
  }
  @Mutation
  setLevel(level: number) {
    this.level = level;
  }
  @Mutation
  setRank(rank: number) {
    this.rank = rank;
  }
  @Mutation
  setUniqueEquipmentLevel(uniqueEquipmentLevel: number) {
    this.uniqueEquipmentLevel = uniqueEquipmentLevel;
  }
  @Mutation
  setCharaData(charaData: charaData) {
    this.charaData = charaData;
  }
  @Mutation
  setCharaBase(charaBase: charaBase) {
    this.charaBase = charaBase;
  }
  @Mutation
  setCharaStatus(charaStatus: charaStatus) {
    this.charaStatus = charaStatus;
  }
}
