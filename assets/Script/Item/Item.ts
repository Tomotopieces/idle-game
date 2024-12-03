/**
 * 物品类型
 */
export enum ItemType {
    /**
     * 常规项
     */
    COMMON,

    /**
     * 装备
     */
    EQUIPMENT,

    /**
     * 消耗品
     */
    CONSUMABLE,
}

/**
 * 物品
 */
export class Item {
    /**
     * ID
     */
    id: number;

    /**
     * 名称
     *
     * 数据关联用
     *
     * 英语/拼音小写，下划线分词
     */
    name: string;

    /**
     * 显示名称
     */
    displayName: string;

    /**
     * 类型
     */
    type: ItemType;

    /**
     * 描述
     */
    description: string;

    /**
     * 图标
     */
    icon: string;

    constructor(id: number, name: string, displayName: string, type: ItemType, description: string, icon: string) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.type = type;
        this.description = description;
        this.icon = icon;
    }

    /**
     * 从Object创建
     *
     * @param object Object
     * @return Item
     */
    static fromObject(object: any): Item {
        return new Item(object.id, object.name, object.displayName, object.type, object.description, object.icon);
    }
}

