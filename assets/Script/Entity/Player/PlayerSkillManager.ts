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
     * 技能表
     *
     * 技能名 -> 技能
     */
    private readonly _skillMap = new Map<string, Skill>();

    /**
     * 技能队列
     */
    private _skillQueue: Skill[] = [];

    /**
     * 玩家技能状态
     */
    private _state: SkillState = SkillState.IDLE;

    /**
     * 正在释放的技能
     */
    private _currentSkill: Skill;

    /**
     * 更新技能时间
     *
     * @param dt 时间增量
     */
    update(dt: number) {
        this._autoSkillMap.forEach(skill => skill.update(dt));
        if (this._skillQueue.length && this._state === SkillState.IDLE) {
            this._currentSkill = this._skillQueue.shift();
            this._currentSkill.trigger();
            this._state = SkillState.CASTING;
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
     * @param auto  是否自动释放
     */
    addSkill(skill: Skill, auto: boolean = true) {
        this._skillMap.set(skill.name, skill);
        auto && this._autoSkillMap.set(skill.name, skill);
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

    /**
     * 恢复闲置状态
     */
    idle() {
        this._state = SkillState.IDLE;
        this._currentSkill = null;
    }

    /**
     * 检查技能是否在队列中
     *
     * @param skillName 技能名
     * @return 在队列中的索引，否则返回 -1
     */
    inQueue(skillName: string): number {
        return this._skillQueue.findIndex(skill => skill.name === skillName);
    }

    /**
     * 强制触发技能
     *
     * @param skillName 技能名
     */
    forceTrigger(skillName: string) {
        this._skillQueue = this._skillQueue.filter(skill => skill.name !== skillName); // 若技能队列中存在该技能，则删除
        this.cancel(); // 取消当前技能
        this._skillMap.get(skillName).trigger();
        this._state = SkillState.CASTING;
    }

    /**
     * 觉醒前世记忆
     */
    cancel() {
        this._currentSkill.cancel();
    }

    get state(): SkillState {
        return this._state;
    }

    get currentSkill(): Skill {
        return this._currentSkill;
    }
}
