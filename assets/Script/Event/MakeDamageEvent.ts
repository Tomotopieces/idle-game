import { GlobalStateName } from "db://assets/Script/Util/Constant";

/**
 * 伤害事件
 */
export class MakeDamageEvent {
    /**
     * 伤害来源
     */
    readonly source: GlobalStateName.PLAYER | GlobalStateName.ENEMY;

    /**
     * 伤害目标
     */
    readonly target: GlobalStateName.PLAYER | GlobalStateName.ENEMY;

    /**
     * 伤害数值
     */
    readonly damage: number;

    constructor(source: GlobalStateName.PLAYER | GlobalStateName.ENEMY, target: GlobalStateName.PLAYER | GlobalStateName.ENEMY, damage: number) {
        this.source = source;
        this.target = target;
        this.damage = damage;
    }
}