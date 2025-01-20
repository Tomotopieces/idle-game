import { EventArgument } from "db://assets/Script/Event/EventArgument";
import { Gourd } from "db://assets/Script/Drink/Gourd/Gourd";

/**
 * 玩家饮酒事件
 */
export class PlayerDrinkEvent extends EventArgument {
    /**
     * 恢复血量百分比
     */
    healthRecoverRatio: number;

    /**
     * 葫芦
     */
    gourd: Gourd;

    constructor(healthRecoverRatio: number, gourd: Gourd) {
        super();
        this.healthRecoverRatio = healthRecoverRatio;
        this.gourd = gourd;
    }
}