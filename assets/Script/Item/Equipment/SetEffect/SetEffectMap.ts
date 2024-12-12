import { SetEffect } from "db://assets/Script/Item/Equipment/SetEffect/SetEffect";
import { SetEffectZiZhuBiJiao } from "db://assets/Script/Item/Equipment/SetEffect/SetEffectZiZhuBiJiao";

/**
 * 套装效果 Map
 *
 * 效果名（装备名） -> 套装效果
 */
export const SET_EFFECT_MAP: Map<string, SetEffect> = new Map<string, SetEffect>();
SET_EFFECT_MAP.set(SetEffectZiZhuBiJiao.NAME, new SetEffectZiZhuBiJiao());
