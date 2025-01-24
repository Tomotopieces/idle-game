import { Gourd } from "db://assets/Script/Drink/Gourd/Gourd";
import { Liquor } from "db://assets/Script/Drink/Liquor/Liquor";
import { InfusedIngredient } from "db://assets/Script/Drink/InfusedIngredient/InfusedIngredient";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { PlayerDrinkEvent } from "db://assets/Script/Event/Events/PlayerDrinkEvent";
import { GourdState } from "db://assets/Script/Drink/Gourd/GourdState";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";

/**
 * 饮酒管理
 */
export class DrinkManager {
    /**
     * 葫芦
     */
    private _gourd: Gourd;

    /**
     * 酒
     */
    private _liquor: Liquor;

    /**
     * 泡酒物
     */
    private readonly _ingredients: InfusedIngredient[] = [];

    /**
     * 自动恢复计时器
     */
    private _autoRecoverTimer: number = 0;

    /**
     * 自动饮用计时器
     */
    private _autoDrinkTimer: number = 0;

    private readonly _dangerousRatio: number = 0.5;

    /**
     * update
     *
     * @param dt deltaTime 时间增量
     */
    update(dt: number) {
        // 葫芦未满时自动恢复酒量
        if (this.gourd.state !== GourdState.FULL) {
            this._autoRecoverTimer += dt;
            if (this._autoRecoverTimer >= this._gourd.autoRecoverInterval) {
                this._autoRecoverTimer -= this._gourd.autoRecoverInterval;
                this.recover();
            }
        }

        // 根据时间自动饮用
        this._autoDrinkTimer += dt;
        if (this._autoDrinkTimer >= this._gourd.autoDrinkInterval) {
            this._autoDrinkTimer -= this._gourd.autoDrinkInterval;
            this.drink();
        }

        // 根据血量自动饮用
        const attributes = PlayerController.PLAYER.attributes;
        while (attributes.health < attributes.finalHealth() * this._dangerousRatio && this._gourd.remain > 0) {
            this.drink();
            this._autoDrinkTimer = 0; // 重置自动饮用计时器
        }
    }

    /**
     * 恢复酒量
     *
     * @param count 恢复数量
     */
    recover(count: number = 1) {
        if (this._gourd.remain >= this._gourd.capacity) {
            return;
        }

        this._gourd.remain = Math.min(this._gourd.capacity, this._gourd.remain + count);
        if (this._gourd.remain === this._gourd.capacity) {
            this._autoRecoverTimer = 0; // 重置自动饮用计时器
        }
    }

    /**
     * 饮酒
     */
    drink() {
        if (this.gourd.remain <= 0 || !this._liquor) {
            return;
        }

        // 饮用效果
        EventCenter.emit(EventName.PLAYER_DRINK, new PlayerDrinkEvent(this._liquor.healthRecoverRatio));
        this._gourd.remain--;
    }

    get gourd(): Gourd {
        return this._gourd;
    }

    set gourd(gourd: Gourd) {
        // 切换葫芦的效果
        const oldGourd = this._gourd;
        oldGourd?.drinkEffect.onDeactivate();
        this._gourd = gourd;
        this._gourd?.drinkEffect.onActivate();

        // 计算剩余酒量
        this._gourd.remain = oldGourd ? Math.min(this._gourd.capacity, oldGourd.remain) : this._gourd.capacity;
    }

    get liquor(): Liquor {
        return this._liquor;
    }

    set liquor(liquor: Liquor) {
        // 切换酒的效果
        const oldLiquor = this._liquor;
        oldLiquor?.drinkEffect.onDeactivate();
        this._liquor = liquor;
        this._liquor?.drinkEffect.onActivate();

        // 计算泡酒物数量
        if (this._liquor.ingredientCapacity < (oldLiquor?.ingredientCapacity ?? 0)) {
            // 取消被卸下的泡酒物的效果
            this._ingredients.splice(0, oldLiquor.ingredientCapacity - this._liquor.ingredientCapacity)
                .forEach(ingredient => ingredient.drinkEffect.onDeactivate());
        }
    }

    get ingredients(): InfusedIngredient[] {
        return this._ingredients;
    }

    setIngredient(ingredient: InfusedIngredient, index: number) {
        // 切换泡酒物的效果
        this._ingredients[index].drinkEffect?.onDeactivate();
        this._ingredients[index] = ingredient;
        ingredient && ingredient.drinkEffect.onActivate();
    }
}
