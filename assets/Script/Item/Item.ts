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
    readonly unique: boolean = false;

    constructor(id: number, name: string, displayName: string, itemType: ItemType, description: string, icon: string, unique: boolean) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.itemType = itemType;
        this.description = description;
        this.icon = icon;
        this.unique = unique;
    }

    /**
     * 从Object创建
     *
     * @param id ID
     * @param object Object
     * @return Item Item
     */
    static fromObject(id: number, object: Item): Item {
        return new Item(id, object.name, object.displayName, object.itemType, object.description, object.icon, object.unique);
    }
}

