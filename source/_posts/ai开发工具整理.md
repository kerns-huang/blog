title: ai开发工具整理
author: kerns
abbrlink: 12070
tags:
  - ai
categories:
  - python
date: 2025-03-29 10:23:00
---
### ai 部署
{% pullquote mindmap mindmap-md %}
- ai开发
  - ai本地部署和应用
    - ollama
    - [vllm](https://github.com/vllm-project/vllm)
    - SGLang
    - [Xinfernce](https://inference.readthedocs.io/zh-cn)
    - [LMStudio](https://lmstudio.ai/) 
  - Embedding（向量模型）
    - 通用文本
      - BGE-M3（智源研究院）
      - text-embedding-3-large
      - Jina-embeddings-v2
    - 中文嵌入模型
      - xiaobu-embedding-v2
      - M3E-Turbo
      - stella-mrl-large-zh-v3.5-1792
  - RAG(检索增强生成)
    - NativeRAG
    - [dify](https://dify.ai/)
    - [anything llm](https://anythingllm.com/)
    - cherry studio
    - Coze
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

### 提示词工程

大模型会有幻觉，知识图谱可以人工检测，生成知识库。
chatBI，通过聊天生成报表。
firecrawl 把文件转成markdown，灌输给ai

### RAG(检索增强生成)

#### 基本概念

• 检索增强生成，是一种结合信息检索（Retrieval）和文本生
成（Generation）的技术
• RAG技术通过实时检索相关文档或信息，并将其作为上下文
输入到生成模型中，从而提高生成结果的时效性和准确性。

#### 优势

• 解决知识时效性问题：大模型的训练数据通常是静态的，无
法涵盖最新信息，而RAG可以检索外部知识库实时更新信息。
• 减少模型幻觉：通过引入外部知识，RAG能够减少模型生成
虚假或不准确内容的可能性。
• 提升专业领域回答质量：RAG能够结合垂直领域的专业知识
库，生成更具专业深度的回答