import { UniqueUtility } from "db://assets/Script/Equipment/UniqueUtility/UniqueUtility";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { DamageUnit, DealDamageEvent } from "db://assets/Script/Event/Events/DealDamageEvent";
import { EventName } from "db://assets/Script/Event/EventName";

/**
 * 独门妙用 鳞棍·双蛇
 *
 * 玩家角色每第4次攻击，最终伤害翻倍
 */
export class UniqueUtilityLinGunShuangShe extends UniqueUtility {
    static readonly NAME: string = "lin_gun_shuang_she";
    static readonly DESCRIPTION: string = "每第4次攻击，最终伤害翻倍。";

    /**
     * 生效的攻击次数
     */
    private static readonly AFFECT_ATTACK_COUNT: number = 4;

    /**
     * 生效时的最终伤害的加成
     */
    private static readonly FINAL_DAMAGE_BOOST: number = 2;

    /**
     * 攻击次数
     */
    private _attackCount: number = 0;

    constructor() {
        super(UniqueUtilityLinGunShuangShe.NAME, UniqueUtilityLinGunShuangShe.DESCRIPTION);
    }

    override onActivate(): void {
        this._attackCount = 0;
        EventCenter.register(EventName.DEAL_DAMAGE, UniqueUtilityLinGunShuangShe.NAME,
            (event: DealDamageEvent) => {
                if (event.source !== DamageUnit.PLAYER) {
                    return;
                }

                this._attackCount++;
                if (this._attackCount >= UniqueUtilityLinGunShuangShe.AFFECT_ATTACK_COUNT) {
                    this._attackCount -= UniqueUtilityLinGunShuangShe.AFFECT_ATTACK_COUNT;
                    event.damage *= UniqueUtilityLinGunShuangShe.FINAL_DAMAGE_BOOST;
                }
            }
        );
    }

    override onDeactivate(): void {
        EventCenter.unregister(EventName.DEAL_DAMAGE, UniqueUtilityLinGunShuangShe.NAME);
    }
}