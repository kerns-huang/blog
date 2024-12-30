---
title: nginx自动更新
author: kerns
tags:
  - nginx
  - ''
categories:
  - 运维
abbrlink: 8762
date: 2024-09-14 13:23:00
---

### 进入yum配置库

cd /etc/yum.repos.d/

### 创建文件
vi nginx.repo

```repo
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/centos/操作系统版本/$basearch/
gpgcheck=0
enabled=1
```

### 查找nginx
	yum search nginx

### 更新nginx
	yum update nginx
