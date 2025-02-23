import { PassiveEffect } from "db://assets/Script/PassiveEffect/PassiveEffect";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { Unit, DealDamageEvent } from "db://assets/Script/Event/Events/DealDamageEvent";
import { EnemyController } from "db://assets/Script/Entity/Enemy/EnemyController";

/**
 * 独门妙用 白脸子
 *
 * 攻击生命危急的对手时，获得一定程度伤害加成（攻击对手生命低于30%时，攻击力+15%）
 */
export class UniqueUtilityBaiLianZi extends PassiveEffect {
    static readonly NAME = `bai_lian_zi`;
    static readonly DESCRIPTION = `攻击生命危急的对手时，获得一定程度伤害加成`;

    /**
     * 生效的生命值比例
     */
    private static AFFECT_HEALTH_RATIO = 0.3;

    /**
     * 生效时的伤害加成
     */
    private static FINAL_DAMAGE_BOOST = 1.15;

    constructor() {
        super(UniqueUtilityBaiLianZi.NAME, UniqueUtilityBaiLianZi.DESCRIPTION);
    }

    activate(): void {
        EventCenter.register(EventName.DEAL_DAMAGE, UniqueUtilityBaiLianZi.NAME,
            (event: DealDamageEvent) => {
                if (event.source !== Unit.PLAYER) {
                    return;
                }
                const enemy = EnemyController.ENEMY;
                if (enemy.attributes.health / enemy.attributes.maxHealth <= UniqueUtilityBaiLianZi.AFFECT_HEALTH_RATIO) {
                    event.damage *= UniqueUtilityBaiLianZi.FINAL_DAMAGE_BOOST;
                }
            }
        );
    }

    deactivate(): void {
        EventCenter.unregister(EventName.DEAL_DAMAGE, UniqueUtilityBaiLianZi.NAME);
    }

}