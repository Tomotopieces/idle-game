import { EquipmentAttributesMeta } from "db://assets/Script/Equipment/EquipmentAttributesMeta";
import { EquipmentType } from "db://assets/Script/Equipment/EquipmentType";
import { ItemMetaJson } from "db://assets/Script/Item/ItemMetaJson";
import { EquipmentMeta } from "db://assets/Script/Equipment/EquipmentMeta";
import { PASSIVE_EFFECT_TABLE, SET_BONUS_TABLE } from "db://assets/Script/DataTable";

/**
 * 装备元数据
 */
export class EquipmentMetaJson extends ItemMetaJson {
    /**
     * 装备类型
     */
    readonly equipmentType: EquipmentType;

    /**
     * 装备属性元数据
     */
    readonly attributes: EquipmentAttributesMeta;

    /**
     * 独门妙用名称
     */
    readonly uniqueEffect: string;

    /**
     * 套装效果名称
     */
    readonly setBonus: string;

    /**
     * 转换为EquipmentMeta
     *
     * @param id   ID
     * @param json EquipmentMetaJson
     * @return {EquipmentMeta} EquipmentMeta
     */
    static toEquipmentMeta(id: number, json: EquipmentMetaJson): EquipmentMeta {
        const attributesMeta = EquipmentAttributesMeta.fromObject(json.attributes);
        const uniqueEffect = PASSIVE_EFFECT_TABLE.get(json.uniqueEffect);
        const setBonus = SET_BONUS_TABLE.get(json.setBonus);
        return new EquipmentMeta(ItemMetaJson.toItemMeta(id, json), json.equipmentType, attributesMeta, uniqueEffect, setBonus);
    }
}