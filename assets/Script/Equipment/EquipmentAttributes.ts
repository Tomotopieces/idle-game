import { Equipment } from "db://assets/Script/Equipment/Equipment";
import { EquipmentAttributesMeta } from "db://assets/Script/Equipment/EquipmentAttributesMeta";
import { ItemRarity } from "db://assets/Script/Item/ItemRarity";

/**
 * 装备属性
 */
export class EquipmentAttributes {
    /**
     * @param _meta      元数据
     * @param _equipment 装备
     */
    constructor(private _meta: EquipmentAttributesMeta, private _equipment: Equipment) {}

    /**
     * 获取附加防御
     *
     * @param rarity 品质，默认为当前装备品质
     * @return {number} 附加防御
     */
    additionalDefenseOf(rarity: ItemRarity = this._equipment.rankRarity): number {
        return this._meta.additionalDefense instanceof Array ? this._meta.additionalDefense[this.rarityToRank(rarity)] : this._meta.additionalDefense;
    }

    /**
     * 根据品质获取阶级
     *
     * @param rarity 品质
     * @return {number} 阶级
     */
    private rarityToRank(rarity: ItemRarity): number {
        return rarity.value - this._equipment.rarity.value;
    }

    /**
     * 获取附加防御升阶后的增量
     *
     * @return 防御增量
     */
    additionalDefenseUpgradedDelta(): number {
        const rank = this._equipment.rank;
        return this._meta.additionalDefense instanceof Array ? this._meta.additionalDefense[rank] - this._meta.additionalDefense[rank - 1] : 0;
    }

    get additionalHealth(): number {
        return this._meta.additionalHealth;
    }

    get healthBoost(): number {
        return this._meta.healthBoost;
    }

    get extraHealth(): number {
        return this._meta.extraHealth;
    }

    get additionalDamage(): number {
        return this._meta.additionalDamage;
    }

    get damageBoost(): number {
        return this._meta.damageBoost;
    }

    get additionalDefense(): number | number[] {
        return this._meta.additionalDefense;
    }

    get defenseBoost(): number {
        return this._meta.defenseBoost;
    }

    get criticalRate(): number {
        return this._meta.criticalRate;
    }

    get criticalBoost(): number {
        return this._meta.criticalBoost;
    }
}
