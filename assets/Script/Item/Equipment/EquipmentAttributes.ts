/**
 * 装备属性
 */
export class EquipmentAttributes {
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
    readonly additionalDefense: number;

    /**
     * 防御力倍率
     */
    readonly defenseBoost: number;

    /**
     * 暴击率
     */
    readonly criticalRate: number;

    /**
     * 暴击伤害倍率
     */
    readonly criticalBoost: number;

    /**
     * 独门妙用
     */
    readonly effects: Array<string>;

    /**
     * 所属套装名称
     */
    readonly setName: string;

    constructor(additionalHealth: number, healthBoost: number, extraHealth: number, additionalDamage: number, damageBoost: number, additionalDefense: number, defenseBoost: number, criticalRate: number, criticalBoost: number, effects: Array<string>, set: string) {
        // 从JSON中读取的Object，字段可能为null
        this.additionalHealth = additionalHealth ?? 0;
        this.healthBoost = healthBoost ?? 0;
        this.extraHealth = extraHealth ?? 0;
        this.additionalDamage = additionalDamage ?? 0;
        this.damageBoost = damageBoost ?? 0;
        this.additionalDefense = additionalDefense ?? 0;
        this.defenseBoost = defenseBoost ?? 0;
        this.criticalRate = criticalRate ?? 0;
        this.criticalBoost = criticalBoost ?? 0;
        this.effects = effects ?? [];
        this.setName = set ?? '';
    }

    /**
     * 从Object创建
     *
     * @param object Object
     */
    static fromObject(object: EquipmentAttributes) {
        return new EquipmentAttributes(object.additionalHealth, object.healthBoost, object.extraHealth, object.additionalDamage, object.damageBoost, object.additionalDefense, object.defenseBoost, object.criticalRate, object.criticalBoost, object.effects, object.setName);
    }
}
