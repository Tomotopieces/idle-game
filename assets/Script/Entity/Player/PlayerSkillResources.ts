/**
 * 棍势升级所需值
 */
const STANCE_LEVEL_UP_REQUIREMENT = new Map<number, number>([
    [0, 90],
    [1, 110],
    [2, 130],
    [3, 150],
    [4, 0]
]);

/**
 * 默认法力值
 */
const DEFAULT_MANA = 50;

/**
 * 技能资源
 */
export class PlayerSkillResources {
    /**
     * 棍势
     */
    private _stance: number = 0;

    /**
     * 棍势等级
     */
    private _stanceLevel: number = 0;

    /**
     * 法力值
     */
    private _mana: number = DEFAULT_MANA;

    /**
     * 基础法力上限
     */
    private _baseMana: number = DEFAULT_MANA;

    /**
     * 附加法力
     */
    private _additionalMana: number = 0;

    /**
     * 法力倍率
     */
    private _manaBoost: number = 1;

    /**
     * 消耗一级棍势等级
     */
    costOneStanceLevel(): boolean {
        if (!this._stanceLevel) {
            return false;
        }

        const ratio = this._stance / STANCE_LEVEL_UP_REQUIREMENT.get(this._stanceLevel);
        this._stanceLevel--;
        this._stance = Math.round(ratio * STANCE_LEVEL_UP_REQUIREMENT.get(this._stanceLevel)); // 重新计算棍势等级
        return true;
    }

    /**
     * 消耗所有棍势等级
     */
    costAllStanceLevel(): number {
        if (!this._stanceLevel) {
            return 0;
        }

        const level = this._stanceLevel;
        const ratio = this._stance / STANCE_LEVEL_UP_REQUIREMENT.get(this._stanceLevel);
        this._stanceLevel = 0;
        this._stance = STANCE_LEVEL_UP_REQUIREMENT.get(0) * ratio;

        return level;
    }

    get stance(): number {
        return this._stance;
    }

    /**
     * 获得棍势
     *
     * @param value 棍势
     */
    set stance(value: number) {
        if (this._stanceLevel === 4) {
            return;
        }

        this._stance = value;
        while (this._stance >= STANCE_LEVEL_UP_REQUIREMENT.get(this._stanceLevel) && this._stanceLevel < 4) {
            this._stance -= STANCE_LEVEL_UP_REQUIREMENT.get(this._stanceLevel);
            this._stanceLevel++;
        }

        if (this._stanceLevel === 4) {
            this._stance = 0;
        }
    }

    get stanceLevel(): number {
        return this._stanceLevel;
    }

    get mana(): number {
        return this._mana;
    }

    set mana(value: number) {
        this._mana = value;
    }

    get baseMana(): number {
        return this._baseMana;
    }

    set baseMana(value: number) {
        this._baseMana = value;
    }

    get additionalMana(): number {
        return this._additionalMana;
    }

    set additionalMana(value: number) {
        this._additionalMana = value;
    }

    get manaBoost(): number {
        return this._manaBoost;
    }

    set manaBoost(value: number) {
        this._manaBoost = value;
    }
}