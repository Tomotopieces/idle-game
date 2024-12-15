/**
 * 灵韵名称
 */
export const LING_YUN_NAME = 'ling_yun';

/**
 * 默认关卡名称
 */
export enum DefaultLevelName {
    /**
     * 区域（黑风山）
     */
    AREA = 'hei_feng_shan',

    /**
     * 舞台（苍狼林）
     */
    STAGE = 'cang_lang_lin',
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
     * 敌人死亡
     */
    ENEMY_DIE = 'ENEMY_DIE',

    /**
     * 玩家死亡
     */
    PLAYER_DIE = 'PLAYER_DIE',

    /**
     * 获取掉落物
     */
    GET_DROPS = 'GET_DROPS',

    /**
     * 获取经验
     */
    GET_EXPERIENCE = 'GET_EXPERIENCE',

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
     * 造成伤害
     */
    MAKE_DAMAGE = 'MAKE_DAMAGE',

    /**
     * 点击物品槽UI
     */
    UI_CLICK_ITEM_SLOT = 'UI_CLICK_ITEM_SLOT',

    /**
     * 更新仓库UI
     */
    UI_UPDATE_STOREHOUSE = 'UI_UPDATE_STOREHOUSE',

    /**
     * 更新玩家等级UI
     */
    UI_UPDATE_PLAYER_LEVEL_INFO = 'UI_UPDATE_PLAYER_LEVEL_INFO',

    /**
     * 更新属性面板UI
     */
    UI_UPDATE_ATTRIBUTE_PANEL = 'UI_UPDATE_ATTRIBUTE_PANEL',

    /**
     * 更新装备栏UI
     */
    UI_UPDATE_EQUIPMENT = 'UI_UPDATE_EQUIPMENT',

    /**
     * 发送消息UI
     */
    UI_POST_MESSAGE = 'UI_POST_MESSAGE',
}

/**
 * 全局状态名称常量
 */
export enum GlobalStateName {
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
