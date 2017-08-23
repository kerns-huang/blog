---
title: spring boot dubbo 学习
date: 2017-08-23 22:06:16
tags:
---
## 问题：
### 1：RPC的实现是如何实现的?
核心类：ReferenceConfig.createProxy()创建代理类,
获取proxy代理类的顺序:
```
 1. 如果没有url指定：
      		1:查找本地是否有接口
 2. 是否是url直连：
 3. 是否是注册中心连接：
      配置文件加载：  
      1：配置文件获取。
      2：环境变量（"dubbo.registry.address"）获取
      
```
第一步是生成代理类。
第二部当方法调用的时候，通过代理类发送信息给实际的执行类，然后等待返回结果封装到自己的返回结果里面。
rpc 的实现机制最终还是使用了jdk的动态代理的概念。
### 2：dubbo的数据传输的方式有几种？
默认实现的方式：
dubbo 
http
hessian
injvm
redis
rmi
memcached
thrift
### 3：dubbo事务的处理机制?

### 4：dubbo客户端配置文件的加载，是如何从spring boots的资源文件加载的?


### 5. dubbo的分布式服务端处理?

### 6.filter的应用场景和实例?

### 7 负载均衡是如何实现的?

LoadBalance接口，根据策略在来做不同的选举。
检查类的初始化

### 优雅关机、灰度发布、熔断策略，链路追踪，分布式事务 


## 扩展的思考：
### 1. jDK的动态代理是如何实现的?


参考的文章
http://blog.csdn.net/mhmyqn/article/details/48474815
上面的文章讲了下代理类生成的具体逻辑，但代理类和远程实现类的关联是如何实现的？
代理类只是把远程的调用接口通过自己返回给了调用方
