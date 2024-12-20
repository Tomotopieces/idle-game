import { Skill } from "db://assets/Script/Skill/Skill";
import { PlayerSkillResources } from "db://assets/Script/Entity/Player/PlayerSkillResources";

/**
 * 技能状态
 */
export enum SkillState {
    /**
     * 空闲
     */
    IDLE,

    /**
     * 释放中
     */
    CASTING,
}

/**
 * 玩家技能管理器
 */
export class PlayerSkillManager {
    /**
     * 技能资源
     */
    readonly resources = new PlayerSkillResources();

    /**
     * 自动释放技能表
     *
     * 技能名 -> 技能
     */
    private readonly _autoSkillMap = new Map<string, Skill>();

    /**
     * 技能队列
     */
    private readonly _skillQueue = new Array<Skill>();

    /**
     * 玩家技能状态
     */
    private _state: SkillState = SkillState.IDLE;

    /**
     * 更新技能时间
     *
     * @param deltaTime 时间增量
     */
    update(deltaTime: number) {
        this._autoSkillMap.forEach(skill => skill.update(deltaTime));
        if (this._skillQueue.length && this._state === SkillState.IDLE) {
            this._skillQueue.shift().trigger();
        }
    }

    /**
     * 触发技能事件
     *
     * @param skillName  技能名称
     * @param eventIndex 事件索引
     */
    triggerEvent(skillName: string, eventIndex: number) {
        if (this._autoSkillMap.has(skillName)) {
            this._autoSkillMap.get(skillName).triggerEvent(eventIndex);
        }
    }

    /**
     * 添加技能
     *
     * @param skill 技能
     */
    addSkill(skill: Skill) {
        this._autoSkillMap.set(skill.name, skill);
    }

    /**
     * 获取技能
     *
     * @param skillName 技能名
     */
    getSkill(skillName: string): Skill {
        return this._autoSkillMap.get(skillName);
    }

    /**
     * 添加到技能队列
     *
     * @param skill 技能
     */
    queue(skill: Skill) {
        this._skillQueue.push(skill);
    }

    idle() {
        this._state = SkillState.IDLE;
    }

    get state(): SkillState {
        return this._state;
    }
}
