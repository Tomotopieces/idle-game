import { EMPTY_FUNCTION, Runnable } from "db://assets/Script/Util/Functions";
import { Unit } from "db://assets/Script/Event/Events/DealDamageEvent";

/**
 * Buff类型
 */
export enum BuffType {
    /**
     * 增益
     */
    BUFF,

    /**
     * 减益
     */
    DEBUFF
}

/**
 * 增益/减益效果
 */
export class Buff {
    /**
     * Buff名称
     *
     * 相同名称的Buff只能同时存在一个
     */
    readonly name: string;

    /**
     * Buff类型
     */
    readonly type: BuffType;

    /**
     * 作用对象
     */
    readonly target: Unit;

    /**
     * 持续时长（秒）
     */
    readonly duration: number;

    /**
     * 触发间隔（秒）
     */
    readonly interval: number;

    /**
     * 开始效果
     */
    readonly onActivate: Runnable;

    /**
     * 间隔触发效果
     */
    readonly onInterval: Runnable;

    /**
     * 结束效果
     */
    readonly onDeactivate: Runnable;

    /**
     * 触发间隔计时器
     */
    private _intervalTimer: number;

    /**
     * 持续时长计时器
     */
    private _durationTimer: number;

    constructor(name: string, target: Unit, type: BuffType, duration: number, interval: number, onActivate: Runnable, onInterval: Runnable, onDeactivate: Runnable) {
        this.name = name;
        this.type = type;
        this.target = target;
        this.duration = duration;
        this.interval = interval ?? duration;
        this.onActivate = onActivate ?? EMPTY_FUNCTION;
        this.onInterval = onInterval ?? EMPTY_FUNCTION;
        this.onDeactivate = onDeactivate ?? EMPTY_FUNCTION;

        this._durationTimer = 0;
        this._intervalTimer = 0;
    }

    /**
     * 更新
     *
     * @param dt 时间增量
     */
    update(dt: number) {
        this._durationTimer += dt;
        this._intervalTimer += dt;

        if (this._intervalTimer >= this.interval) {
            this._intervalTimer -= this.interval;
            this.onInterval();
        }
    }

    /**
     * 是否已经结束
     */
    finish(): boolean {
        return this._durationTimer >= this.duration;
    }
}
