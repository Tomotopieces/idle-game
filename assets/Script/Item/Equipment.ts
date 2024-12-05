import { Item } from "db://assets/Script/Item/Item";

export enum EquipmentType {
    WEAPON,
    HEADGEAR,
    CHEST,
    ARM,
    LEG
}

/**
 * 武器
 */
export class Equipment extends Item {
    /**
     * 装备类型
     */
    private _type: EquipmentType;

    /**
     * 攻击力
     */
    private _damage: number;

    /**
     * 攻击力倍率
     */
    private _damageBoost: number;

    /**
     * 防御力
     */
    private _defence: number;

    /**
     * 防御力倍率
     */
    private _defenceBoost: number;

    /**
     * 暴击率
     */
    private _criticalRate: number;

    /**
     * 暴击伤害倍率
     */
    private _criticalDamageBoost: number;

    /**
     * 装备时触发
     */
    private _onEquip: Function;

    /**
     * 解除装备时触发
     */
    private _onUnEquip: Function;
}
