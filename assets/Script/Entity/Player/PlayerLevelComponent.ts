import { EventName } from "db://assets/Script/Util/Constant";
import { EventCenter } from "db://assets/Script/Event/EventCenter";

/**
 * 玩家等级组件
 */
export class PlayerLevelComponent {
    /**
     * 等级
     */
    private _level: number;

    /**
     * 当前经验
     */
    private _experience: number;

    constructor() {
        this._level = 0;
        this.requirement();
        this._experience = 0;
    }

    /**
     * 恢复等级
     *
     * @param level      等级
     * @param experience 当前经验
     */
    restore(level: number, experience: number) {
        this._level = level;
        this._experience = experience;
    }

    /**
     * 获取经验
     *
     * @param experience 经验
     */
    gainExperience(experience: number): void {
        this._experience += experience;
        while (this._experience >= this.requirement()) {
            this.levelUp();
        }
        EventCenter.emit(EventName.UI_UPDATE_PLAYER_LEVEL_INFO, this);
    }

    /**
     * 当前等级升级所需经验
     *
     * 需求经验 = (等级 + 1） * 50
     */
    requirement(): number {
        return (this._level + 1) * 50;
    }

    get level(): number {
        return this._level;
    }

    get experience(): number {
        return this._experience;
    }

    /**
     * 升级
     */
    private levelUp() {
        this._experience -= this.requirement();
        this._level++;
        EventCenter.emit(EventName.PLAYER_LEVEL_UP, this._level);
    }
}