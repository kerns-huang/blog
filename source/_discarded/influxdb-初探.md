title: influxdb 初探
author: kerns
date: 2022-07-21 11:40:04
tags:
---
最近一直在找一个时序数据库来做量化k线等一些数据的存储,mysql这种传统的不是不好,只是相对而言,更加倾向时序数据库,目前使用下来的感觉还是比数据库简单些.简单的记录下一些操作命令,方便以后查询和使用

### 安装


### influxql的一些简单使用

和mysql类似,最新版出了通过flux查询.

1. 查询有多少表

		show measurements

2. 删除表
		drop measurement 'tableName'
3. 给数据库设置一个超时时间