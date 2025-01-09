title: minicoda量化环境配置
author: kerns
abbrlink: 50337
tags:
  - 量化
categories:
  - python
date: 2024-12-30 12:56:00
---
# minicoda 安装

```
mkdir -p ~/miniconda3
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
rm ~/miniconda3/miniconda.sh
source ~/miniconda3/bin/activate
conda init --all
```

# 为什么安装 minicoda

```
  服务器硬盘不够，anaconda3 基本上需要占用 8G得硬盘空间，小门小户有点受不了。minicode的初始包基本是1G以内。
```

安装minicoda 之后的基础服务器配置，初始化的系统盘5.3g左右,相对anaconda3节省很多的空间。

![upload successful](/images/pasted-25.png)


# 创建最新的量化环境


``` 
conda create -n py312 python=3.12.7
```
# 创建python默认环境

```
 vi ~/.bashrc
```

设置成如下的配置。


![upload successful](/images/pasted-26.png)

# 安装supervisor

```
yum install -y supervisor
systemctl enable supervisord # 开机自启动
systemctl start supervisord # 启动supervisord服务
systemctl status supervisord # 查看supervisord服务状态
ps -ef|grep supervisord # 查看是否存在supervisord进程
```


