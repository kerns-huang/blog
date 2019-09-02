---
title: jvm cpu 过高问题定位
date: 2019-09-02
categories: 
- java
tags:
- jvm
---

## 操作步骤
1:查找占用cpu高的进程

```
top
```
2: 查看线程的cpu消耗
```
top -Hp pid(进程号)
```
3:转换10进制为16进制
```
  printf "%x\n" 线程ID
```  

4: 查找执行的对应代码
```
jstack 进程ID |grep -a10 线程16进制ID
```