title: mysql 问题定位
author: kerns
abbrlink: 49460
tags:
  - linux
categories:
  - 运维
  - ''
date: 2020-10-23 08:56:00
---
## 查看连接数问题


### 查看执行中的进程

SHOW FULL PROCESSLIST;
show processlist;

### 查看最大连接数

show variables like '%max_connections%';

### 8.0 中设置最大连接数
set persist max_connections=200;