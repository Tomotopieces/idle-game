import { Item, ItemRarity, ItemType } from "db://assets/Script/Item/Item";

/**
 * 交易物品（买&卖）
 */
export class TradingItem extends Item {
    /**
     * 价格
     */
    readonly price: number;

    constructor(id: number, name: string, displayName: string, itemType: ItemType, description: string, icon: string, unique: boolean, rarity: ItemRarity, price: number) {
        super(id, name, displayName, itemType, description, icon, unique, rarity);
        this.price = price;
    }

    /**
     * 从物品创建
     *
     * @param item  物品
     * @param price 价格
     */
    static fromItem(item: Item, price: number): TradingItem {
        return new TradingItem(item.id, item.name, item.displayName, item.itemType, item.description, item.icon, item.unique, item.rarity, price);
    }

    /**
     * 从Object创建
     *
     * @param id     ID
     * @param object Object
     */
    static fromObject(id: number, object: TradingItem): TradingItem {
        return new TradingItem(id, object.name, object.displayName, object.itemType, object.description, object.icon, object.unique, object.rarity, object.price);
    }
}