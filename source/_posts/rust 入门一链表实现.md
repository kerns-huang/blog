---
title: rust入门-链表实现
categories:
  - rust
tags:
  - 数据结构
abbrlink: 41392
date: 2020-02-28 04:00:00
---

### 关键字段说明：

Box ：
```
  在 Rust 中，所有值默认都是栈分配的。通过创建 Box<T>，可以让值在堆上分配。
  默认栈上分配，代表了多线程的时候基本不需要考虑锁的问题。
```


### 参考资料

https://rustwiki.org/zh-CN/rust-by-example/std/box.html