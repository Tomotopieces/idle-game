import { Animation } from 'cc';
import { Skill } from "db://assets/Script/Skill/Skill";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { MakeDamageEvent } from "db://assets/Script/Event/MakeDamageEvent";

/**
 * 技能 轻棍
 */
export class SkillLightAttack extends Skill {
    static readonly NAME: string = 'light_attack';
    static readonly DISPLAY_NAME: string = '轻棍';
    static readonly DESCRIPTION: string = '轻棍';
    static readonly COOLDOWN: number = 1;

    static readonly ANIMATION_NAME: string = 'LightAttack';

    /**
     * 玩家动画机
     */
    private _playerAnim: Animation;

    constructor() {
        super(SkillLightAttack.NAME, SkillLightAttack.DISPLAY_NAME, SkillLightAttack.DESCRIPTION, SkillLightAttack.COOLDOWN);
        this._playerAnim = this.player.getComponent(Animation);
        this.events.push(() => this.attackFrameEvent());
    }

    protected override trigger(): void {
        this._playerAnim.play(SkillLightAttack.ANIMATION_NAME);
    }

    protected override cost(): boolean {
        return true;
    }

    /**
     * 攻击帧事件
     */
    attackFrameEvent() {
        EventCenter.emit(EventName.MAKE_DAMAGE, new MakeDamageEvent(GlobalStateName.PLAYER, GlobalStateName.ENEMY, this.player.attributes.finalDamage()));
    }
}