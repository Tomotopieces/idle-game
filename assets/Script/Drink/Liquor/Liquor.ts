import { UniqueUtility } from "db://assets/Script/Equipment/UniqueUtility/UniqueUtility";
import { Item } from "db://assets/Script/Item/Item";
import { LiquorMeta } from "db://assets/Script/Drink/Liquor/LiquorMeta";

/**
 * 酒
 */
export class Liquor extends Item {
    declare meta: LiquorMeta;

    constructor(meta: LiquorMeta, uuid?: string) {
        super(meta, uuid);
    }

    get healthRecoverRatio(): number {
        return this.meta.healthRecoverRatio;
    }

    get ingredientCapacity(): number {
        return this.meta.ingredientCapacity;
    }

    get drinkEffect(): UniqueUtility {
        return this.meta.drinkEffect;
    }
}