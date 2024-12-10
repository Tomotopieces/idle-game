import { _decorator, Component, Label } from 'cc';
import { EventName } from "db://assets/Script/Util/Constant";
import { PlayerAttributeComponent } from "db://assets/Script/Entity/Player/PlayerAttributeComponent";
import { EventCenter } from "db://assets/Script/Event/EventCenter";

const { ccclass, property } = _decorator;

/**
 * 玩家属性面板
 */
@ccclass('AttributePanel')
export class AttributePanel extends Component {
    /**
     * 金币Label
     */
    @property({ type: Label, tooltip: '金币Label' })
    coinLabel: Label;

    /**
     * 伤害Label
     */
    @property({ type: Label, tooltip: '伤害Label' })
    damageLabel: Label;

    /**
     * 防御Label
     */
    @property({ type: Label, tooltip: '防御Label' })
    defenseLabel: Label;

    /**
     * 暴击Label
     */
    @property({ type: Label, tooltip: '暴击Label' })
    criticalLabel: Label;

    /**
     * 暴击伤害倍率Label
     */
    @property({ type: Label, tooltip: '暴击伤害倍率Label' })
    criticalBoostLabel: Label;

    onLoad() {
        EventCenter.on(EventName.UI_UPDATE_COIN, this.node.name, (coin: number) => this.coinLabel.string = coin.toString());
        EventCenter.on(EventName.UI_UPDATE_ATTRIBUTE_PANEL, this.node.name, (event: PlayerAttributeComponent) => this.onUpdateAttributePanel(event));
    }

    /**
     * 更新属性面板
     *
     * @param event 事件参数
     */
    private onUpdateAttributePanel(event: PlayerAttributeComponent) {
        this.damageLabel.string = event.paperFinalDamage().toString();
        this.defenseLabel.string = event.finalDefense().toString();
        this.criticalLabel.string = event.criticalRate * 100 + '%';
        this.criticalBoostLabel.string = event.criticalBoost * 100 + '%';
    }
}


