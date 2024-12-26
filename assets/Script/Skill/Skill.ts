import { Animation, AnimationState } from 'cc';
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
import { Runnable } from "db://assets/Script/Util/Functions";

/**
 * 技能
 */
export abstract class Skill {
    /**
     * 名称
     */
    readonly name: string;

    /**
     * 显示名称
     */
    readonly displayName: string;

    /**
     * 描述
     */
    readonly description: string;

    /**
     * 冷却时间（秒）
     */
    readonly cooldown: number;

    /**
     * 玩家角色
     */
    protected readonly player: PlayerController;

    /**
     * 玩家动画机
     */
    protected readonly playerAnim: Animation;

    /**
     * 计时器
     */
    protected timer: number;

    /**
     * 技能事件
     */
    protected events: Runnable[];

    /**
     * 是否正在排队
     */
    protected queuing: boolean;

    protected constructor(name: string, displayName: string, description: string, cooldown: number) {
        this.player = PlayerController.PLAYER;
        this.playerAnim = this.player.getComponent(Animation);
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.cooldown = cooldown;
        this.timer = 0;
        this.events = [];

        this.playerAnim.on(Animation.EventType.STOP, (type: Animation.EventType, state: AnimationState) => this.handleAnimationStop(type, state), this.playerAnim);
    }

    /**
     * 消耗
     */
    protected abstract cost(): boolean;

    /**
     * 更新
     *
     * @param deltaTime 时间增量
     */
    update(deltaTime: number) {
        if (this.timer < this.cooldown) {
            this.timer += deltaTime;
        } else if (this.cost() && !this.queuing) {
            this.player.skills.queue(this);
            this.queuing = true;
        }
    }

    /**
     * 触发
     */
    trigger(): void {
        this.timer = 0; // 在释放技能后再开始冷却
    };

    /**
     * 触发事件
     *
     * @param eventIndex 事件索引
     */
    triggerEvent(eventIndex: number) {
        this.events[eventIndex]();
    }

    /**
     * 觉醒前世记忆
     */
    cancel() {
        this.playerAnim.stop();
    }

    /**
     * 处理动画结束事件
     */
    protected handleAnimationStop(_type: Animation.EventType, _state: AnimationState) {
        this.player.skills.idle();
        this.queuing = false;
    }
}