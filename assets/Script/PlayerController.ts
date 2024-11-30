import { _decorator, Animation, Component, ProgressBar, EventTarget } from 'cc';
import { EntityComponent } from "db://assets/Script/Component/EntityComponent";
import { GlobalState, GlobalStateName } from "db://assets/Script/Util/GlobalState";
import { EnemyController } from "db://assets/Script/EnemyController";

const { ccclass, property } = _decorator;

/**
 * 玩家控制器
 */
@ccclass('PlayerController')
export class PlayerController extends Component {
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

    private _eventTarget: EventTarget;

    private _coin: number = 0;

    start() {
        // 玩家对象放入全局状态
        GlobalState.setState(GlobalStateName.PLAYER, this);

        // 获取组件
        this._anim = this.node.getComponent(Animation);
        this._healthBar = this.node.getChildByName('HealthBar').getComponent(ProgressBar);
        if (!this._anim) {
            console.error(`get _anim failed`);
            return;
        } else if (!this._healthBar) {
            console.error(`get _healthBar failed`);
            return;
        }

        // 监听敌人死亡事件
        this._eventTarget = GlobalState.getState(GlobalStateName.EVENT_TARGET);
        this._eventTarget.on('EnemyDie', (enemy: EnemyController) => this.onEnemyDie(enemy));

        // 自动攻击
        setInterval(() => this.attack(), 1000);

        this.init();
    }

    /**
     * 初始化基础数据
     */
    init() {
        this._entity.health = 200;
        this._entity.damage = 20;
        this.updateHealthBar();
    }

    /**
     * 攻击
     */
    attack() {
        this._anim.play('Attack');
    }

    /**
     * 造成伤害
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
     * @param enemy 敌人
     */
    onEnemyDie(enemy: EnemyController) {
        this._coin += enemy.reward;
        this._eventTarget.emit('GetCoin', this._coin);
    }
}


