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
    DEAL_DAMAGE = 'DEAL_DAMAGE',

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
     * 点击天赋槽UI
     */
    UI_CLICK_TALENT_SLOT = 'UI_CLICK_TALENT_SLOT',

    /**
     * 发送消息UI
     */
    UI_POST_MESSAGE = 'UI_POST_MESSAGE',

    /**
     * 更新灵光点UI
     */
    UI_UPDATE_SPARKS = 'UI_UPDATE_SPARKS',

    /**
     * 获得棍势
     */
    GAIN_STANCE = 'GAIN_STANCE',

    /**
     * 天赋升级
     */
    TALENT_UPGRADE = 'TALENT_UPGRADE',

    /**
     * 更新天赋槽UI
     */
    UI_UPDATE_TALENT_SLOT = 'UI_UPDATE_TALENT_SLOT',

    /**
     * 点击配方槽UI
     */
    UI_CLICK_RECIPE_SLOT = "UI_CLICK_RECIPE_SLOT",
}