title: 基于docker搭建mongodb
author: kerns
abbrlink: 61498
tags:
  - linux
  - docker
  - mongo
categories:
  - 运维
date: 2020-05-29 20:47:00
---
# mongo集群搭建

## 第一步创建 docker-compose.yml文件

docker-compose.yml: 
```
version: '3'
services:
  rs1:
    image: mongo:latest
    container_name: "mongo-rs-1"
    network_mode: "host"
    volumes:
      - /data/mongodb/rs1:/data/db
    command: mongod --port 57017 --dbpath /data/db --replSet mongoreplset
  rs2:
    image: mongo:latest
    container_name: "mongo-rs-2"
    network_mode: "host"
    volumes:
      - /data/mongodb/rs2:/data/db
    command: mongod --port 57018 --dbpath /data/db --replSet mongoreplset
  rs3:
    image: mongo:latest
    container_name: "mongo-rs-3"
    network_mode: "host"
    volumes:
      - /data/mongodb/rs3:/data/db
    command: mongod --port 57019 --dbpath /data/db --replSet mongoreplset

```

### host 文件配置

```
127.0.0.1 mongo-rs-3
127.0.0.1 mongo-rs-2
127.0.0.1 mongo-rs-1
```

### network的选择，为什么是host 而不是 bridge

主要是如果是brigge 模式，外网访问也会调用mongodb的心跳，但因为两边网络不通，会导致客户端认为mongodb的集群是不成功的。
先要配置host文件，然后再启动docker，因为host配置默认会复制hosts文件到容器里面。

## 使用 docker-compose 组件启动集群

```
docker-compose up -d
```

如果没有安装 docker-compose组件

```
yum install docker-compose
```

## 集群replica set 配置

### 进入集群主节点

```
docker exec -it mongo-rs-1 mongo --port=57017
```


### 添加集群配置

```
rs.initiate()
rs.add("mongo-rs-2:57018")
rs.add("mongo-rs-2:57018")
```

#### 默认情况下，主节点host是 是默认的域名，不会是mongo-rs-1，所以需要重新配置

关闭主节点：

```
docker stop mongo-rs-1
```

这时候备份节点有一个会变成主节点,在新的主节点操作

```
docker exec -it mongo-rs-2 mongo --port=57018

rs.remove("默认host:57017")

```

启动老的主节点，这时候这是独立节点，在新的主节点操作

```
rs.add("mongo-rs-1:57017")
```



# 参考资料

```
http://bazingafeng.com/2017/06/19/create-mongodb-replset-cluster-using-docker/
```