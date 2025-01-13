import { EquipmentAttributesMeta } from "db://assets/Script/Equipment/EquipmentAttributesMeta";
import { EquipmentType } from "db://assets/Script/Equipment/EquipmentType";
import { ItemMetaJson } from "db://assets/Script/Item/ItemMetaJson";
import { EquipmentMeta } from "db://assets/Script/Equipment/EquipmentMeta";

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
     * 转换为EquipmentMeta
     *
     * @param id   ID
     * @param json EquipmentMetaJson
     * @return {EquipmentMeta} EquipmentMeta
     */
    static toEquipmentMeta(id: number, json: EquipmentMetaJson): EquipmentMeta {
        return new EquipmentMeta(ItemMetaJson.toItemMeta(id, json), json.equipmentType, EquipmentAttributesMeta.fromObject(json.attributes));
    }
}