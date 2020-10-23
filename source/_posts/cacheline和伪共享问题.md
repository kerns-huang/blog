title: cacheline和伪共享问题
author: kerns
abbrlink: 12254
tags:
  - cache
  - 高并发
categories:
  - java
date: 2020-07-07 00:17:00
---
# 查看缓存行的大小。

```Shell
cat /sys/devices/system/cpu/cpu1/cache/index0/coherency_line_size
```

# 验证cacheline的存在。

cacheline 的代码验证,如下所示的代码，按照正常的理解我们应该认为第一个循环和第二个循环的效率应该是一样的。

```
 public static void main(String[] args) {
        int[] arr = new int[64 * 1024 * 1024];
        long start = System.currentTimeMillis();
        for (int i = 0; i < arr.length; i++) arr[i] *= 3;
        System.out.println("第一个循环="+(System.currentTimeMillis() - start));
        start = System.currentTimeMillis();
        for (int i = 0; i < arr.length; i += 16) arr[i] *= 3;
        System.out.println("第二个循环="+(System.currentTimeMillis() - start));
    }
```
上述的循环，循环2做了循环1/16 的工作，但消耗的时间基本等同

![upload successful](/images/pasted-11.png)

## 原因
对于现代的操作系统而言，每次获取缓存数据到L1缓存，不是以一个字节一个字节去获取，而是一次性获取一个块(cache line)，在64位操作系统里面一个cache line大小为64byte。一个int 4bytes，所以读取16个和一次读取读取一个效率上是一样的。


# 伪共享问题

## 出现的原因
如果 两个变量 （a,b） 同时在一个 Cache Line 中，处理器A修改了变量a ，那么处理器B中，这个 CacheLine 失效了，这个时候如果处理器B修改了变量b的话，就必须先提交处理器A的缓存，然后处理器B再去主存中读取数据！这样就出现了问题，a和b在两个处理器上被修改，本应该是一个并行的操作，但是由于缓存一致性，却成为了串行！这样会严重的影响并发的性能！


## 解决伪共享的方案一填充long字节。

```
package concurrent.falseshare;

/**
 * 伪共享问题：
 * @author xiaohei
 * @create 2020-06-28 上午11:18
 **/
public class FalseShareTest implements Runnable {
    public static int NUM_THREADS = 4;
    public final static long ITERATIONS = 500L * 1000L * 1000L;
    private final int arrayIndex;
    private static VolatileLong[] longs;
    public static long SUM_TIME = 0l;
    public FalseShareTest(final int arrayIndex) {
        this.arrayIndex = arrayIndex;
    }
    public static void main(final String[] args) throws Exception {
        Thread.sleep(10000);
        for(int j=0; j<10; j++){
            System.out.println(j);
            NUM_THREADS=Runtime.getRuntime().availableProcessors();
            longs = new VolatileLong[NUM_THREADS];
            for (int i = 0; i < longs.length; i++) {
                longs[i] = new VolatileLong();
            }
            final long start = System.nanoTime();
            runTest();
            final long end = System.nanoTime();
            SUM_TIME += end - start;
        }
        System.out.println("平均耗时："+SUM_TIME/10);
    }
    private static void runTest() throws InterruptedException {
        //开启线程
        Thread[] threads = new Thread[NUM_THREADS];
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(new FalseShareTest(i));
        }
        for (Thread t : threads) {
            t.start();
        }
        for (Thread t : threads) {
            t.join();
        }
    }
    public void run() {
        long i = ITERATIONS + 1;
        while (0 != --i) {
            longs[arrayIndex].value = i;
        }
    }
    public final static class VolatileLong {
        public volatile long value = 0L;     //对所有线程可见
        /**
         * 对象头信息占用8到12个字节
         * 解决伪共享问题的关键
         * 缓存行通常是 64 字节（基于 64 字节，其他长度的如 32 字节）
         *
         */
        public long p1, p2, p3, p4, p5, p6;     //屏蔽此行
    }
}
```

## 解决伪共享方案二 Contended注解

jdk 1.8 之后有效


### 资料

```
https://www.cnblogs.com/diegodu/p/9340243.html
cnblogs.com/cyfonly/p/5800758.html
https://blog.csdn.net/zhanglong_4444/article/details/93631216
http://igoro.com/archive/gallery-of-processor-cache-effects/
https://blog.csdn.net/u010983881/article/details/82704733
```