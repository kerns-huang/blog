---
title: mysql-innerdb优化
author: kerns
abbrlink: 32641
date: 2021-08-23 16:55:52
tags:
---
### join_buffer_size 

该值主要是用来设置 两个table的join操作 会用到的最大内存值。设置的值越大，一次性读取到内存中的数据越多，可以提供join操作的性能。一般情况下建议是设置8m-16m。
![upload successful](/images/pasted-15.png)


#### 想要临时调整为 1G应该如下操作

select /*+  set_var(join_buffer_size=1G) */ * from ...;

### InnoDB_buffer_pool_size

这个参数定义InnoDB存储引擎的表数据和索引数据的最大内存缓冲区,InnoDB_buffer_pool_size参数同时提供为数据块和索引块做缓存.这个值设置的越高,访问表中数据需要的磁盘IO就越少.


### InnoDB_lock_wait_timeout

这个参数自动检测行锁导致的死锁并进行相应处理,但是对于表锁导致的死锁不能自动检测默认值为50秒.


