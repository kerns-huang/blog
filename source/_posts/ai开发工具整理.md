title: ai开发工具整理
author: kerns
abbrlink: 12070
tags:
  - ai
categories:
  - ai
date: 2025-03-29 10:23:00
---
# 开发工具

{% pullquote mindmap mindmap-md %}
- ai开发
  - 多进程ai开发
  - [vibe-kanban](https://github.com/BloopAI/vibe-kanban)
  - ai本地部署和应用
    - ollama
    - [vllm](https://github.com/vllm-project/vllm)
    - SGLang
    - [Xinfernce](https://inference.readthedocs.io/zh-cn)
    - [LMStudio](https://lmstudio.ai/) 
  - ai agent工作流
     - [dify](https://dify.ai/) 
     - [Coze](https://www.coze.com/)
     - cherry studio
     - [anything llm](https://anythingllm.com/)
     - [n8n](https://n8n.io/)
  - Embedding（向量模型）
    - 通用文本
      - BGE-M3（智源研究院）
      - text-embedding-3-large
      - Jina-embeddings-v2
    - 中文嵌入模型
      - xiaobu-embedding-v2
      - M3E-Turbo
      - stella-mrl-large-zh-v3.5-1792
  - 预测模型
    - XGBoost
    - LightGBM
    - CatBoost
  - RAG(检索增强生成)
    - NativeRAG
  - ai聊天入口
    - 客户端
      - chat box
      - ChatWise
    - 聊天插件
      - Page Assist
    - 服务端
      - LobeChat
  - 自助式数据报表开发
    - text2sql
    - [sqlbot](https://dataease.cn/sqlbot)
  - ai微调
    - [LLama-Factory](https://github.com/hiyouga/LLaMA-Factory)
  - 多任务应用开发
    - [langchain](https://www.langchain.com/)
    - LlamaIndex
  - 模型库
   	- [模型库](https://modelscope.cn/models)
  - 算力租用
   	- [autodl](https://www.autodl.com/home)
  - api接入
     - [dashscope](https://dashscope.aliyun.com/)
     - 阿里云百炼
  - ai插件网站
     - [huggingface](https://huggingface.co/spaces/mteb/leaderboard)
{% endpullquote %}


# 详解

### ai agent工作流工具整理

dify 开源，可以私有化搭建
coze 抖音平台，方便快速搭建。

### 提示词工程

大模型会有幻觉，知识图谱可以人工检测，生成知识库。
chatBI，通过聊天生成报表。
firecrawl 把文件转成markdown，灌输给ai

### 常用预测（分类，回归）模型
    分类算法：LR，SVN，KNN
    树模型：GBDT，XGBoost，LightGBM，CatBoost，NGBoost