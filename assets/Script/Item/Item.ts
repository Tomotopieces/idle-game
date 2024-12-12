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
}

export enum ItemQuality {
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
 * 物品品质显示名称 Map
 */
export const ITEM_QUALITY_DISPLAY_NAME_MAP = new Map<ItemQuality, string>([
    [ItemQuality.COMMON, '凡品'],
    [ItemQuality.UNCOMMON, '良品'],
    [ItemQuality.RARE, '上品'],
    [ItemQuality.EPIC, '特品'],
    [ItemQuality.LEGENDARY, '仙品'],
    [ItemQuality.MYTHICAL, '神珍'],
]);

/**
 * 物品品质颜色 Map
 */
export const ITEM_QUALITY_COLOR_MAP = new Map<ItemQuality, Color>([
    [ItemQuality.COMMON, new Color(255, 255, 255)],
    [ItemQuality.UNCOMMON, new Color(128, 255, 128)],
    [ItemQuality.RARE, new Color(64, 128, 255)],
    [ItemQuality.EPIC, new Color(255, 64, 255)],
    [ItemQuality.LEGENDARY, new Color(255, 255, 128)],
    [ItemQuality.MYTHICAL, new Color(255, 64, 64)],
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
    readonly quality: ItemQuality;

    constructor(id: number, name: string, displayName: string, itemType: ItemType, description: string, icon: string, unique: boolean, quality: ItemQuality) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.itemType = itemType;
        this.description = description;
        this.icon = icon;
        this.unique = unique ?? false;
        this.quality = quality ?? ItemQuality.COMMON;
    }

    /**
     * 从Object创建
     *
     * @param id ID
     * @param object Object
     * @return Item Item
     */
    static fromObject(id: number, object: Item): Item {
        return new Item(id, object.name, object.displayName, object.itemType, object.description, object.icon, object.unique, object.quality);
    }
}

