title: 一致性hash算法
categories:
  - java
tags:
  - 算法
  - 缓存
abbrlink: 57793
author: kerns
date: 2020-02-25 00:00:00
---
### 主要用途

相比简单hash 减少分布式缓存 添加一台机器或者减少一台机器时候，对于缓存路由到新的机子，导致缓存穿透的问题。
*** 
### 代码
```
/**
 * 一致性hash算法
 */
public class ConsistenceHash {
    /**
     * 物理节点
     */
    private List<String> realNode = new ArrayList<String>();
    /**
     * 物理节点对应的虚拟节点。key 对应的是物理节点，value对应的是虚拟节点的hash值
     */
    private Map<String, List<Integer>> real2VirtualMap = new HashMap();
    /**
     * 虚拟节点数量
     */
    private int virtualNum = 100;
    /**
     * 虚拟节点对应的物理节点,利用红黑树存贮
     */
    private SortedMap<Integer, String> sortedMap = new TreeMap<Integer, String>();

    /**
     * 添加物理节点
     *
     * @param node
     */
    public void addServer(String node) {
        realNode.add(node);
        String vnode = null;
        int count = 0, i = 0;
        while (count < virtualNum) {
            vnode = node + "V_" + i;//生成虚拟节点
            int hashValue = getHash(vnode); // 虚拟节点hash value
            if (!sortedMap.containsKey(hashValue)) {
                sortedMap.put(hashValue, node);
                if (!real2VirtualMap.containsKey(node)) {
                    List<Integer> virtualNodes = new ArrayList<Integer>();
                    real2VirtualMap.put(node, virtualNodes);
                }
                real2VirtualMap.get(node).add(hashValue);
                sortedMap.put(hashValue, node);
            }
            count++;
        }
    }

    /**
     * 删除物理节点，当节点下线或者说节点被移除
     *
     * @param node
     */
    public void removeServer(String node) {
        // 虚拟节点下园环
        List<Integer> virtualNodes = real2VirtualMap.get(node);
        if (virtualNodes != null && !virtualNodes.isEmpty()) {
            for (Integer virtualNode : virtualNodes) {
                sortedMap.remove(virtualNode);
            }
        }
        //删除物理节点
        realNode.remove(node);
        virtualNodes.remove(node);

    }


    /**
     * 通过 缓存key 获取物理节点
     *
     * @param key
     * @return
     */
    public String getServer(String key) {
        int hashValue = getHash(key);
        SortedMap<Integer, String> subMap = sortedMap.tailMap(hashValue);
        //圆环当没有比这个hash更大的值的时候，获取最小值，最大值的总结是最小值
        if (subMap == null || subMap.isEmpty()) {
            return sortedMap.get(sortedMap.firstKey());
        }
        return subMap.get(subMap.firstKey());
    }

    /**
     * 为什么不用 object的hash，因为 自带的hash 散列层度不够,而且有可能是负数
     *
     * @param str
     * @return
     */
    private static int getHash(String str) {
        final int p = 1677619;
        int hash = (int) 2166136261L;
        for (int i = 0; i < str.length(); i++) {
            hash = (hash ^ str.charAt(i)) * p;
        }
        hash += hash << 13;
        hash ^= hash >> 7;
        hash += hash << 3;
        hash ^= hash >> 17;
        hash += hash << 5;
        if (hash < 0) {
            hash = Math.abs(hash);
        }
        return hash;
    }


    public static void main(String[] args){
        ConsistenceHash consistenceHash=new ConsistenceHash();
        consistenceHash.addServer("192.168.1.1");
        consistenceHash.addServer("192.168.1.2");
        consistenceHash.addServer("192.168.1.3");
        consistenceHash.addServer("192.168.1.4");
        consistenceHash.addServer("192.168.1.5");
        System.out.println(consistenceHash.getServer("1"));
        System.out.println(consistenceHash.getServer("2"));
        System.out.println(consistenceHash.getServer("3"));
        System.out.println(consistenceHash.getServer("4"));
        System.out.println(consistenceHash.getServer("5"));
        consistenceHash.removeServer("192.168.1.5");
        System.out.println("after remove "+consistenceHash.getServer("1"));
        System.out.println("after remove "+consistenceHash.getServer("2"));
        System.out.println("after remove "+consistenceHash.getServer("3"));
        System.out.println("after remove "+consistenceHash.getServer("4"));
        System.out.println("after remove "+consistenceHash.getServer("5"));
    }
}
```
### 参考资料
