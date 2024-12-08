import { _decorator, Animation, CCFloat, Component, ProgressBar, Sprite, SpriteFrame } from 'cc';
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { DropItem } from "db://assets/Script/Item/DropItem";
import { EnemyInfo } from "db://assets/Script/Entity/Enemy/EnemyInfo";
import { ResourceManager, ResourceType } from "db://assets/Script/ResourceManager";
import { EnemyAttributeComponent } from "db://assets/Script/Entity/Enemy/EnemyAttributeComponent";
import { EventCenter } from "db://assets/Script/Util/EventCenter";
import { MakeDamageEvent } from "db://assets/Script/Event/MakeDamageEvent";

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
    private attributes: EnemyAttributeComponent;

    /**
     * 自动攻击计时器
     */
    private _autoAttackTimer: number = 0;

    onLoad() {
        this._anim = this.getComponent(Animation);
    }

    update(dt: number) {
        this.autoAttack(dt);
    }

    /**
     * 受伤
     *
     * @param damage 伤害值
     */
    hurt(damage: number) {
        this.attributes.getHurt(damage);
        this.updateHealthBar();

        if (this.attributes.health === 0) {
            this.onDie();
        }
    }

    /**
     * 造成伤害
     *
     * 动画帧事件触发
     */
    makeDamage() {
        EventCenter.emit(EventName.MAKE_DAMAGE, new MakeDamageEvent(GlobalStateName.ENEMY, GlobalStateName.PLAYER, this.attributes.finalDamage()));
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

    /**
     * 初始化基础数据
     */
    private init() {
        this.attributes = new EnemyAttributeComponent(this._info);
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
        this.healthBar.progress = this.attributes.health / this.attributes.maxHealth;
    }

    /**
     * 死亡
     */
    private onDie() {
        this._anim.play('Die');
        this._autoAttackTimer = 0;
        this.init();
        EventCenter.emit(EventName.ENEMY_DIE, this);
    }
}
