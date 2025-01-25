import { ItemMeta } from "db://assets/Script/Item/ItemMeta";
import { EquipmentAttributesMeta } from "db://assets/Script/Equipment/EquipmentAttributesMeta";
import { EquipmentType } from "db://assets/Script/Equipment/EquipmentType";
import { PassiveEffect } from "db://assets/Script/PassiveEffect/PassiveEffect";
import { SetBonus } from "db://assets/Script/Equipment/SetBonus/SetBonus";

/**
 * 装备元数据
 */
export class EquipmentMeta extends ItemMeta {
    /**
     * 装备类型
     */
    readonly equipmentType: EquipmentType;

    /**
     * 装备属性元数据
     */
    readonly attributes: EquipmentAttributesMeta;

    /**
     * 独门妙用
     */
    readonly uniqueEffect: PassiveEffect;

    /**
     * 套装名称
     */
    readonly setBonus: SetBonus;

    constructor(meta: ItemMeta, equipmentType: EquipmentType, attributes: EquipmentAttributesMeta, uniqueEffect: PassiveEffect, setBonus: SetBonus) {
        super(meta.id, meta.name, meta.displayName, meta.itemType, meta.description, meta.icon, meta.unique, meta.rarity);
        this.equipmentType = equipmentType;
        this.attributes = attributes;
        this.uniqueEffect = uniqueEffect;
        this.setBonus = setBonus;
    }
}