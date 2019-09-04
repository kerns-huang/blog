---
title: jvm cpu 过高问题定位
categories:
  - java
tags:
  - 多线程
abbrlink: 20496
date: 2019-09-02 00:00:00
---
cpu  --> L1缓存-单线程共享，L2缓存 -> 单cpu共享，L3缓存 -- >主内存
查看 mac电脑的 L2cache 和L3 cache
查看cpu的物理核：
sysctl hw.physicalcpu

查看cpu的逻辑核：
sysctl hw.logicalcpu
查看内存的具体信息
system_profiler SPHardwareDataType
Linxu 查看 cpu 信息 ： lscpu

L1d 缓存 : L1缓存 数据存储区
L1i 缓存：L1缓存数据计算区



java 的 volatile 基于MESI 协议，当高速缓存的数据变更的时候，会通知其他cpu的高速缓存该变量已经无效

Java内存模型规定所有的变量都是存在主存当中（类似于前面说的物理内存），每个线程都有自己的工作内存（类似于前面的高速缓存）。
线程对变量的所有操作都必须在工作内存中进行，而不能直接对主存进行操作。并且每个线程不能访问其他线程的工作内存
