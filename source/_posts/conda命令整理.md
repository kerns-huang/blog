title: conda命令整理
author: kerns
tags:
  - python
categories:
  - python
abbrlink: 3432
date: 2024-06-27 16:46:00
---
### 新建新的python环境

	conda create --name yourEnv python=2.7

### 若想要在创建环境同时安装python的一些包：

	conda create -n yourEnv python=3.6 numpy pandas
    
### 若想在别人虚拟环境的基础上创建自己的环境：

	conda create --name <yourEnv> --clone <baseEnv>
### 删除环境

	conda remove -n py36 --all
    
### 激活环境
    
    conda activate py36
    
### 安装包
    
    conda install panadas
    
### 搜索包

    conda search panadas
    
    