import { Color } from "cc";

/**
 * 物品类型
 */
export enum ItemType {
    /**
     * 常规项
     */
    COMMON = 'common',

    /**
     * 装备
     */
    EQUIPMENT = 'equipment',

    /**
     * 消耗品
     */
    CONSUMABLE = 'consumable',

    /**
     * 贩卖品
     */
    FOR_SALE = 'forSale',
}

/**
 * 物品品质
 */
export enum ItemRarity {
    /**
     * 凡品
     */
    COMMON = 'common',

    /**
     * 良品
     */
    UNCOMMON = 'uncommon',

    /**
     * 上品
     */
    RARE = 'rare',

    /**
     * 特品
     */
    EPIC = 'epic',

    /**
     * 仙品
     */
    LEGENDARY = 'legendary',

    /**
     * 神珍
     */
    MYTHICAL = 'mythical',
}

/**
 * 物品品质顺序表
 */
export const RARITIES = [ItemRarity.COMMON, ItemRarity.UNCOMMON, ItemRarity.RARE, ItemRarity.EPIC, ItemRarity.LEGENDARY, ItemRarity.MYTHICAL];

/**
 * 物品品质显示名称 Map
 */
export const ITEM_RARITY_DISPLAY_NAME_MAP = new Map<ItemRarity, string>([
    [ItemRarity.COMMON, '凡品'],
    [ItemRarity.UNCOMMON, '良品'],
    [ItemRarity.RARE, '上品'],
    [ItemRarity.EPIC, '特品'],
    [ItemRarity.LEGENDARY, '仙品'],
    [ItemRarity.MYTHICAL, '神珍'],
]);

/**
 * 物品品质颜色 Map
 */
export const ITEM_RARITY_COLOR_MAP = new Map<ItemRarity, Color>([
    [ItemRarity.COMMON, Color.WHITE],
    [ItemRarity.UNCOMMON, new Color(128, 255, 128)],
    [ItemRarity.RARE, new Color(64, 128, 255)],
    [ItemRarity.EPIC, new Color(255, 64, 255)],
    [ItemRarity.LEGENDARY, new Color(255, 255, 128)],
    [ItemRarity.MYTHICAL, new Color(255, 64, 64)],
]);

/**
 * 物品
 */
export class Item {
    /**
     * ID
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

    /**
     * 从Object创建
     *
     * @param id ID
     * @param object Object
     * @return Item
     */
    static fromObject(id: number, object: Item): Item {
        return new Item(id, object.name, object.displayName, object.itemType, object.description, object.icon, object.unique, object.rarity);
    }
}

