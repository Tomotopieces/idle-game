import { Gourd } from "db://assets/Script/Drink/Gourd/Gourd";

/**
 * 葫芦管理
 */
export class GourdManager {
    /**
     * 葫芦
     */
    private _gourd: Gourd;

    get gourd(): Gourd {
        return this._gourd;
    }

    set gourd(gourd: Gourd) {
        this._gourd = gourd;
        // TODO 计算剩余酒量与泡酒物配置
    }

    // TODO 实现切换葫芦、酒、泡酒物的逻辑
}