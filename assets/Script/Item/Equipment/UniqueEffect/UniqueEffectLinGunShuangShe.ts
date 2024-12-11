import { UniqueEffect } from "db://assets/Script/Item/Equipment/UniqueEffect/UniqueEffect";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { MakeDamageEvent } from "db://assets/Script/Event/MakeDamageEvent";

/**
 * 独门妙用 鳞棍·双蛇
 *
 * 玩家角色每第4次攻击，最终伤害翻倍
 */
export class UniqueEffectLinGunShuangShe extends UniqueEffect {
    static readonly NAME: string = "lin_gun_shuang_she";
    static readonly DESCRIPTION: string = "每第4次攻击，最终伤害翻倍。";

    /**
     * 生效的攻击次数
     */
    private static readonly EFFECT_ATTACK_COUNT: number = 4;

    /**
     * 生效时的最终伤害的加成
     */
    private static readonly FINAL_DAMAGE_BOOST: number = 2;

    /**
     * 攻击次数
     */
    private _attackCount: number = 0;

    constructor() {
        super(UniqueEffectLinGunShuangShe.NAME, UniqueEffectLinGunShuangShe.DESCRIPTION);
    }

    onActivate(): void {
        this._attackCount = 0;
        EventCenter.register(EventName.MAKE_DAMAGE, UniqueEffectLinGunShuangShe.NAME,
            (event: MakeDamageEvent) => {
                if (event.source !== GlobalStateName.PLAYER) {
                    return;
                }

                this._attackCount++;
                if (this._attackCount >= UniqueEffectLinGunShuangShe.EFFECT_ATTACK_COUNT) {
                    this._attackCount -= UniqueEffectLinGunShuangShe.EFFECT_ATTACK_COUNT;
                    event.damage *= UniqueEffectLinGunShuangShe.FINAL_DAMAGE_BOOST;
                }
            }
        );
    }

    onDeactivate(): void {
        EventCenter.unregister(EventName.MAKE_DAMAGE, UniqueEffectLinGunShuangShe.NAME);
    }
}