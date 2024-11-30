import { _decorator, Component, ProgressBar } from 'cc';
import { GlobalState, GlobalStateName } from "db://assets/Script/Util/GlobalState";
import { EntityComponent } from "db://assets/Script/Component/EntityComponent";

const { ccclass, property } = _decorator;

/**
 * 敌人控制器
 */
@ccclass('EnemyController')
export class EnemyController extends Component {
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
    private _reward: number = 10;

    start() {
        GlobalState.setState(GlobalStateName.ENEMY, this);

        this._healthBar = this.node.getChildByName('HealthBar').getComponent(ProgressBar);

        if (!this._healthBar) {
            console.error(`get _healthBar failed`);
            return;
        }

        this.init();
    }

    init() {
        this._entity.health = 100;
        this._entity.damage = 10;

        this._healthBar.progress = 1;
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
    public get reward(): number {
        return this._reward;
    }

    /**
     * 死亡触发
     */
    onDie() {
        GlobalState.getState(GlobalStateName.EVENT_TARGET).emit('EnemyDie', this);
        this.init();
    }
}


