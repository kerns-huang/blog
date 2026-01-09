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
    
### nginx升级的坑


![upload successful](/images/pasted-29.png)

会在配置文件中生成一个 default.conf的配置文件会覆盖我们配置的80端口，导致我们的服务出问题，浏览器返回会有缓存问题，导致以为网站正常。