import { Skill } from "db://assets/Script/Skill/Skill";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { DamageUnit, DealDamageEvent } from "db://assets/Script/Event/DealDamageEvent";
import { EventName } from "db://assets/Script/Event/EventName";

/**
 * 技能 重棍
 */
export class SkillHeavyAttack extends Skill {
    static readonly NAME = 'heavy_attack';
    static readonly DISPLAY_NAME = '重棍';
    static readonly DESCRIPTION = '重棍';
    static readonly COOLDOWN = 5;

    /**
     * 动画名称
     */
    static readonly ANIMATION_NAME = 'HeavyAttack';

    constructor() {
        super(SkillHeavyAttack.NAME, SkillHeavyAttack.DISPLAY_NAME, SkillHeavyAttack.DESCRIPTION, SkillHeavyAttack.COOLDOWN);
        this.events.push(() => this.attackFrameEvent());
    }

    override trigger(): void {
        this.playerAnim.play(SkillHeavyAttack.ANIMATION_NAME);
    }

    protected override cost(): boolean {
        return this.player.skills.resources.costOneStanceLevel();
    }

    /**
     * 攻击帧事件
     */
    private attackFrameEvent() {
        const costResult = this.player.skills.resources.costOneStanceLevel();
        const finalDamageBoost = costResult ? 1.5 : 1.2; // 若消耗棍势，则伤害更高
        EventCenter.emit(EventName.DEAL_DAMAGE, new DealDamageEvent(
            DamageUnit.PLAYER,
            DamageUnit.ENEMY,
            this.player.attributes.finalDamage() * finalDamageBoost))
    }
}