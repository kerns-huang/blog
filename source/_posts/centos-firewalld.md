title: centos firewall管理
author: kerns
tags: []
categories:
  - 运维
  - linux
abbrlink: 34681
date: 2020-11-06 10:35:00
---

查看所有打开的端口

```
firewall-cmd --zone=public --list-ports
```

永久添加端口

```
firewall-cmd --zone=public --add-port=80/tcp --permanent 
```

更新防火墙规则

```
firewall-cmd --reload
```

删除端口

```
firewall-cmd --zone= public --remove-port=80/tcp --permanent
```

