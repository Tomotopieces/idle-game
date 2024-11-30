import { _decorator, Animation, CCFloat, Component, EventTarget, ProgressBar, sys } from 'cc';
import { EntityComponent } from "db://assets/Script/Component/EntityComponent";
import { GlobalState, GlobalStateName } from "db://assets/Script/Util/GlobalState";
import { EnemyController } from "db://assets/Script/EnemyController";
import { EventName } from "db://assets/Script/Util/Constant";

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
     * 自定义事件管理器
     */
    private _eventTarget: EventTarget;

    /**
     * 金币数
     */
    private _coin: number = 0;

    /**
     * 自动攻击Interval ID
     */
    private _autoAttackInterval: number;

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
    }

    /**
     * 初始化基础数据
     */
    init() {
        const coin = parseInt(sys.localStorage.getItem('coin'));
        if (coin) {
            this._coin = coin;
            this._eventTarget.emit(EventName.GET_COIN, this._coin);
            console.log(`Load player coin: ${this._coin}`);
        }

        this._entity.health = 200;
        this._entity.damage = 20;
        this.updateHealthBar();

        // 自动攻击
        if (this._autoAttackInterval) {
            clearInterval(this._autoAttackInterval);
        }
        this._autoAttackInterval = setInterval(() => this.attack(), this.attackInterval * 1000);
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
        this._coin += enemy.drop;
        this._eventTarget.emit(EventName.GET_COIN, this._coin);
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
}


