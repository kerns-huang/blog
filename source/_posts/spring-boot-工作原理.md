title: spring boot 工作原理
author: kerns
abbrlink: 881
tags:
  - spring boot
categories:
  - java
date: 2020-06-26 14:46:00
---
spring boots 的工程开发

一般性我们只需要如下图配置就OK了

![upload successful](/images/pasted-2.png)

为什么这么配置之后spring boots就能启动了？
看一下 SpringBootsApplication
![upload successful](/images/pasted-0.png)

核心的代码基本就在 @EnableAutoConfiguration里面

![upload successful](/images/pasted-3.png)

