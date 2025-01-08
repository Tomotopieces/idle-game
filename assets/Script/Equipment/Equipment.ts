import { Item, ItemRarity, ItemType } from "db://assets/Script/Item/Item";
import { EquipmentAttributes } from "db://assets/Script/Equipment/EquipmentAttributes";

/**
 * 装备类型
 */
export enum EquipmentType {
    /**
     * 武器
     */
    WEAPON = 'weapon',

    /**
     * 头冠
     */
    HEAD = 'head',

    /**
     * 衣甲
     */
    CHEST = 'chest',

    /**
     * 臂甲
     */
    ARM = 'arm',

    /**
     * 腿甲
     */
    LEG = 'leg',

    /**
     * 珍玩
     */
    CURIOS = 'curios'
}

/**
 * 装备
 */
export class Equipment extends Item {
    /**
     * 装备类型
     */
    readonly equipmentType: EquipmentType;

    /**
     * 装备属性
     */
    readonly attributes: EquipmentAttributes;

    constructor(id: number, name: string, displayName: string, type: ItemType, description: string, icon: string, unique: boolean, equipmentType: EquipmentType, attributes: EquipmentAttributes, rarity: ItemRarity) {
        super(id, name, displayName, type, description, icon, unique, rarity);
        this.equipmentType = equipmentType;
        this.attributes = attributes;
    }

    /**
     * 从Object创建
     *
     * @param id     ID
     * @param object Object
     */
    static override fromObject(id: number, object: Equipment): Equipment {
        const item = Item.fromObject(id, object);
        return new Equipment(id, item.name, item.displayName, item.itemType, item.description, item.icon, item.unique, object.equipmentType, EquipmentAttributes.fromObject(object.attributes, object.rarity), object.rarity);
    }
}
