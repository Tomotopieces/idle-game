import { EventArgument } from "db://assets/Script/Event/EventArgument";

/**
 * 伤害交互单位
 */
export enum DamageUnit {
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
    source: DamageUnit;

    /**
     * 伤害目标
     */
    target: DamageUnit;

    /**
     * 伤害数值
     */
    damage: number;

    constructor(source: DamageUnit, target: DamageUnit, damage: number) {
        super();
        this.source = source;
        this.target = target;
        this.damage = damage;
    }
}