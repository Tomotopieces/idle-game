import { EventTarget } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";

// 默认生命值
const DEFAULT_HEALTH = 200;

// 默认伤害
const DEFAULT_DAMAGE = 20;

// 默认暴击伤害倍率
const DEFAULT_CRITICAL_BOOST = 1.5;

/**
 * 玩家战斗数值组件
 */
export class PlayerCombatComponent {
    /**
     * 生命值
     */
    private _health: number;

    /**
     * 最大生命值
     */
    private _maxHealth: number;

    /**
     * 额外生命值
     */
    private _extraHealth: number;

    /**
     * 基础伤害
     */
    private _baseDamage: number;

    /**
     * 附加伤害
     *
     * 武器装备、丹药、被动效果等
     */
    private _additionalDamage: number;

    /**
     * 伤害倍率
     *
     * 初始为1.0
     */
    private _damageBoost: number;

    /**
     * 暴击率
     */
    private _criticalRate: number;

    /**
     * 暴击伤害倍率
     *
     * 初始为1.5，不低于1.0
     */
    private _criticalBoost: number;

    /**
     * 基础防御
     */
    private _baseDefence: number;

    /**
     * 附加防御
     *
     * 装备、丹药、被动效果等
     */
    private _additionalDefence: number;

    /**
     * 防御倍率
     *
     * 初始为1.0
     */
    private _defenceBoost: number;

    constructor() {
        this._health = this._maxHealth = DEFAULT_HEALTH;
        this._extraHealth = 0;
        this._baseDamage = DEFAULT_DAMAGE;
        this._additionalDamage = 0;
        this._damageBoost = 1;
        this._criticalRate = 0;
        this._criticalBoost = DEFAULT_CRITICAL_BOOST;
        this._baseDefence = 0;
        this._additionalDefence = 0;
        this._defenceBoost = 1;
    }

    /**
     * 纸面最终伤害
     *
     * 不计算暴击
     */
    paperFinalDamage(): number {
        return (this.baseDamage + this.additionalDamage) * this.damageBoost;
    }

    /**
     * 最终伤害
     */
    finalDamage(): number {
        const criticalBoost = Math.random() < this._criticalRate ? this._criticalBoost : 1; // 暴击
        return (this._baseDamage + this._additionalDamage) * this._damageBoost * criticalBoost;
    }

    /**
     * 最终防御
     */
    finalDefence(): number {
        return (this._baseDefence + this._additionalDefence) * this._defenceBoost;
    }

    getHurt(damage: number) {
        this.health -= Math.max(0, damage - this.finalDefence());
    }

    get health(): number {
        return this._health;
    }

    set health(value: number) {
        this._health = Math.min(Math.max(0, value), this._maxHealth); // 生命不超过最大值

        if (this._health === 0) {
            (GlobalState.getState(GlobalStateName.EVENT_TARGET) as EventTarget).emit(EventName.PLAYER_DIE);
            // TODO 复活操作
        }
    }

    get maxHealth(): number {
        return this._maxHealth;
    }

    set maxHealth(value: number) {
        this._maxHealth = Math.max(0, value);
    }

    get extraHealth(): number {
        return this._extraHealth;
    }

    set extraHealth(value: number) {
        this._extraHealth = Math.max(0, value);
    }

    get baseDamage(): number {
        return this._baseDamage;
    }

    set baseDamage(value: number) {
        this._baseDamage = Math.max(0, value);
    }

    get additionalDamage(): number {
        return this._additionalDamage;
    }

    set additionalDamage(value: number) {
        this._additionalDamage = Math.max(0, value);
    }

    get damageBoost(): number {
        return this._damageBoost;
    }

    set damageBoost(value: number) {
        this._damageBoost = Math.max(0, value); // 可小于1，不可小于0
    }

    get criticalRate(): number {
        return this._criticalRate;
    }

    set criticalRate(value: number) {
        this._criticalRate = Math.max(0, value); // 可大于1，不影响逻辑
    }

    get criticalBoost(): number {
        return this._criticalBoost;
    }

    set criticalBoost(value: number) {
        this._criticalBoost = Math.max(1, value); // 暴击伤害不会低于无暴击伤害
    }

    get baseDefence(): number {
        return this._baseDefence;
    }

    set baseDefence(value: number) {
        this._baseDefence = Math.max(0, value);
    }

    get additionalDefence(): number {
        return this._additionalDefence;
    }

    set additionalDefence(value: number) {
        this._additionalDefence = Math.max(0, value);
    }

    get defenceBoost(): number {
        return this._defenceBoost;
    }

    set defenceBoost(value: number) {
        this._defenceBoost = Math.max(0, value); // 可小于1，不可小于0
    }
}