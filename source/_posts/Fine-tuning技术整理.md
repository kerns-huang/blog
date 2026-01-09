title: Fine-tuning技术整理
author: kerns
abbrlink: 33946
tags:
  - ai
categories:
  - ai
date: 2025-05-20 21:47:00
---

# 原因

当大模型能力不够的，需要通过Fine-tuning微调。

# 缺点

成本很高，需要机器

# 实现方式

## P-Tuning

 [参考资料](https://arxiv.org/pdf/2110.07602)
 [P-Tuning方式](https://github.com/THUDM/ChatGLM2-6B/blob/main/ptuning)
 
## Lora微调

在原始预训练模型旁边增加一个旁路

# 数据获取的方式

1. 实际场景获取
2. 老师模型获取


# 工具箱 

[PEFT](https://github.com/huggingface/peft)支持上面的几种微调方式。

[unsloth](https://github.com/unslothai/unsloth)


# 参考资料

[ChatGLM2-6B](https://github.com/THUDM/ChatGLM2-6B)