import { Item, ItemRarity, ItemType } from "db://assets/Script/Item/Item";

/**
 * 贩卖品
 */
export class ForSaleItem extends Item {
    /**
     * 价格
     */
    readonly price: number;

    constructor(id: number, name: string, displayName: string, itemType: ItemType, description: string, icon: string, unique: boolean, rarity: ItemRarity, price: number) {
        super(id, name, displayName, itemType, description, icon, unique, rarity);
        this.price = price;
    }

    /**
     * 从Object创建
     *
     * @param id     ID
     * @param object Object
     */
    static fromObject(id: number, object: ForSaleItem): ForSaleItem {
        return new ForSaleItem(id, object.name, object.displayName, object.itemType, object.description, object.icon, object.unique, object.rarity, object.price);
    }
}