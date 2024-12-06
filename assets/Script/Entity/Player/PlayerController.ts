import { _decorator, Animation, CCFloat, Component, EventTarget, ProgressBar } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { EnemyController } from "db://assets/Script/Entity/Enemy/EnemyController";
import { PlayerCombatComponent } from "db://assets/Script/Entity/Player/PlayerCombatComponent";
import { PlayerLevelComponent } from "db://assets/Script/Entity/Player/PlayerLevelComponent";
import { PlayerEquipmentComponent } from "db://assets/Script/Entity/Player/PlayerEquipmentComponent";

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
     * 事件中心
     */
    private _eventTarget: EventTarget;

    /**
     * 战斗信息
     */
    private _combatComponent: PlayerCombatComponent;

    /**
     * 等级信息
     */
    private _levelComponent: PlayerLevelComponent;

    /**
     * 装备信息
     */
    private _equipmentComponent: PlayerEquipmentComponent;

    /**
     * 金币数
     */
    private _coin: number = 0;

    /**
     * 自动攻击计时器
     */
    private _autoAttackTimer = 0;

    start() {
        // 玩家对象放入全局状态
        GlobalState.setState(GlobalStateName.PLAYER, this);

        // 获取组件
        this._anim = this.getComponent(Animation);
        this._eventTarget = GlobalState.getState(GlobalStateName.EVENT_TARGET);
        if (!this._anim) {
            console.error(`[PlayerController.start] get _anim failed`);
            return;
        } else if (!this.healthBar) {
            console.error(`[PlayerController.start] get _healthBar failed`);
            return;
        }

        // 监听敌人死亡事件
        this._eventTarget.on(EventName.ENEMY_DIE, (enemy: EnemyController) => this.onEnemyDie(enemy));

        this.init();
        this._eventTarget.emit(EventName.PLAYER_RESTORE_SAVE_DATA);
    }

    update(dt: number) {
        this.autoAttack(dt);
    }

    /**
     * 初始化基础数据
     */
    init() {
        this._levelComponent = new PlayerLevelComponent();

        this._equipmentComponent = new PlayerEquipmentComponent(this._combatComponent);

        this._combatComponent = new PlayerCombatComponent();
        GlobalState.getState(GlobalStateName.EVENT_TARGET).emit(EventName.UPDATE_PLAYER_DAMAGE, this._combatComponent.paperFinalDamage());
        this.updateHealthBar();
    }

    /**
     * 自动攻击
     *
     * @param dt delta time
     */
    autoAttack(dt: number) {
        this._autoAttackTimer += dt;

        if (this._autoAttackTimer >= this.attackInterval) {
            this.attack();
            this._autoAttackTimer -= this.attackInterval;
        }
    }

    /**
     * 攻击
     */
    attack() {
        this._anim.play('Attack');
    }

    /**
     * 造成伤害
     *
     * 动画帧事件触发
     */
    makeDamage() {
        const enemy = GlobalState.getState(GlobalStateName.ENEMY) as EnemyController;
        enemy.hurt(this._combatComponent.finalDamage());
    }

    /**
     * 更新血条显示
     */
    updateHealthBar() {
        this.healthBar.progress = this._combatComponent.health / this._combatComponent.finalHealth();
    }

    /**
     * 敌人死亡
     *
     * @param enemy 敌人
     */
    onEnemyDie(enemy: EnemyController) {
        this._eventTarget.emit(EventName.CALCULATE_DROP_ITEM, enemy.dropList);
    }

    /**
     * 受伤
     *
     * @param damage 伤害值
     */
    hurt(damage: number) {
        this._combatComponent.getHurt(damage);
        this.updateHealthBar();
    }

    /**
     * 获取金币数
     */
    get coin(): number {
        return this._coin;
    }

    /**
     * 设置金币数
     */
    set coin(value: number) {
        this._coin = value;
        this._eventTarget.emit(EventName.UPDATE_COIN, this._coin);
    }
}
