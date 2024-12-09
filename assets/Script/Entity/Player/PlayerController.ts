import { _decorator, Animation, CCFloat, Component, ProgressBar } from 'cc';
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { EnemyController } from "db://assets/Script/Entity/Enemy/EnemyController";
import { PlayerAttributeComponent } from "db://assets/Script/Entity/Player/PlayerAttributeComponent";
import { PlayerLevelComponent } from "db://assets/Script/Entity/Player/PlayerLevelComponent";
import { PlayerEquipmentComponent } from "db://assets/Script/Entity/Player/PlayerEquipmentComponent";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { MakeDamageEvent } from "db://assets/Script/Event/MakeDamageEvent";

const { ccclass, property } = _decorator;

/**
 * 玩家控制器
 */
@ccclass('PlayerController')
export class PlayerController extends Component {
    /**
     * 攻击间隔（秒）
     */
    @property({ type: CCFloat, tooltip: '攻击间隔（秒）' })
    attackInterval: number = 1;

    /**
     * 血条
     */
    @property({ type: ProgressBar, tooltip: '血条' })
    healthBar: ProgressBar = null;

    /**
     * 动画机
     */
    private _anim: Animation = null;

    /**
     * 属性信息
     */
    private _attributes: PlayerAttributeComponent = new PlayerAttributeComponent();

    /**
     * 等级信息
     */
    private _levelInfo: PlayerLevelComponent = new PlayerLevelComponent();

    /**
     * 装备信息
     */
    private _equipments: PlayerEquipmentComponent = new PlayerEquipmentComponent(this._attributes);

    /**
     * 金币数
     */
    private _coin: number = 0;

    /**
     * 自动攻击计时器
     */
    private _autoAttackTimer = 0;

    start() {
        // 获取组件
        this._anim = this.getComponent(Animation);
        if (!this._anim) {
            console.error(`[PlayerController.start] get _anim failed`);
            return;
        } else if (!this.healthBar) {
            console.error(`[PlayerController.start] get _healthBar failed`);
            return;
        }

        // 监听敌人死亡事件
        EventCenter.on(EventName.ENEMY_DIE, (enemy: EnemyController) => this.onEnemyDie(enemy));
    }

    update(dt: number) {
        this.autoAttack(dt);
    }

    /**
     * 初始化基础数据
     */
    init() {
        this.updateHealthBar();
    }

    /**
     * 造成伤害
     *
     * 动画帧事件触发
     */
    makeDamage() {
        EventCenter.emit(EventName.MAKE_DAMAGE, new MakeDamageEvent(GlobalStateName.PLAYER, GlobalStateName.ENEMY, this._attributes.finalDamage()));
    }

    /**
     * 受伤
     *
     * @param damage 伤害值
     */
    hurt(damage: number) {
        this._attributes.getHurt(damage);
        this.updateHealthBar();

        if (this.attributes.health === 0) {
            EventCenter.emit(EventName.PLAYER_DIE, this);
            // TODO 复活
        }
    }

    get coin(): number {
        return this._coin;
    }

    /**
     * 设置金币数
     */
    set coin(value: number) {
        this._coin = value;
        EventCenter.emit(EventName.UI_UPDATE_COIN, this._coin);
    }

    get attributes(): PlayerAttributeComponent {
        return this._attributes;
    }

    get equipments(): PlayerEquipmentComponent {
        return this._equipments;
    }

    /**
     * 自动攻击
     *
     * @param dt delta time
     */
    private autoAttack(dt: number) {
        this._autoAttackTimer += dt;

        if (this._autoAttackTimer >= this.attackInterval) {
            this.attack();
            this._autoAttackTimer -= this.attackInterval;
        }
    }

    /**
     * 攻击
     */
    private attack() {
        this._anim.play('Attack');
    }

    /**
     * 更新血条显示
     */
    private updateHealthBar() {
        this.healthBar.progress = this._attributes.health / this._attributes.finalHealth();
    }

    /**
     * 敌人死亡
     *
     * @param enemy 敌人
     */
    private onEnemyDie(enemy: EnemyController) {
        EventCenter.emit(EventName.CALCULATE_DROP_ITEM, enemy.dropList);
    }
}
