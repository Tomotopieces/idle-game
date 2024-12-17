import { Animation } from 'cc';
import { Skill } from "db://assets/Script/Skill/Skill";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { DamageUnit, DealDamageEvent } from "db://assets/Script/Event/DealDamageEvent";
import { EventName } from "db://assets/Script/Event/EventName";

/**
 * 技能 轻棍
 */
export class SkillLightAttack extends Skill {
    static readonly NAME: string = 'light_attack';
    static readonly DISPLAY_NAME: string = '轻棍';
    static readonly DESCRIPTION: string = '轻棍';
    static readonly COOLDOWN: number = 1;

    /**
     * 动画名称
     */
    static readonly ANIMATION_NAME: string = 'LightAttack';

    /**
     * 攻击获得的棍势
     */
    static readonly GAIN_STANCE: number = 100;

    /**
     * 攻击速度倍率
     */
    private _attackSpeedBoost: number = 1;

    /**
     * 玩家动画机
     */
    private _playerAnim: Animation;

    constructor() {
        super(SkillLightAttack.NAME, SkillLightAttack.DISPLAY_NAME, SkillLightAttack.DESCRIPTION, SkillLightAttack.COOLDOWN);
        this._playerAnim = this.player.getComponent(Animation);
        this.events.push(() => this.attackFrameEvent());
    }

    override update(deltaTime: number) {
        if (this.timer < this.cooldown / this._attackSpeedBoost) {
            this.timer += deltaTime;
        } else if (this.cost()) {
            this.timer = 0;
            this.trigger();
        }
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
        EventCenter.emit(EventName.DEAL_DAMAGE, new DealDamageEvent(DamageUnit.PLAYER, DamageUnit.ENEMY, this.player.attributes.finalDamage()));
        EventCenter.emit(EventName.GAIN_STANCE, SkillLightAttack.GAIN_STANCE);
    }

    set attackSpeedBoost(value: number) {
        this._attackSpeedBoost = value;
        this._playerAnim.getState(SkillLightAttack.ANIMATION_NAME).speed = this._attackSpeedBoost;
    }
}