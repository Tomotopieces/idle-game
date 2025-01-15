import { GourdState } from "db://assets/Script/Gourd/GourdState";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
import { Liquor } from "db://assets/Script/Gourd/Liquor";

/**
 * 葫芦
 */
export abstract class Gourd {
    /**
     * 名称
     */
    name: string;

    /**
     * 显示名称
     */
    displayName: string;

    /**
     * 容量
     */
    capacity: number;

    /**
     * 剩余量
     */
    remain: number;

    /**
     * 饮尽后恢复的冷却时间（秒）
     */
    cooldown: number;

    /**
     * 酒
     */
    liquor: Liquor;

    /**
     * 引用效果
     */
    drinkEffect() {
        // 恢复血量
        PlayerController.PLAYER.recover(this.liquor.healthRecoverRatio);
    }

    /**
     * 饮尽效果
     */
    abstract drinkUpEffect(): void;

    /**
     * 下次记得，一气猛喝几口！美呦……
     */
    drink() {
        if (this.remain > 0) {
            this.remain--;
            this.drinkEffect();
            if (this.remain === 0) {
                this.drinkUpEffect();
            }
        }
    }

    /**
     * 获取状态
     */
    getState(): GourdState {
        return this.capacity === this.remain ? GourdState.FULL :
               this.remain > 0 ? GourdState.PARTIAL :
               GourdState.EMPTY;
    }
}