---
title: mysql 中文全文检索
author: kerns
abbrlink: 49787
date: 2022-10-26 17:37:08
tags:
---


### 应用场景

在我们项目里面主要需要通过用户的名字或者户籍地址,居住地址来查询数据,正常情况下索引只能同nomal 索引,但%%的模糊搜索都是全表扫描,提高不了任何的性能.这个时候是使用mysql的全文索引的好时候.



### 默认分词索引的问题:

ngram全文解析器默认的分词是两个为单位,如果在业务场景中需要通过姓氏之类的查询,需要修改mysql的默认配置.

![upload successful](/images/pasted-17.png)

参看资料

https://www.jianshu.com/p/c48106149b6a