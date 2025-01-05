import { Talent } from "db://assets/Script/Talent/Talent";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { DamageUnit, DealDamageEvent } from "db://assets/Script/Event/DealDamageEvent";
import { SkillState } from "db://assets/Script/Entity/Player/PlayerSkillManager";
import { SkillHeavyAttack } from "db://assets/Script/Skill/Skills/SkillHeavyAttack";
import { SkillLightAttack } from "db://assets/Script/Skill/Skills/SkillLightAttack";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";

/**
 * 天赋.本事.棍法.识破
 *
 * 若敌人攻击命中时，玩家正在进行轻棍攻击，且重棍已就绪，则取消当前的轻棍，立刻打出重棍。识破触发后，本次敌人攻击无效。
 */
export class TalentShiPo extends Talent {
    static readonly NAME = "shi_po";
    static readonly DISPLAY_NAME = "识破";
    static readonly DESCRIPTION = "识破";
    static readonly REQUIREMENT = 1;
    static readonly MAX_LEVEL = 1;

    constructor() {
        super(TalentShiPo.NAME, TalentShiPo.DISPLAY_NAME, TalentShiPo.DESCRIPTION, TalentShiPo.REQUIREMENT, TalentShiPo.MAX_LEVEL);
    }

    protected activateEffect(): void {
        const skills = PlayerController.PLAYER.skills;
        EventCenter.register(EventName.DEAL_DAMAGE, this.name, (event: DealDamageEvent) => {
            if (event.source === DamageUnit.ENEMY && // 敌人攻击命中时
                skills.state === SkillState.CASTING && // 玩家正在进行
                skills.currentSkill.name === SkillLightAttack.NAME && // 轻棍攻击
                skills.inQueue(SkillHeavyAttack.NAME) !== -1 // 重棍已就绪
            ) {
                skills.forceTrigger(SkillHeavyAttack.NAME); // 触发重棍
                event.damage = 0; // 敌人伤害无效
            }
        });
    }

    protected deactivateEffect(): void {
        EventCenter.unregister(EventName.DEAL_DAMAGE, this.name);
    }
}