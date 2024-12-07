/**
 * 灵韵名称
 */
export const LING_YUN_NAME = 'ling_yun';

/**
 * 默认舞台和区域名称
 */
export enum DefaultStaffName {
    /**
     * 默认区域名称（黑风山）
     */
    DEFAULT_AREA_NAME = 'hei_feng_shan',

    /**
     * 默认舞台名称（苍狼林）
     */
    DEFAULT_STAGE_NAME = 'cang_lang_lin',
}

/**
 * 场景名称常量
 */
export enum SceneName {
    /**
     * 加载场景
     */
    LOAD = 'Load',

    /**
     * 游戏场景
     */
    GAME = 'Game',
}

/**
 * 数据资源路径常量
 */
export enum DataPath {
    /**
     * 道具配置表
     */
    ITEM_TABLE = 'data/item_table',

    /**
     * 装备配置表
     */
    EQUIPMENT_TABLE = 'data/equipment_table',

    /**
     * 敌人配置表
     */
    ENEMY_TABLE = 'data/enemy_table',

    /**
     * 关卡配置表
     */
    STAGE_TABLE = 'data/stage_table',

    /**
     * 区域配置表
     */
    AREA_TABLE = 'data/area_table',
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

    /**
     * 更新仓库
     */
    UPDATE_STOREHOUSE = 'UPDATE_STOREHOUSE',

    /**
     * 更新关卡
     */
    UPDATE_LEVEL = 'UPDATE_LEVEL',

    /**
     * 玩家升级
     */
    PLAYER_LEVEL_UP = 'PLAYER_LEVEL_UP',

    /**
     * 装备变更
     */
    EQUIPMENT_CHANGE = 'EQUIPMENT_CHANGE',

    /**
     * 点击物品槽
     */
    CLICK_ITEM_SLOT = 'CLICK_ITEM_SLOT',
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
     * 舞台表
     */
    STAGE_TABLE = 'StageTable',

    /**
     * 区域表
     */
    AREA_TABLE = 'AreaTable',

    /**
     * 事件中心
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

    /**
     * 仓库
     */
    STOREHOUSE = 'Storehouse',

    /**
     * 区域
     */
    AREA = 'Area',

    /**
     * 舞台
     */
    STAGE = 'Stage',
}
