import { UniqueEffect } from "db://assets/Script/Item/Equipment/UniqueEffect/UniqueEffect";
import {
    UniqueEffectLinGunShuangShe
} from "db://assets/Script/Item/Equipment/UniqueEffect/UniqueEffectLinGunShuangShe";

/**
 * 独门妙用 Map
 *
 * 效果名 -> 效果对象
 */
export const UNIQUE_EFFECT_MAP = new Map<string, UniqueEffect>();
UNIQUE_EFFECT_MAP.set(UniqueEffectLinGunShuangShe.NAME, new UniqueEffectLinGunShuangShe());
