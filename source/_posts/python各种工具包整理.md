title: python工具包导航
author: kerns
abbrlink: 21418
tags: []
categories:
  - python
date: 2025-01-09 09:42:00
---
{% pullquote mindmap mindmap-md %}
- python
  - 基本功能
  	- 生成requirements.txt
    	- pipreqs
    - 生成本地执行包
    	- [pyinstaller](https://www.warmjoke.com/2024/02/26/pyinstaller%E5%BA%94%E7%94%A8%E6%95%B4%E7%90%86/)
        - [pyfuze](https://github.com/TanixLu/pyfuze)
        - nuitka
        - py2app /py2exe
  - 爬虫
    - drissionPage
    - curl_cffi
    - selenium  
  - 日志
  	- loguru
  - 数据处理
  	- pandas
    - numpy
    - (Polars)[https://pola-rs.github.io/polars-book-cn/user-guide/introduction.html]
  - 画图
    - pillow
  - 动态包导入
    - importlib
  - 文件操作
    - shutil
  - yaml配置操作
  	- ruamel.yaml
  - 命令行输入
    - cmd2
  - 链上交互
    - web3
  - 声音读区
    - sounddevice
    - soundfile
  - 进度条
    - tqdm
  - 环境变量读取
  	- dotenv
  - javascript解析
    - PyExecJS
  - web
    - [Uvicorn](https://uvicorn.dev/)
    - falsk
  - mq
    - pyzmq
  - platformdirs  
  - 命令行交互
    - rich
    - click
    
{% endpullquote %}

# 详细说明

## 打包工具

### nuitka

打包复杂的依赖比较OK，把python转换成C++相关的代码，并且打包，所以比较慢，打的包功能比较稳定,对python的版本不能支持到最新。

### pyinstaller

简单的打包OK，复杂的打包相互依赖的设置比较麻烦。

### py2app
macos下的 打包工具，在windows 环境下对应的是py2exe