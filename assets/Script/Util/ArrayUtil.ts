export class ArrayUtil {
    /**
     * flat
     *
     * @param array 二维数组
     * @return 一维数组
     */
    static flat<T>(array: T[][]): T[] {
        return array.reduce((a, b) => a.concat(b), []);
    }

    /**
     * groupBy
     *
     * @param array  数组
     * @param getKey key getter
     * @return Map<K, T[]>
     */
    static groupBy<T, K extends any>(array: T[], getKey: (item: T) => K): Map<K, T[]> {
        return array.reduce((map, item) => {
            const key = getKey(item);
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key).push(item);
            return map;
        }, new Map<K, T[]>());
    }
}