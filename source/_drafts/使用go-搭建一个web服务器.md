title: 使用go 搭建一个通用的web 服务
author: kerns
date: 2020-10-15 09:36:00
tags:
---
## web端
### gin



## 数据持久层

### gorm



## 定时器

### [cron]
简单的列子

```
func StartTimer() {
	c := cron.New()
	//每天早上5点执行分红计算
	c.AddFunc("* * 5 * * *", personBonus)
	c.Start()
}

func personBonus() {
	log.Info("开始计算个人分红............")
}
```