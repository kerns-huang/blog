title: redis xstream解决快手爬虫中控的问题
author: kerns
date: 2024-06-05 15:04:03
tags:
---
需要了解的知识

1.生成消息
2.消费消息

### 需要用到的命令整理。

#### XADD，生产消息

```
	XADD key ID field string [field string ...]
```

demo

```
XADD memberMessage * user kang msg Hello

```


### 使用python来实现xstream功能

