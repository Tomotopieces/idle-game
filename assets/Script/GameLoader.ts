import { _decorator, Component, director, EventTarget, JsonAsset, ProgressBar, resources } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { DataPath, EventName, GlobalStateName, SceneName } from "db://assets/Script/Util/Constant";
import { Item } from "db://assets/Script/Item/Item";
import { EnemyInfoJson } from "db://assets/Script/Entity/Enemy/EnemyInfoJson";
import { EnemyInfo } from "db://assets/Script/Entity/Enemy/EnemyInfo";

const { ccclass, property } = _decorator;

/**
 * 游戏加载器
 */
@ccclass('GameLoader')
export class GameLoader extends Component {
    /**
     * 加载进度条
     */
    @property({ type: ProgressBar, tooltip: '加载进度条' })
    loadingBar: ProgressBar = null;

    /**
     * 自定义事件管理器
     */
    private _eventTarget: EventTarget;

    /**
     * 道具表加载完成
     */
    private _loadItemFinished: boolean = false;

    /**
     * 敌人表加载完成
     */
    private _loadEnemyFinished: boolean = false;

    onLoad() {
        // 创建自定义事件管理器
        this._eventTarget = new EventTarget();
        GlobalState.setState(GlobalStateName.EVENT_TARGET, this._eventTarget);

        this._eventTarget.on(EventName.LOAD_PROGRESS, () => this.onLoadProgress());

        // 加载配置文件
        this.loadItemTable();
    }

    start() {
        this.loadingBar.progress = 0;
    }

    /**
     * 加载道具表
     */
    loadItemTable() {
        resources.load(DataPath.ITEM_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            const itemList = data.json! as Array<Item>;
            const itemTable = new Map<number, Item>();
            itemList.forEach(item => itemTable.set(item.id, item));
            GlobalState.setState(GlobalStateName.ITEM_TABLE, itemTable);

            this._loadItemFinished = true;
            this.loadingBar.progress += 0.5;
            this._eventTarget.emit(EventName.LOAD_PROGRESS);

            this.loadEnemyTable(); // 顺序加载，避免敌人表加载道具信息时找不到道具信息
        });
    }

    /**
     * 加载敌人表
     */
    loadEnemyTable() {
        resources.load(DataPath.ENEMY_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            const rawInfoList = data.json! as Array<EnemyInfoJson>;
            const infoTable = new Map<number, EnemyInfo>();
            rawInfoList.forEach(jsonInfo => infoTable.set(jsonInfo.id, EnemyInfoJson.toEnemyInfo(jsonInfo)));
            GlobalState.setState(GlobalStateName.ENEMY_TABLE, infoTable);

            this._loadEnemyFinished = true;
            this.loadingBar.progress += 0.5;
            this._eventTarget.emit(EventName.LOAD_PROGRESS);
        });
    }

    /**
     * 加载进度变化
     */
    private onLoadProgress() {
        if (!this._loadItemFinished || !this._loadEnemyFinished) {
            return;
        }

        director.loadScene(SceneName.GAME);
    }
}


