title: ignite整理
categories:
  - java
tags:
  - ignite
  - 内存关系型数据库
  - cache
abbrlink: 57792
date: 2019-09-02 00:00:00
---

## 简介
ignite 是一个关系型的，可扩展的内存数据库，主要用于高速更新的数据的实时查询和关联查询，支持sql查询和流数据的插入。
目前主要用于矿机实时数据的收集。
优点 ：支持sql查询
缺点：查询数据不稳定，表和cache的绑定这块目前做的不够好，增加字段需要修改配置，重启启动和加载数据。


## 创建表和cache的关联，只能在public schema 操作

```
CREATE TABLE IF NOT EXISTS person (
  id int,
  city_id int,
  name varchar,
  age int, 
  company varchar,
  PRIMARY KEY (id, city_id)
) WITH "ATOMICITY=ATOMIC,WRITE_SYNCHRONIZATION_MODE=PRIMARY_SYNC,cache_name=PersonCache,template=partitioned,backups=1,affinity_key=city_id, key_type=org.apache.ignite.cache.affinity.AffinityKey, value_type=com.okni.okkong.data.common.entity.Person";
```

上面的操作会创建一个 SQL_PUBLIC_PERSON 的cache，数据并置的维度是city_id。
```
优点:
    动态生成，可扩展性强。
    支持动态重启，不会影响到表结构。
缺点:
    只能在 sechma PUBLIC下动态生成。
    做为主键的id,city_id不展现在表里面。
```
### 参考资料
```
https://apacheignite-sql.readme.io/docs/create-table
```

## 配置文件生成，参考ignite 官网

```
https://console.gridgain.com/ 
```
