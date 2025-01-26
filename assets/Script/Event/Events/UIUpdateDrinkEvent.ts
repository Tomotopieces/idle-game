import { EventArgument } from "db://assets/Script/Event/EventArgument";
import { ItemType } from "db://assets/Script/Item/ItemType";

/**
 * UI更换酒饮物品事件
 */
export class UIUpdateDrinkEvent extends EventArgument {
    /**
     * 类型
     */
    readonly type: ItemType.GOURD | ItemType.LIQUOR | ItemType.INGREDIENT;

    constructor(type: ItemType.GOURD | ItemType.LIQUOR | ItemType.INGREDIENT) {
        super();
        this.type = type;
    }
}
