import { ItemMeta } from "db://assets/Script/Item/ItemMeta";
import { UniqueUtility } from "db://assets/Script/Equipment/UniqueUtility/UniqueUtility";

/**
 * 葫芦元数据
 */
export class GourdMeta extends ItemMeta {
    /**
     * 容量
     */
    readonly capacity: number;

    /**
     * 自动恢复酒量的时间间隔
     */
    readonly autoRecoverInterval: number;

    /**
     * 自动饮用的时间间隔
     */
    readonly autoDrinkInterval: number;

    /**
     * 饮用效果
     */
    readonly drinkEffect: UniqueUtility;

    constructor(meta: ItemMeta, capacity: number, autoRecoverInterval: number, autoDrinkInterval: number, drinkEffect: UniqueUtility) {
        super(meta.id, meta.name, meta.displayName, meta.itemType, meta.description, meta.icon, meta.unique, meta.rarity);
        this.capacity = capacity;
        this.autoRecoverInterval = autoRecoverInterval;
        this.autoDrinkInterval = autoDrinkInterval;
        this.drinkEffect = drinkEffect;
    }
}