import { EventArgument } from "db://assets/Script/Event/EventArgument";

/**
 * 酒饮物品类型
 */
export enum ChangeDrinkItemType {
    /**
     * 葫芦
     */
    GOURD,

    /**
     * 酒
     */
    LIQUOR,

    /**
     * 泡酒物
     */
    INGREDIENT
}

/**
 * 更换酒饮物品事件
 */
export class ChangeDrinkItemEvent extends EventArgument {
    /**
     * 类型
     */
    readonly type: ChangeDrinkItemType;

    constructor(type: ChangeDrinkItemType) {
        super();
        this.type = type;
    }
}
