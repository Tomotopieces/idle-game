import { ItemMeta } from "db://assets/Script/Item/ItemMeta";
import { ItemType } from "db://assets/Script/Item/ItemType";
import { ItemRarity } from "db://assets/Script/Item/ItemRarity";

/**
 * 物品
 */
export class Item {
    /**
     * 元数据
     */
    readonly meta: ItemMeta;

    /**
     * 请使用 ItemFactory.item 创建
     */
    constructor(meta: ItemMeta) {
        this.meta = meta;
    }

    get name(): string {
        return this.meta.name;
    }

    get displayName(): string {
        return this.meta.displayName;
    }

    get itemType(): ItemType {
        return this.meta.itemType;
    }

    get description(): string {
        return this.meta.description;
    }

    get icon(): string {
        return this.meta.icon;
    }

    get unique(): boolean {
        return this.meta.unique;
    }

    get rarity(): ItemRarity {
        return this.meta.rarity;
    }
}
