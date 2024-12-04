import { _decorator, Animation, CCFloat, Component, EventTarget, ProgressBar } from 'cc';
import { EntityComponent } from "db://assets/Script/Component/EntityComponent";
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { EnemyController } from "db://assets/Script/Entity/Enemy/EnemyController";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";

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
    public attackInterval: number = 1;

    /**
     * 动画机
     */
    private _anim: Animation = null;

    /**
     * 血条
     */
    private _healthBar: ProgressBar = null;

    /**
     * 实体数据
     */
    private _entity: EntityComponent = new EntityComponent();

    /**
     * 事件中心
     */
    private _eventTarget: EventTarget;

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
        this._healthBar = this.node.getChildByName('HealthBar').getComponent(ProgressBar);
        this._eventTarget = GlobalState.getState(GlobalStateName.EVENT_TARGET);
        if (!this._anim) {
            console.error(`[PlayerController.start] get _anim failed`);
            return;
        } else if (!this._healthBar) {
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
        this._entity.health = 200;
        this._entity.damage = 20;
        GlobalState.getState(GlobalStateName.EVENT_TARGET).emit(EventName.UPDATE_PLAYER_DAMAGE, this._entity.damage);
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
        enemy.hurt(this._entity.damage);
    }

    /**
     * 更新血条显示
     */
    updateHealthBar() {
        this._healthBar.progress = this._entity.health / 200;
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
        this._entity.health -= damage;
        this.updateHealthBar();

        if (this._entity.health === 0) {
            this._eventTarget.emit(EventName.PLAYER_DIE);
            // TODO 复活
        }
    }

    /**
     * 获取金币数
     */
    public get coin(): number {
        return this._coin;
    }

    /**
     * 设置金币数
     */
    public set coin(value: number) {
        this._coin = value;
        this._eventTarget.emit(EventName.UPDATE_COIN, this._coin);
    }
}


