import { _decorator, Animation, Component } from 'cc';
import { TalentCard } from "db://assets/Script/UI/Talent/TalentCard";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Util/Constant";
import { TalentSlot } from "db://assets/Script/UI/Talent/TalentSlot";

const { ccclass, property } = _decorator;

@ccclass('TalentPanel')
export class TalentPanel extends Component {
    /**
     * 天赋信息卡片
     */
    @property({ type: TalentCard, tooltip: '天赋信息卡片' })
    talentCard: TalentCard;

    /**
     * 动画机
     */
    private _anim: Animation;

    /**
     * 是否显示
     */
    private _show: boolean = false;

    onLoad() {
        this._anim = this.node.getComponent(Animation);
        EventCenter.on(EventName.UI_CLICK_TALENT_SLOT, this.node.name, (talentSlot: TalentSlot) => this.onClickTalentSlot(talentSlot))
    }

    /**
     * 切换显示
     *
     * 按钮触发
     */
    toggle() {
        this._show = !this._show;
        this._anim.play(this._show ? 'Enter' : 'Exit');
        if (!this._show) {
            this.talentCard.hide();
        }
    }

    private onClickTalentSlot(talentSlot: TalentSlot) {
        const position = talentSlot.node.getWorldPosition();
        this.talentCard.show(position, talentSlot.talentTreeNode);
    }
}


