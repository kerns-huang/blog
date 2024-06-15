---
title: pyinstaller应用整理
author: kerns
tags:
  - python
  - 打包
categories:
  - python
abbrlink: 46317
date: 2024-02-26 18:41:00
---
### 安装pyinstaller

pip install pyinstaller

如果安装失败，可执行以下两步：

1）“pip install pywin32”

2）“pip install wheel”

3）再试一下“pip install pyinstaller”

执行生成命令

pyinstaller -F *.py

命令参数介绍：

-F 表示生成单个可执行文件

-w 表示去掉控制台窗口，这在GUI界面时非常有用。不过如果是命令行程序的话那就把这个选项删除

-p 表示你自己自定义需要加载的类路径，一般情况下用不到

-i 表示可执行文件的图标
                        
 执行生成命令

pyinstaller -F *.py

### 命令参数介绍：

-F 表示生成单个可执行文件

-w 表示去掉控制台窗口，这在GUI界面时非常有用。不过如果是命令行程序的话那就把这个选项删除

-p 表示你自己自定义需要加载的类路径，一般情况下用不到

-i 表示可执行文件的图标

 执行命名后生成的exe文件放在dist文件夹中
