import { SetEffect } from "db://assets/Script/Item/Equipment/SetEffect/SetEffect";
import { SetEffectZiZhuBiJiao } from "db://assets/Script/Item/Equipment/SetEffect/SetEffectZiZhuBiJiao";

/**
 * 套装效果 Map
 *
 * 效果名 -> 要求装备数量 -> 效果对象
 */
export const SET_EFFECT_MAP: Map<string, Map<number, SetEffect>> = new Map<string, Map<number, SetEffect>>();

/**
 * 锱铢必较套装效果 Map
 */
const SET_EFFECT_ZI_ZHU_BI_JIAO_MAP = new Map<number, SetEffect>();
SET_EFFECT_ZI_ZHU_BI_JIAO_MAP.set(4, new SetEffectZiZhuBiJiao());

SET_EFFECT_MAP.set(SetEffectZiZhuBiJiao.NAME, SET_EFFECT_ZI_ZHU_BI_JIAO_MAP);
