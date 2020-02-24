---
title: vue 代码解决
categories:
  - node
tags:
  - 分布式
  - 前端
abbrlink: 57793
date: 2020-02-24 00:00:00
---
# 为什么不用jquey

## 渲染引擎，js引擎
解析HTML -> DOM Tree -> Render Tree -> 计算 -> UI引擎渲染 

## 虚拟dom，真实dom

### 虚拟dom ：
   ```
     是一个对象，通过diff算法刷选出变更过的对象，渲染真实dom
   ```


真实dom：完全增删改，排版重绘
虚拟dom：虚拟dom的增删改，diff算法 真实dom增删改+排版重绘   

