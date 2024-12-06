import { EventTarget } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { Equipment } from "db://assets/Script/Item/Equipment";

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
     * 附加生命值
     *
     * 武器装备、丹药、被动效果等
     */
    private _additionalHealth: number;

    /**
     * 生命倍率
     *
     * 初始为1.0
     */
    private _healthBoost: number;

    /**
     * 额外生命值
     *
     * 类似护盾，单独计算
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
        this._additionalHealth = 0;
        this._healthBoost = 1;
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
     * 最终生命上限
     *
     * (生命值 + 附加生命值) * 生命倍率 + 额外生命值
     */
    finalHealth(): number {
        return (this._maxHealth + this._additionalHealth) * this._healthBoost + this._extraHealth;
    }

    /**
     * 纸面最终伤害
     *
     * 不计算暴击
     *
     * （基础伤害 + 附加伤害) * 伤害倍率
     */
    paperFinalDamage(): number {
        return (this.baseDamage + this.additionalDamage) * this.damageBoost;
    }

    /**
     * 最终伤害
     *
     * （基础伤害 + 附加伤害) * 伤害倍率 * 暴击倍率
     */
    finalDamage(): number {
        const criticalBoost = Math.random() < this._criticalRate ? this._criticalBoost : 1; // 暴击
        return (this._baseDamage + this._additionalDamage) * this._damageBoost * criticalBoost;
    }

    /**
     * 最终防御
     *
     * （基础防御 + 附加防御) * 防御倍率
     */
    finalDefence(): number {
        return (this._baseDefence + this._additionalDefence) * this._defenceBoost;
    }

    /**
     * 受伤
     *
     * @param damage 伤害
     */
    getHurt(damage: number) {
        this.health -= Math.max(0, damage - this.finalDefence());
    }

    getAttributeFromEquipment(equipment: Equipment) {
        if (!equipment) {
            return;
        }

        this.additionalHealth += equipment.additionalHealth;
        this.healthBoost += equipment.healthBoost;
        this.extraHealth += equipment.extraHealth;
        this.additionalDamage += equipment.additionalDamage;
        this.damageBoost += equipment.damageBoost;
        this.criticalRate += equipment.criticalRate;
        this.criticalBoost += equipment.criticalBoost;
        this.additionalDefence += equipment.additionalDefence;
        this.defenceBoost += equipment.defenceBoost;
    }

    dropAttributeFromEquipment(equipment: Equipment) {
        if (!equipment) {
            return;
        }

        this.additionalHealth -= equipment.additionalHealth;
        this.healthBoost -= equipment.healthBoost;
        this.extraHealth -= equipment.extraHealth;
        this.additionalDamage -= equipment.additionalDamage;
        this.damageBoost -= equipment.damageBoost;
        this.criticalRate -= equipment.criticalRate;
        this.criticalBoost -= equipment.criticalBoost;
        this.additionalDefence -= equipment.additionalDefence;
        this.defenceBoost -= equipment.defenceBoost;
    }

    get health(): number {
        return this._health;
    }

    set health(value: number) {
        this._health = Math.min(Math.max(0, value), this._maxHealth); // 生命不超过最大值，不小于0

        if (this._health === 0) {
            (GlobalState.getState(GlobalStateName.EVENT_TARGET) as EventTarget).emit(EventName.PLAYER_DIE);
            // TODO 复活操作
        }
    }

    get maxHealth(): number {
        return this._maxHealth;
    }

    set maxHealth(value: number) {
        const syncHealth = this._health === this._maxHealth; // 在生命值满的情况下，提升上限后生命值与上限同步
        this._maxHealth = Math.max(0, value);

        this._health = syncHealth ? this._maxHealth : Math.min(this._maxHealth, this._health);
    }

    get additionalHealth(): number {
        return this._additionalHealth;
    }

    set additionalHealth(value: number) {
        this._additionalHealth = value; // 可为负数
    }

    get healthBoost(): number {
        return this._healthBoost;
    }

    set healthBoost(value: number) {
        this._healthBoost = Math.max(0, value); // 可小于1，不可小于0
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
