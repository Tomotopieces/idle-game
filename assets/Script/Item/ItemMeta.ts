import { ItemType } from "db://assets/Script/Item/ItemType";
import { ItemRarity } from "db://assets/Script/Item/ItemRarity";

/**
 * 物品元数据
 */
export class ItemMeta {
    /**
     * ID
     *
     * 数据排序用
     */
    readonly id: number;

    /**
     * 名称
     *
     * 数据关联用
     *
     * 英语/拼音小写，下划线分词
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
    readonly rarity: ItemRarity;

    constructor(id: number, name: string, displayName: string, itemType: ItemType, description: string, icon: string, unique: boolean, rarity: ItemRarity) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.itemType = itemType;
        this.description = description;
        this.icon = icon;
        this.unique = unique ?? false;
        this.rarity = rarity ?? ItemRarity.COMMON;
    }
}