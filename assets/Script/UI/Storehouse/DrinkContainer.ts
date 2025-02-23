import { _decorator, Component } from "cc";
import { ItemSlot } from "db://assets/Script/UI/Storehouse/ItemSlot";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { UIUpdateDrinkEvent } from "db://assets/Script/Event/Events/UIUpdateDrinkEvent";
import { ItemType } from "db://assets/Script/Item/ItemType";

const { ccclass } = _decorator;

/**
 * 酒饮栏
 */
@ccclass("DrinkContainer")
export class DrinkContainer extends Component {
    /**
     * 葫芦槽
     */
    private _gourdSlot: ItemSlot;

    /**
     * 酒槽
     */
    private _liquorSlot: ItemSlot;

    /**
     * 泡酒物槽
     */
    private _ingredientSlots: ItemSlot[];

    onLoad() {
        this._gourdSlot = this.node.getChildByName('GourdSlot').getComponent(ItemSlot);
        this._liquorSlot = this.node.getChildByName('LiquorSlot').getComponent(ItemSlot);
        this._ingredientSlots = [
            this.node.getChildByName('IngredientSlot1').getComponent(ItemSlot),
            this.node.getChildByName('IngredientSlot2').getComponent(ItemSlot),
            this.node.getChildByName('IngredientSlot3').getComponent(ItemSlot),
            this.node.getChildByName('IngredientSlot4').getComponent(ItemSlot),
        ];

        EventCenter.on(EventName.UI_UPDATE_DRINK, this.node.name, (event: UIUpdateDrinkEvent) => this.handleUpdateDrink(event));
    }

    onDestroy() {
        EventCenter.idOff(this.node.name);
    }

    private handleUpdateDrink(event: UIUpdateDrinkEvent) {
        const drink = PlayerController.PLAYER.drink;
        switch (event.type) {
            case ItemType.GOURD:
                this._gourdSlot.stack = ItemStack.of(drink.gourd, 1);
                break;
            case ItemType.LIQUOR:
                this._liquorSlot.stack = ItemStack.of(drink.liquor, 1);
                this._ingredientSlots.forEach((slot, index) => {
                    if (index < drink.liquor.ingredientCapacity) {
                        slot.node.active = true;
                    } else {
                        slot.stack = null;
                        slot.node.active = false;
                    }
                });
                break;
            case ItemType.INGREDIENT:
                this._ingredientSlots.forEach((slot, index) =>
                    slot.stack = index < drink.ingredients.length ? ItemStack.of(drink.ingredients[index], 1) : null);
                break;
        }
    }
}
