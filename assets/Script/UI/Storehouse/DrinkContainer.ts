import { _decorator, Component } from "cc";
import { ItemSlot } from "db://assets/Script/UI/Storehouse/ItemSlot";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { ChangeDrinkItemEvent, ChangeDrinkItemType } from "db://assets/Script/Event/Events/ChangeDrinkItemEvent";

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

        EventCenter.on(EventName.UI_UPDATE_DRINK, this.node.name, (event: ChangeDrinkItemEvent) => this.handleUpdateDrink(event));
    }

    onDestroy() {
        EventCenter.idOff(this.node.name);
    }

    private handleUpdateDrink(event: ChangeDrinkItemEvent) {
        const drink = PlayerController.PLAYER.drink;
        switch (event.type) {
            case ChangeDrinkItemType.GOURD:
                this._gourdSlot.stack = ItemStack.of(drink.gourd, 1);
                break;
            case ChangeDrinkItemType.LIQUOR:
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
            case ChangeDrinkItemType.INGREDIENT:
                drink.ingredients.forEach((ingredient, index) =>
                    this._ingredientSlots[index].stack = ItemStack.of(ingredient, 1));
                break;
        }
    }
}
