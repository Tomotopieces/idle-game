import { ItemType } from "db://assets/Script/Item/ItemType";
import { ItemRarity } from "db://assets/Script/Item/ItemRarity";
import { ItemMeta } from "db://assets/Script/Item/ItemMeta";

/**
 * 物品元数据JSON
 */
export class ItemMetaJson {
    /**
     * ID
     */
    readonly id: number;

    /**
     * 名称
     */
    readonly name: string;

    /**
     * 显示名称
     */
    readonly displayName: string;

    /**
     * 类型
     */
    readonly itemType: ItemType;

    /**
     * 描述
     */
    readonly description: string;

    /**
     * 图标
     */
    readonly icon: string;

    /**
     * 是否唯一
     */
    readonly unique: boolean;

    /**
     * 品质
     */
    readonly rarity: string;

    /**
     * 转换为ItemMeta
     *
     * @param id   ID
     * @param json ItemMetaJson
     * @return {ItemMeta} ItemMeta
     */
    static toItemMeta(id: number, json: ItemMetaJson): ItemMeta {
        return new ItemMeta(id, json.name, json.displayName, json.itemType, json.description, json.icon, json.unique, ItemRarity.of(json.rarity));
    }
}