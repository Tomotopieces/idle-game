import { GourdState } from "db://assets/Script/Drink/Gourd/GourdState";
import { GourdMeta } from "db://assets/Script/Drink/Gourd/GourdMeta";
import { Item } from "db://assets/Script/Item/Item";
import { UniqueUtility } from "db://assets/Script/Equipment/UniqueUtility/UniqueUtility";

/**
 * 葫芦
 */
export class Gourd extends Item {
    declare meta: GourdMeta;

    /**
     * 剩余量
     */
    remain: number;

    constructor(meta: GourdMeta, uuid?: string, remain: number = meta.capacity) {
        super(meta, uuid);
        this.remain = remain;
    }

    /**
     * 获取剩余酒量状态
     */
    get state(): GourdState {
        return this.meta.capacity === this.remain ? GourdState.FULL :
               this.remain > 0 ? GourdState.PARTIAL :
               GourdState.EMPTY;
    }

    get capacity(): number {
        return this.meta.capacity;
    }

    get autoRecoverInterval(): number {
        return this.meta.autoRecoverInterval;
    }

    get autoDrinkInterval(): number {
        return this.meta.autoDrinkInterval;
    }

    get drinkEffect(): UniqueUtility {
        return this.meta.drinkEffect;
    }
}