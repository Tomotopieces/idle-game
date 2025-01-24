import { EventArgument } from "db://assets/Script/Event/EventArgument";

/**
 * 玩家饮酒事件
 */
export class PlayerDrinkEvent extends EventArgument {
    /**
     * 恢复血量百分比
     */
    healthRecoverRatio: number;

    constructor(healthRecoverRatio: number) {
        super();
        this.healthRecoverRatio = healthRecoverRatio;
    }
}