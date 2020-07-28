title: spring boot 优雅关闭
author: kerns
abbrlink: 16356
tags:
  - spring boot
  - 架构
categories:
  - java
date: 2020-07-21 10:20:00
---
## 为什么要研究这个？
开始开发系统的时候，系统部署上线，很容易执行kill -9 执行系统的关闭，但该关闭会有问题，一个是如果老板正在执行操作，你在重新部署系统，结果就是在老板那边各种拒绝服务错误，还有一个可能在系统重启之后，老板的数据存入操作一直失败，一查原因，竟然是有个操作只执行了一半，后面的没有执行。然后就被老板一顿喷。所以一般情况下，我们需要使用kill -15 来执行关闭操作，虽然拒绝服务不能解决，这个在微服务中可以使用移除注册中心注册来解决。但是能解决数据被操作一半，系统就关闭的问题。当然更难受的是用户数据错乱，导致用户体验差，而导致老板认为你们做了一个玩具！！！


## spring boot里面如何实现

目前 Spring boot 2.3 已经实现了优雅关闭的逻辑

在yml 里面配置

```
# 开启优雅关闭
server: 
  shutdown: graceful
# 关闭的缓冲时间，如果超过了10秒，Springboot 还是会选择强制关闭  
spring: 
  lifecycle: 
    timeout-per-shutdown-phase: 10s
```

如下图：
![upload successful](/images/pasted-5.png)
默认在spring boot 里面关闭是直接关闭的，意思是即使你使用kill -15 ，spring boot 也会立即关闭。


## 自己实现一个

优雅停机的概念其实就是当我要关闭主线程的时候，当还有请求在处理，我先需要处理完请求，然后再去执行关闭的任务。
举个例子，通常我们的服务是跑在tomcat上面的，那么我们需要知道tomcat的请求链接应该是在任务处理完成之后关闭的。

### 普通的java程序如果实现优雅停机

添加   Runtime.getRuntime().addShutdownHook(this);

钩子程序
```
/**
 * 关闭之后的钩子
 *
 * @author xiaohei
 * @create 2020-07-21 上午9:25
 **/
public class ShutdownHook extends Thread {

    private boolean needShutDown = false;

    private Thread mainThread;

    public void run() {
        System.out.println("钩子线程已经接到退出信号");
        needShutDown = true;
        //打断主线程的关闭
        mainThread.interrupt();
        try {
            //等待主线程死亡
            mainThread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        //TODO 正常情况下，这需要执行主线程死亡的回收任务，比如拒绝服务，线程池的关闭等操作
        System.out.println("钩子线程会在主线程死亡之后死去，结束钩子生活");
    }

    public ShutdownHook(Thread mainThread) {

        this.mainThread = mainThread;
        this.needShutDown = false;
        //在这添加关闭的钩子线程
        Runtime.getRuntime().addShutdownHook(this);
    }


    public boolean isShutDown() {
        return needShutDown;
    }
}
```
主程序 
```
/**
 * 测试主线程
 *
 * @author xiaohei
 * @create 2020-07-21 上午9:32
 **/
public class TestMain {

    private ShutdownHook shutdownHook;

    public static void main(String[] args){
       TestMain testMain=new TestMain();
       System.out.println("开始执行测试");
       testMain.exec();
       System.out.println("结束测试");
    }

    public TestMain(){
        //当前线程是主线程。
        shutdownHook=new ShutdownHook(Thread.currentThread());
    }

    public void exec(){
        while (!shutdownHook.isShutDown()){
            System.out.println("睡眠1秒钟");
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                System.out.println("主线程睡眠被打断");
            }
            System.out.println("我已经活过来了");
        }
        System.out.println("关闭钩子已经执行完成");
    }


}
```

### spring boot内置容器下如何实现 优雅关闭？

//TODO 需要思考

### spring boot 外置容器下如何实现优雅关闭。


//TODO 需要思考


## 参考资料

https://www.jianshu.com/p/0c49eb23c627