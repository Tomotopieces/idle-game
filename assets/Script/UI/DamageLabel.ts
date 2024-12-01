import { _decorator, Component, Label } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";

const { ccclass } = _decorator;

/**
 * 攻击力Label
 */
@ccclass('DamageLabel')
export class DamageLabel extends Component {
    /**
     * Label
     */
    private _label: Label;

    start() {
        this._label = this.getComponent(Label);

        GlobalState.getState(GlobalStateName.EVENT_TARGET)
            .on(EventName.UPDATE_PLAYER_DAMAGE, (damage: number) => this.updateDamage(damage));
    }

    /**
     * 更新攻击力Label
     *
     * @param damage 攻击力
     */
    private updateDamage(damage: number) {
        this._label.string = `${damage}`;
    }
}


