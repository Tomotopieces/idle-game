import { Gourd } from "db://assets/Script/Drink/Gourd/Gourd";
import { Liquor } from "db://assets/Script/Drink/Liquor/Liquor";
import { InfusedIngredient } from "db://assets/Script/Drink/InfusedIngredient/InfusedIngredient";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { PlayerDrinkEvent } from "db://assets/Script/Event/Events/PlayerDrinkEvent";
import { GourdState } from "db://assets/Script/Drink/Gourd/GourdState";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
import { UIUpdateDrinkEvent } from "db://assets/Script/Event/Events/UIUpdateDrinkEvent";
import { ItemType } from "db://assets/Script/Item/ItemType";
import { Item } from "db://assets/Script/Item/Item";
import { UIUpdateGourdProcessEvent } from "db://assets/Script/Event/Events/UIUpdateGourdProcessEvent";

/**
 * 饮酒管理
 */
export class PlayerDrinkManager {
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

    /**
     * 危险点血量比例
     */
    private readonly _dangerousRatio: number = 0.5;

    /**
     * update
     *
     * @param dt deltaTime 时间增量
     */
    update(dt: number) {
        // 葫芦未满时自动恢复酒量
        if (this._gourd.state !== GourdState.FULL) {
            this._autoRecoverTimer += dt;
            if (this._autoRecoverTimer >= this._gourd.autoRecoverInterval) {
                this._autoRecoverTimer -= this._gourd.autoRecoverInterval;
                this.recover();
            }
            EventCenter.emit(EventName.UI_UPDATE_GOURD_PROCESS, new UIUpdateGourdProcessEvent(this._gourd.remain, this.autoRecoverRatio));
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
            this._autoDrinkTimer = 0; // 重置自动饮用计时器
            this.drink();
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
            EventCenter.emit(EventName.UI_UPDATE_GOURD_PROCESS, new UIUpdateGourdProcessEvent(this._gourd.remain, this.autoRecoverRatio));
        }
    }

    /**
     * 饮酒
     */
    drink() {
        if (this._gourd.remain <= 0 || !this._liquor) {
            return;
        }

        // 饮用效果
        EventCenter.emit(EventName.PLAYER_DRINK, new PlayerDrinkEvent(this._liquor.healthRecoverRatio));
        this._gourd.remain--;
        EventCenter.emit(EventName.UI_UPDATE_GOURD_PROCESS, new UIUpdateGourdProcessEvent(this._gourd.remain, 0))
    }

    get gourd(): Gourd {
        return this._gourd;
    }

    set gourd(gourd: Gourd) {
        if (this._gourd === gourd) {
            return;
        }

        // 切换葫芦的效果
        const oldGourd = this._gourd;
        oldGourd?.effect?.deactivate();
        this._gourd = gourd;
        this._gourd.effect?.activate();

        // 计算剩余酒量
        this._gourd.remain = oldGourd ? Math.min(this._gourd.capacity, oldGourd.remain) : this._gourd.capacity;

        EventCenter.emit(EventName.UI_UPDATE_DRINK, new UIUpdateDrinkEvent(ItemType.GOURD));
    }

    get liquor(): Liquor {
        return this._liquor;
    }

    set liquor(liquor: Liquor) {
        if (this._liquor === liquor) {
            return;
        }

        // 切换酒的效果
        const oldLiquor = this._liquor;
        oldLiquor?.effect?.deactivate();
        this._liquor = liquor;
        this._liquor.effect?.activate();
        EventCenter.emit(EventName.UI_UPDATE_DRINK, new UIUpdateDrinkEvent(ItemType.LIQUOR));

        // 计算泡酒物数量
        if (this._liquor.ingredientCapacity < (oldLiquor?.ingredientCapacity ?? 0)) {
            // 取消被卸下的泡酒物的效果
            this._ingredients.splice(0, oldLiquor.ingredientCapacity - this._liquor.ingredientCapacity)
                .forEach(ingredient => ingredient.effect.deactivate());
            EventCenter.emit(EventName.UI_UPDATE_DRINK, new UIUpdateDrinkEvent(ItemType.INGREDIENT));
        }
    }

    get ingredients(): InfusedIngredient[] {
        return this._ingredients;
    }

    /**
     * 添加泡酒物
     *
     * 超过数量上限时，移除第一个泡酒物
     *
     * @param ingredient 泡酒物
     */
    loadIngredient(ingredient: InfusedIngredient) {
        if (this._ingredients.indexOf(ingredient) !== -1) {
            return;
        }

        this._ingredients.push(ingredient);
        ingredient.effect.activate();

        if (this._ingredients.length > this._liquor.ingredientCapacity) {
            this._ingredients.shift().effect.deactivate(); // 移除第一个泡酒物并取消激活其效果
        }

        EventCenter.emit(EventName.UI_UPDATE_DRINK, new UIUpdateDrinkEvent(ItemType.INGREDIENT));
    }

    /**
     * 卸下泡酒物
     */
    unloadIngredient(ingredient: InfusedIngredient) {
        this._ingredients.splice(this._ingredients.indexOf(ingredient), 1);
        ingredient.effect.deactivate();
        EventCenter.emit(EventName.UI_UPDATE_DRINK, new UIUpdateDrinkEvent(ItemType.INGREDIENT));
    }

    /**
     * 获取所有酒饮物
     */
    getAll(): Item[] {
        return [this._gourd, this._liquor, ...this._ingredients];
    }

    /**
     * 恢复酒饮物
     *
     * @param drinks 酒饮物
     */
    restore(drinks: Item[]) {
        drinks.forEach(drink => {
            switch (drink.itemType) {
                case ItemType.GOURD:
                    this.gourd = drink as Gourd;
                    break;
                case ItemType.LIQUOR:
                    this.liquor = drink as Liquor;
                    break;
                case ItemType.INGREDIENT:
                    this.loadIngredient(drink as InfusedIngredient);
                    break;
            }
        });
    }

    /**
     * 获取自动恢复酒量进度
     */
    private get autoRecoverRatio(): number {
        return this._autoRecoverTimer / this._gourd.autoRecoverInterval;
    }
}
