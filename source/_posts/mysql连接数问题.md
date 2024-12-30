title: mysql 问题定位
author: kerns
abbrlink: 49460
tags:
  - mysql
  - ''
categories:
  - 运维
date: 2020-10-23 08:56:00
---
# 查看连接数问题


## 查看执行中的进程

	SHOW FULL PROCESSLIST;
	show processlist;

## 查看最大连接数

	show variables like '%max_connections%';

## 8.0 中设置最大连接数
	set persist max_connections=200;

# 锁问题查询

## 查看哪些表正在被使用当中

	show OPEN TABLES where In_use > 0;
    
## 查看当前运行的所有事务

	select * from information_schema.innodb_trx
    
## 查看锁的情况

```mysql    
    mysql> show status like 'innodb_row_lock_%';
    +-------------------------------+--------+
    | Variable_name                 | Value  |
    +-------------------------------+--------+
    | Innodb_row_lock_current_waits | 1      |
    | Innodb_row_lock_time          | 479764 |
    | Innodb_row_lock_time_avg      | 39980  |
    | Innodb_row_lock_time_max      | 51021  |
    | Innodb_row_lock_waits         | 12     |
    +-------------------------------+--------+
    5 rows in set (0.00 sec)

    解释如下：
    Innodb_row_lock_current_waits : 当前等待锁的数量
    Innodb_row_lock_time : 系统启动到现在，锁定的总时间长度
    Innodb_row_lock_time_avg : 每次平均锁定的时间
    Innodb_row_lock_time_max : 最长一次锁定时间
    Innodb_row_lock_waits : 系统启动到现在总共锁定的次数  
```

    
    
    
    


