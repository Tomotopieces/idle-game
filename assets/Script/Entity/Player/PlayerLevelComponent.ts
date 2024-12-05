import { EventTarget } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";

/**
 * 玩家等级组件
 */
export class PlayerLevelComponent {
    /**
     * 等级
     */
    private _level: number;

    /**
     * 升级所需经验
     */
    private _requiredExperience: number;

    /**
     * 当前经验
     */
    private _currentExperience: number;

    constructor() {
        this._level = 1;
        this._requiredExperience = 100;
        this._currentExperience = 0;
    }

    /**
     * 升级
     */
    levelUp(): void {
        this._level++;
        this._requiredExperience += 50;
        this._currentExperience -= this._requiredExperience;
        (GlobalState.getState(GlobalStateName.EVENT_TARGET) as EventTarget).emit(EventName.PLAYER_LEVEL_UP, this._level);
    }

    /**
     * 计算升级所需经验
     *
     * @param level 等级
     */
    calculateRequiredExperience(level: number): number {
        return (level + 1) * 50;
    }

    /**
     * 获取经验
     *
     * @param experience 经验
     */
    gainExperience(experience: number): void {
        this._currentExperience += experience;
        while (this._currentExperience >= this._requiredExperience) {
            this.levelUp();
        }
    }

    get level(): number {
        return this._level;
    }

    set level(value: number) {
        this._level = value;
    }

    get requiredExperience(): number {
        return this._requiredExperience;
    }

    set requiredExperience(value: number) {
        this._requiredExperience = value;
    }

    get currentExperience(): number {
        return this._currentExperience;
    }

    set currentExperience(value: number) {
        this._currentExperience = value;
    }
}