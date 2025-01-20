import { Buff } from "db://assets/Script/Buff/Buff";
import { Predicate } from "db://assets/Script/Util/Functions";

/**
 * Buff管理
 */
export class BuffManager {
    /**
     * 当前buff列表
     */
    private _buffs: Buff[] = [];

    /**
     * 更新buff
     *
     * @param dt 时间增量
     */
    update(dt: number) {
        this._buffs.forEach(buff => {
            buff.update(dt);
            buff.finish() && this.remove(buff);
        });
    }

    /**
     * 添加buff
     *
     * @param newBuff Buff
     */
    add(newBuff: Buff) {
        // 移除同名Buff
        this.remove(buff => buff.name === newBuff.name);

        // 添加buff
        newBuff.onActivate();
        this._buffs.push(newBuff);
    }

    /**
     * 移除buff
     *
     * @param condition 指定Buff或根据Buff判断的删除条件
     */
    remove(condition: Buff | Predicate<Buff>) {
        if (condition instanceof Buff) {
            this._buffs.splice(this._buffs.indexOf(condition), 1).forEach(buff => buff.onDeactivate());
            return;
        }

        this._buffs = this._buffs.filter(buff => {
            const shouldRemove = condition(buff);
            shouldRemove && buff.onDeactivate();
            return !shouldRemove;
        });
    }
}