import { ItemRarity, RARITIES } from "db://assets/Script/Item/Item";

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
    readonly additionalDefense: number | number[];

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
    readonly effects: string[];

    /**
     * 所属套装名称
     */
    readonly setName: string;

    /**
     * 装备品质
     *
     * 默认品质与资源文件一致，强化后升级，最高为神珍
     */
    private _rarity: ItemRarity;

    /**
     * 品质等级
     */
    private _rank = 0;

    constructor(additionalHealth: number, healthBoost: number, extraHealth: number, additionalDamage: number, damageBoost: number, additionalDefense: number | number[], defenseBoost: number, criticalRate: number, criticalBoost: number, effects: string[], set: string, rarity: ItemRarity) {
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
        this._rarity = rarity ?? ItemRarity.COMMON;
    }

    /**
     * 从Object创建
     *
     * @param object  Object
     */
    static fromObject(object: EquipmentAttributes) {
        return new EquipmentAttributes(object.additionalHealth, object.healthBoost, object.extraHealth, object.additionalDamage, object.damageBoost, object.additionalDefense, object.defenseBoost, object.criticalRate, object.criticalBoost, object.effects, object.setName, object.rarity);
    }

    /**
     * 品质升阶
     */
    upgrade() {
        if (this._rarity === ItemRarity.MYTHICAL) {
            return;
        }
        this._rarity = RARITIES[(RARITIES.indexOf(this._rarity) + 1)];
        this._rank++;
    }

    /**
     * 根据品质获取等级
     *
     * @param rarity 品质
     * @return 等级
     */
    private rarityToRank(rarity: ItemRarity): number {
        const defaultRarity = RARITIES[RARITIES.indexOf(this._rarity) - this._rank];
        return RARITIES.indexOf(rarity) - RARITIES.indexOf(defaultRarity);
    }

    get rarity(): ItemRarity {
        return this._rarity;
    }

    /**
     * 获取默认品质的附加防御
     */
    get defaultAdditionalDefense(): number {
        return this.additionalDefense instanceof Array ? this.additionalDefense[0] : this.additionalDefense;
    }

    /**
     * 获取指定品质的附加防御
     *
     * @param rarity 品质，默认为当前品质
     */
    getAdditionalDefense(rarity: ItemRarity = this._rarity): number {
        return this.additionalDefense instanceof Array ? this.additionalDefense[this.rarityToRank(rarity)] : this.additionalDefense;
    }

    /**
     * 获取附加防御升阶后的增量
     *
     * @param upgradedRarity 升阶后品质
     */
    additionalDefenseUpgradedDelta(upgradedRarity: ItemRarity = this.rarity): number {
        const rank = this.rarityToRank(upgradedRarity);
        return this.additionalDefense instanceof Array ? this.additionalDefense[rank] - this.additionalDefense[rank - 1] : 0;
    }
}
