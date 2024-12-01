/**
 * 金币ID
 */
export const COIN_ID = 1;

/**
 * 场景名称常量
 */
export enum SceneName {
    /**
     * 加载场景
     */
    Load = 'Load',

    /**
     * 游戏场景
     */
    GAME = 'Game',
}

/**
 * 配置常量
 */
export enum ConfigName {
    /**
     * 存档数据
     */
    SAVE_DATA = 'SAVE_DATA',
}

/**
 * 事件名称常量
 */
export enum EventName {
    /**
     * 加载进度
     */
    LOAD_PROGRESS = 'LOAD_PROGRESS',

    /**
     * 玩家恢复存档数据
     */
    PLAYER_RESTORE_SAVE_DATA = 'PLAYER_RESTORE_SAVE_DATA',

    /**
     * 敌人恢复存档数据
     */
    ENEMY_RESTORE_SAVE_DATA = 'ENEMY_RESTORE_SAVE_DATA',

    /**
     * 敌人死亡
     */
    ENEMY_DIE = 'ENEMY_DIE',

    /**
     * 玩家死亡
     */
    PLAYER_DIE = 'PLAYER_DIE',

    /**
     * 计算掉落物品
     */
    CALCULATE_DROP_ITEM = 'CALCULATE_DROP_ITEM',

    /**
     * 更新金币
     */
    UPDATE_COIN = 'UPDATE_COIN',

    /**
     * 更新玩家攻击力
     */
    UPDATE_PLAYER_DAMAGE = 'UPDATE_PLAYER_DAMAGE',
}

/**
 * 全局状态名称常量
 */
export enum GlobalStateName {
    /**
     * 物品表
     */
    ITEM_TABLE = 'ItemTable',

    /**
     * 敌人表
     */
    ENEMY_TABLE = 'EnemyTable',

    /**
     * 自定义事件管理器
     */
    EVENT_TARGET = 'EventTarget',

    /**
     * 玩家
     */
    PLAYER = 'Player',

    /**
     * 敌人
     */
    ENEMY = 'Enemy',
}