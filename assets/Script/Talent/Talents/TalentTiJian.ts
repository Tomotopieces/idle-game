import { Talent } from "db://assets/Script/Talent/Talent";
import { SkillLightAttack } from "db://assets/Script/Skill/Skills/SkillLightAttack";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";

/**
 * 天赋.本事.根基.体健
 *
 * 每级少许增加普通攻击的攻击速度
 */
export class TalentTiJian extends Talent {
    static readonly NAME = 'ti_jian';
    static readonly DISPLAY_NAME = '体健';
    static readonly DESCRIPTION = '每级少许增加普通攻击的攻击速度';
    static readonly REQUIREMENT = 1;
    static readonly MAX_LEVEL = 2;

    /**
     * 攻击速度加成 Map
     *
     * 天赋等级 -> 攻速加成
     */
    private static readonly LIGHT_ATTACK_SPEED_BOOST_MAP = new Map<number, number>([
        [1, 0.3],
        [2, 0.8]
    ]);

    constructor() {
        super(TalentTiJian.NAME, TalentTiJian.DISPLAY_NAME, TalentTiJian.DESCRIPTION, TalentTiJian.REQUIREMENT, TalentTiJian.MAX_LEVEL);
    }

    protected activateEffect(): void {
        const skill = PlayerController.PLAYER.skills.getSkill(SkillLightAttack.NAME) as SkillLightAttack;
        skill.attackSpeedBoost += TalentTiJian.LIGHT_ATTACK_SPEED_BOOST_MAP.get(this.level);
    }

    protected deactivateEffect(): void {
        const skill = PlayerController.PLAYER.skills.getSkill(SkillLightAttack.NAME) as SkillLightAttack;
        skill.attackSpeedBoost -= TalentTiJian.LIGHT_ATTACK_SPEED_BOOST_MAP.get(this.level);
    }
}