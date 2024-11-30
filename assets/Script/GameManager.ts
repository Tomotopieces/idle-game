import { _decorator, Component, Node, EventTarget, sys, resources, JsonAsset } from 'cc';
import { GlobalState, GlobalStateName } from "db://assets/Script/Util/GlobalState";
import { PlayerController } from "db://assets/Script/PlayerController";
import { Item, ItemStack } from "db://assets/Script/Util/Item";

const { ccclass, property } = _decorator;

/**
 * 游戏管理器
 */
@ccclass('GameManager')
export class GameManager extends Component {
    /**
     * 玩家控制器
     */
    @property({ type: PlayerController, tooltip: '玩家控制器' })
    public player: PlayerController = null;

    /**
     * 道具表
     */
    private _itemTable: Map<number, Item> = null;

    /**
     * 仓库
     */
    private _storeHouse: Array<ItemStack> = new Array<ItemStack>();

    onLoad() {
        // 创建全局自定义事件管理器
        GlobalState.setState(GlobalStateName.EVENT_TARGET, new EventTarget());

        // 每隔10秒保存数据
        setInterval(() => this.saveData(), 10000);
        this.loadItemTable();
    }

    loadItemTable() {
        resources.load('ItemTable', (err: any, data: JsonAsset) => {
            const itemList = data.json! as Array<Item>;
            itemList.forEach(item => this._itemTable.set(item.id, item));
        });
        this._itemTable.forEach(item => console.log(`Load item: ${item.name}, ${item.description}`));
    }

    /**
     * 保存数据
     */
    saveData() {
        sys.localStorage.setItem('coin', this.player.coin.toString());
        console.log(`Save player coin: ${this.player.coin}`);
    }
}


