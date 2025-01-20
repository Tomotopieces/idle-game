import { ItemMeta } from "db://assets/Script/Item/ItemMeta";
import { UniqueUtility } from "db://assets/Script/Equipment/UniqueUtility/UniqueUtility";

/**
 * 泡酒物元数据
 */
export class InfusedIngredientMeta extends ItemMeta {
    /**
     * 饮用效果
     */
    drinkEffect: UniqueUtility;

    constructor(meta: ItemMeta, drinkEffect: UniqueUtility) {
        super(meta.id, meta.name, meta.displayName, meta.itemType, meta.description, meta.icon, meta.unique, meta.rarity);
        this.drinkEffect = drinkEffect;
    }
}