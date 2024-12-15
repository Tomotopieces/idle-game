import { GlobalStateName } from "db://assets/Script/Util/Constant";
import { EventArgument } from "db://assets/Script/Event/EventArgument";

export type DamageSource = GlobalStateName.PLAYER | GlobalStateName.ENEMY;

/**
 * 伤害事件
 */
export class MakeDamageEvent extends EventArgument {
    /**
     * 伤害来源
     */
    source: GlobalStateName.PLAYER | GlobalStateName.ENEMY;

    /**
     * 伤害目标
     */
    target: GlobalStateName.PLAYER | GlobalStateName.ENEMY;

    /**
     * 伤害数值
     */
    damage: number;

    constructor(source: DamageSource, target: DamageSource, damage: number) {
        super();
        this.source = source;
        this.target = target;
        this.damage = damage;
    }
}