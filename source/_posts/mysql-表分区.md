title: mysql 表分区
author: kerns
abbrlink: 31860
date: 2024-05-17 14:13:34
tags:
---
# 简单的操作

##### 创建一个简单的分区表

```mysql
CREATE TABLE `kerns_test2` (
  `id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `create_time` date NOT NULL,
  PRIMARY KEY (`id`,`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3
PARTITION BY RANGE (year(`create_time`))
(PARTITION p0 VALUES LESS THAN (1990) ENGINE = InnoDB,
 PARTITION p1 VALUES LESS THAN (1995) ENGINE = InnoDB,
 PARTITION p2 VALUES LESS THAN (2000) ENGINE = InnoDB,
 PARTITION p3 VALUES LESS THAN (2005) ENGINE = InnoDB,
 PARTITION p4 VALUES LESS THAN (2010) ENGINE = InnoDB,
 PARTITION p5 VALUES LESS THAN (2015) ENGINE = InnoDB);
```

##### 对timestamp 进行分区，只能以下面这种方式分区

```
CREATE TABLE range_timestamp (
    id INT,
    hiredate TIMESTAMP
)
PARTITION BY RANGE ( UNIX_TIMESTAMP(hiredate) ) (
    PARTITION p1 VALUES LESS THAN ( UNIX_TIMESTAMP('2015-12-02 00:00:00') ),
    PARTITION p2 VALUES LESS THAN ( UNIX_TIMESTAMP('2015-12-03 00:00:00') )
);
```

##### 重新生成分区

```
ALTER TABLE table_name REORGANIZE PARTITION partition_names INTO (partition_definitions)
```

##### 对表创建分区

```mysql
ALTER TABLE `kerns_test2` PARTITION BY RANGE(days) (
    PARTITION `p197001` VALUES LESS THAN (19700101),
    PARTITION `p202003` VALUES LESS THAN (20200301),
    PARTITION `p202004` VALUES LESS THAN (20200401)
);
```

##### 新增一个分区

```mysql
alter table kerns_test2 add partition(partition p2 values less than maxvalue);
```

##### 删除一个分区表

```mysql
alter table kerns_test2 drop partition p1;
```


##### 查看某个分区的数据

```mysql
SELECT * FROM kerns_test2 PARTITION (p2);
```

##### 查看表里面每个分区的表数据

```mysql
SELECT PARTITION_NAME,TABLE_ROWS FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = 'kerns_test2';
```

##### 清空某个分区的数据

```mysql
alter table kerns_test2 truncate partition p0;
```

# 需要注意的事项。



1. MySQL 8.0 目前不支持使用InnoDB 或以外的任何存储引擎对表进行分区
2. 分区字段必须是整数类型或解析为整数的表达式。
3. 分区字段建议设置为NOT NULL，若某行数据分区字段为null，在RANGE分区中，该行数据会划分到最小的分区里。
4. MySQL分区中如果存在主键或唯一键，则分区列必须包含在其中。
5. Innodb分区表不支持外键。
6. 更改sql_mode模式可能影响分区表的表现。
7. 分区表不影响自增列。