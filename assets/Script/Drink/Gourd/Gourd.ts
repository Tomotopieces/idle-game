import { GourdState } from "db://assets/Script/Drink/Gourd/GourdState";
import { Liquor } from "db://assets/Script/Drink/Liquor/Liquor";
import { InfusedIngredient } from "db://assets/Script/Drink/InfusedIngredient/InfusedIngredient";
import { GourdMeta } from "db://assets/Script/Drink/Gourd/GourdMeta";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { PlayerDrinkEvent } from "db://assets/Script/Event/Events/PlayerDrinkEvent";
import { Item } from "db://assets/Script/Item/Item";
import { UniqueUtility } from "db://assets/Script/Equipment/UniqueUtility/UniqueUtility";

/**
 * 葫芦
 */
export class Gourd extends Item {
    /**
     * 元数据
     */
    readonly meta: GourdMeta;

    /**
     * 剩余量
     */
    private _remain: number;

    /**
     * 酒
     */
    private _liquor: Liquor;

    /**
     * 泡酒物
     */
    private readonly _ingredients: InfusedIngredient[];

    /**
     * 自动恢复计时器
     */
    private _autoRecoverTimer: number;

    /**
     * 自动饮用计时器
     */
    private _autoDrinkTimer: number;

    constructor(meta: GourdMeta) {
        super(meta);
        this.meta = meta;

        this._remain = this.meta.capacity;
        this._liquor = null;
        this._ingredients = [];
        this._autoRecoverTimer = 0;
        this._autoDrinkTimer = 0;
    }

    /**
     * update
     *
     * @param dt deltaTime 时间增量
     */
    update(dt: number) {
        if (!this._liquor) {
            return;
        }

        // 自动恢复酒量
        this._autoRecoverTimer += dt;
        if (this._autoRecoverTimer >= this.meta.autoRecoverInterval) {
            this._autoRecoverTimer -= this.meta.autoRecoverInterval;
            this.recover();
        }

        // 自动饮用
        this._autoDrinkTimer += dt;
        if (this._autoDrinkTimer >= this.meta.autoDrinkInterval) {
            this._autoDrinkTimer -= this.meta.autoDrinkInterval;
            this.drink();
        }
    }

    /**
     * 下回试试，一气猛喝几口！美呦……
     */
    drink() {
        if (this._remain <= 0 || !this._liquor) {
            return;
        }

        // 饮用效果
        EventCenter.emit(EventName.PLAYER_DRINK, new PlayerDrinkEvent(this._liquor.healthRecoverRatio, this));
        this._remain--;
    }

    /**
     * 恢复酒量
     *
     * @param count 恢复量
     */
    recover(count: number = 1) {
        this._remain = Math.min(this.meta.capacity, this._remain + count);
    }

    /**
     * 获取剩余酒量状态
     */
    get state(): GourdState {
        return this.meta.capacity === this._remain ? GourdState.FULL :
               this._remain > 0 ? GourdState.PARTIAL :
               GourdState.EMPTY;
    }

    get remain(): number {
        return this._remain;
    }

    get liquor(): Liquor {
        return this._liquor;
    }

    /**
     * 设置酒
     *
     * @param liquor 新酒
     */
    setLiquor(liquor: Liquor) {
        const oldLiquor = this._liquor;
        oldLiquor?.drinkEffect.onDeactivate(); // 取消旧酒效果（可能为空）

        this._liquor = liquor;
        this._liquor.drinkEffect.onActivate(); // 激活新酒效果（必定不为空）

        // 计算泡酒物
        if (this._liquor.ingredientCapacity < (oldLiquor?.ingredientCapacity ?? 0)) {
            this._ingredients.splice(0, oldLiquor.ingredientCapacity - this._liquor.ingredientCapacity)
                .forEach(ingredient => {
                    ingredient.drinkEffect.onDeactivate();
                    // TODO 存入仓库
                });
        }
    }

    get ingredients(): InfusedIngredient[] {
        return this._ingredients;
    }

    /**
     * 设置泡酒物
     *
     * @param ingredient 新泡酒物
     * @param index      槽位索引
     */
    setIngredient(ingredient: InfusedIngredient, index: number) {
        this._ingredients[index].drinkEffect?.onDeactivate(); // 取消旧泡酒物效果（可能为空）
        this._ingredients[index] = ingredient;
        ingredient && ingredient.drinkEffect.onActivate(); // 激活新泡酒物效果（可能为空）
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

    get ingredientCapacity(): number {
        return this._liquor.ingredientCapacity;
    }
}