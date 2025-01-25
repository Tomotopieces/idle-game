import { Item } from "db://assets/Script/Item/Item";
import { EquipmentAttributes } from "db://assets/Script/Equipment/EquipmentAttributes";
import { ItemRarity } from "db://assets/Script/Item/ItemRarity";
import { EquipmentMeta } from "db://assets/Script/Equipment/EquipmentMeta";
import { EquipmentType } from "db://assets/Script/Equipment/EquipmentType";
import { PassiveEffect } from "db://assets/Script/PassiveEffect/PassiveEffect";
import { SetBonus } from "db://assets/Script/Equipment/SetBonus/SetBonus";

/**
 * 装备
 */
export class Equipment extends Item {
    declare meta: EquipmentMeta;

    /**
     * 装备属性
     */
    readonly attributes: EquipmentAttributes;

    /**
     * 装备阶级（升级次数）
     */
    rank: number;

    constructor(meta: EquipmentMeta, uuid?: string, rank: number = 0) {
        super(meta, uuid);
        this.attributes = new EquipmentAttributes(meta.attributes, this);
        this.rank = rank;
    }

    /**
     * 升阶
     */
    upgrade() {
        this.rank++;
    }

    /**
     * 升阶后品质
     */
    get rankRarity(): ItemRarity {
        return ItemRarity.ofValue(this.rarity.value + this.rank);
    }

    get equipmentType(): EquipmentType {
        return this.meta.equipmentType;
    }

    get uniqueEffect(): PassiveEffect {
        return this.meta.uniqueEffect;
    }

    get setBonus(): SetBonus {
        return this.meta.setBonus;
    }
}
