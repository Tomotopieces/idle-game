import { _decorator, Animation, CCFloat, Component, EventTarget, ProgressBar, Sprite, SpriteFrame } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { EntityComponent } from "db://assets/Script/Component/EntityComponent";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { PlayerController } from "db://assets/Script/Entity/PlayerController";
import { DropItem } from "db://assets/Script/Item/DropItem";
import { EnemyInfo } from "db://assets/Script/Entity/Enemy/EnemyInfo";
import { ResourceManager, ResourceType } from "db://assets/Script/ResourceManager";

const { ccclass, property } = _decorator;

/**
 * 敌人控制器
 */
@ccclass('EnemyController')
export abstract class EnemyController extends Component {
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
     * 基本信息
     */
    private _info: EnemyInfo = null;

    /**
     * 实体组件
     */
    private _entity: EntityComponent = new EntityComponent();

    /**
     * 事件中心
     */
    private _eventTarget: EventTarget = null;

    /**
     * 自动攻击计时器
     */
    private _autoAttackTimer: number = 0;

    start() {
        GlobalState.setState(GlobalStateName.ENEMY, this);
        this._eventTarget = GlobalState.getState(GlobalStateName.EVENT_TARGET) as EventTarget;

        // 获取组件
        this._anim = this.getComponent(Animation);
        if (!this._anim) {
            console.error(`[EnemyController.start] get _anim failed`);
            return;
        } else if (!this.healthBar) {
            console.error(`[EnemyController.start] get _healthBar failed`);
            return;
        }

        this._eventTarget.emit(EventName.ENEMY_RESTORE_SAVE_DATA);
    }

    update(dt: number) {
        this.autoAttack(dt);
    }

    /**
     * 初始化基础数据
     */
    init() {
        this._entity.health = this._info.health;
        this._entity.damage = this._info.damage;
        ResourceManager.getAsset(ResourceType.SPRITE_FRAME, this._info.icon, (spriteFrame: SpriteFrame) => {
            this.getComponent(Sprite).spriteFrame = spriteFrame;
        });
        this.updateHealthBar();
    }

    /**
     * 自动攻击
     *
     * @param dt 时间间隔
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
     * 受伤
     *
     * @param damage 伤害值
     */
    hurt(damage: number) {
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
        this.healthBar.progress = this._entity.health / this._info.health;
    }

    /**
     * 死亡
     */
    onDie() {
        this._eventTarget.emit(EventName.ENEMY_DIE, this);
        this.init();
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

    /**
     * 获取掉落奖励
     */
    get dropList(): Array<DropItem> {
        return this._info.dropList;
    }

    /**
     * 获取敌人信息
     */
    get info(): EnemyInfo {
        return this._info;
    }

    /**
     * 设置敌人信息
     *
     * @param value 敌人信息
     */
    set info(value: EnemyInfo) {
        this._info = value;
        this.init();
    }
}
