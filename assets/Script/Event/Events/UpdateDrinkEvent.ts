import { EventArgument } from "db://assets/Script/Event/EventArgument";
import { Gourd } from "db://assets/Script/Drink/Gourd/Gourd";
import { Liquor } from "db://assets/Script/Drink/Liquor/Liquor";
import { InfusedIngredient } from "db://assets/Script/Drink/InfusedIngredient/InfusedIngredient";

/**
 * 更换饮酒物事件
 */
export class UpdateDrinkEvent extends EventArgument {
    /**
     * 饮酒物
     */
    readonly drinkItem: Gourd | Liquor | InfusedIngredient;

    /**
     * 装卸
     *
     * 只影响泡酒物的情况
     */
    readonly load: boolean;

    constructor(item: Gourd | Liquor | InfusedIngredient, load: boolean = true) {
        super();
        this.drinkItem = item;
        this.load = load;
    }
}