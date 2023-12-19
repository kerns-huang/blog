---
title: vue环境搭建
author: kerns
tags:
  - vu e
categories:
  - 前端
abbrlink: 25864
date: 2023-01-11 11:32:00
---
# node 安装

  [node官网](https://nodejs.org/zh-cn/download/)
## node 版本查看

```
    node -V
    npm -v
```    

# cnpm 安装

```
npm config set registry https://registry.npm.taobao.org
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

# vue 脚手架安装
```
  cnpm i -g @vue/cli
```  

# 创建一个新的vue项目

```
vue create vue-demo --registry=https://registry.npm.taobao.org
```
## vue项目的选择

1. 在vue 里面可以选择初始化需要的基本配置,
2. vue的版本(2.0和3.0有很大的区别,很多包可能只支持特定的版本号,需要仔细区分).

# 下载指定版本的node包

当没有制定版本的时候,默认下载最新的包,最新的包可能和vue的版本不兼容,需要需要设置特定的版本









      