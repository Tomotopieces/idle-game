import { _decorator, CCFloat, Component, ProgressBar, Animation, EventTarget } from 'cc';
import { GlobalState, GlobalStateName } from "db://assets/Script/Util/GlobalState";
import { EntityComponent } from "db://assets/Script/Component/EntityComponent";
import { EventName } from "db://assets/Script/Util/Constant";
import { PlayerController } from "db://assets/Script/PlayerController";

const { ccclass, property } = _decorator;

/**
 * 敌人控制器
 */
@ccclass('EnemyController')
export class EnemyController extends Component {
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
     * 实体组件
     */
    private _entity: EntityComponent = new EntityComponent();

    /**
     * 掉落奖励
     */
    private _drop: number = 0;

    /**
     * 自动攻击Interval ID
     */
    private _autoAttackInterval: number;

    start() {
        GlobalState.setState(GlobalStateName.ENEMY, this);

        // 获取组件
        this._anim = this.getComponent(Animation);
        this._healthBar = this.node.getChildByName('HealthBar').getComponent(ProgressBar);
        if (!this._anim) {
            console.error(`[EnemyController.start] get _anim failed`);
            return;
        } else if (!this._healthBar) {
            console.error(`[EnemyController.start] get _healthBar failed`);
            return;
        }

        this.init();
    }

    /**
     * 初始化基础数据
     */
    init() {
        this._entity.health = 100;
        this._entity.damage = 10;
        this._drop = 10;

        this._healthBar.progress = 1;

        // 自动攻击
        if (this._autoAttackInterval) {
            clearInterval(this._autoAttackInterval);
        }
        this._autoAttackInterval = setInterval(() => this.attack(), this.attackInterval * 1000);
    }

    /**
     * 受伤
     *
     * @param damage 伤害值
     */
    public hurt(damage: number) {
        this._entity.health -= damage;
        this.updateHealthBar();

        if (this._entity.health === 0) {
            this.onDie();
        }
    }

    /**
     * 更新血条显示
     */
    updateHealthBar() {
        this._healthBar.progress = this._entity.health / 100;
    }

    /**
     * 获取掉落奖励
     */
    public get drop(): number {
        return this._drop;
    }

    /**
     * 死亡
     */
    onDie() {
        (GlobalState.getState(GlobalStateName.EVENT_TARGET) as EventTarget).emit(EventName.ENEMY_DIE, this);
        this.init();
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
        const player = GlobalState.getState(GlobalStateName.PLAYER) as PlayerController;
        player.hurt(this._entity.damage);
    }
}


