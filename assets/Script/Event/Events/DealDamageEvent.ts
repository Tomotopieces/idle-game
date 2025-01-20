import { EventArgument } from "db://assets/Script/Event/EventArgument";

/**
 * 作用单位
 */
export enum Unit {
    PLAYER = 'Player',
    ENEMY = 'Enemy'
}

/**
 * 伤害事件
 */
export class DealDamageEvent extends EventArgument {
    /**
     * 伤害来源
     */
    source: Unit;

    /**
     * 伤害目标
     */
    target: Unit;

    /**
     * 伤害数值
     */
    damage: number;

    constructor(source: Unit, target: Unit, damage: number) {
        super();
        this.source = source;
        this.target = target;
        this.damage = damage;
    }
}