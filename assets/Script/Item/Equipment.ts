import { Item } from "db://assets/Script/Item/Item";

/**
 * 装备类型
 */
export enum EquipmentType {
    /**
     * 武器
     */
    WEAPON,

    /**
     * 头冠
     */
    HEADGEAR,

    /**
     * 衣甲
     */
    CHEST,

    /**
     * 臂甲
     */
    ARM,

    /**
     * 腿甲
     */
    LEG,

    /**
     * 珍玩
     */
    CURIOS
}

/**
 * 武器
 */
export class Equipment extends Item {
    /**
     * 装备类型
     */
    readonly equipmentType: EquipmentType;

    /**
     * 生命值
     */
    readonly additionalHealth: number;

    /**
     * 生命值倍率
     */
    readonly healthBoost: number;

    /**
     * 额外生命
     */
    readonly extraHealth: number;

    /**
     * 攻击力
     */
    readonly additionalDamage: number;

    /**
     * 攻击力倍率
     */
    readonly damageBoost: number;

    /**
     * 防御力
     */
    readonly additionalDefence: number;

    /**
     * 防御力倍率
     */
    readonly defenceBoost: number;

    /**
     * 暴击率
     */
    readonly criticalRate: number;

    /**
     * 暴击伤害倍率
     */
    readonly criticalBoost: number;
}
