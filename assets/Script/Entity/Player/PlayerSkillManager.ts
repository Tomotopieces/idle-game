import { Skill } from "db://assets/Script/Skill/Skill";
import { PlayerSkillResources } from "db://assets/Script/Entity/Player/PlayerSkillResources";

/**
 * 玩家技能管理器
 */
export class PlayerSkillManager {
    /**
     * 技能表
     *
     * 技能名 -> 技能
     */
    private readonly _skillMap = new Map<string, Skill>();

    /**
     * 技能资源
     */
    readonly resources = new PlayerSkillResources();

    /**
     * 更新技能时间
     *
     * @param deltaTime 时间增量
     */
    update(deltaTime: number) {
        this._skillMap.forEach(skill => skill.update(deltaTime));
    }

    /**
     * 触发技能事件
     *
     * @param skillName  技能名称
     * @param eventIndex 事件索引
     */
    triggerEvent(skillName: string, eventIndex: number) {
        if (this._skillMap.has(skillName)) {
            this._skillMap.get(skillName).triggerEvent(eventIndex);
        }
    }

    /**
     * 添加技能
     *
     * @param skill 技能
     */
    addSkill(skill: Skill) {
        this._skillMap.set(skill.name, skill);
    }

    /**
     * 获取技能
     *
     * @param skillName 技能名
     */
    getSkill(skillName: string): Skill {
        return this._skillMap.get(skillName);
    }
}
