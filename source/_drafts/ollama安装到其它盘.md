title: ollama安装到其它盘
author: kerns
date: 2025-02-26 15:39:04
tags:
---
ollama 默认是安装在c盘的，但是很遗憾，我的c盘不大


#### 从官网下在安装文件

#### 使用安装文件执行如下命令：

.\OllamaSetup.exe /DIR="D:\ollama"

#### 安装模型

ollama run deepseek-r1

模型信息可以从https://ollama.com/library获取

#### 喂数据

ollama pull nomic-embed-text

anything llm

