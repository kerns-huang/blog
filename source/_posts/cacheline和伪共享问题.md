title: cacheline和伪共享问题
author: kerns
abbrlink: 12254
tags:
  - cache
categories:
  - java
date: 2020-07-07 00:17:00
---
### 查看缓存行的大小。

```Shell
cat /sys/devices/system/cpu/cpu1/cache/index0/coherency_line_size
```

### 验证为共享存在。

cacheline 的代码验证,如下所示的代码，按照正常的理解我们应该认为第一个循环和第二个循环的效率应该是一样的，但是事实上的差距是10倍以上的查询，这一块其实就是cache line 在帮我们做的缓存。

```
public static void main(String[] args) {
        int[][] array = new int[64 * 1024][1024];
        long start = System.currentTimeMillis();
        for (int i = 0; i < 64 * 1024; i++)
            for (int j = 0; j < 1024; j++)
                array[i][j]++;
        System.out.println(System.currentTimeMillis() - start);
        start = System.currentTimeMillis();
        for (int i = 0; i < 1024; i++)
            for (int j = 0; j < 64 * 1024; j++)
                array[j][i]++;
        System.out.println(System.currentTimeMillis() - start);
    }
```

### 解决伪共享的方案一填充long字节。

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


### 资料

```
https://www.cnblogs.com/diegodu/p/9340243.html
cnblogs.com/cyfonly/p/5800758.html
https://blog.csdn.net/zhanglong_4444/article/details/93631216
http://igoro.com/archive/gallery-of-processor-cache-effects/
https://blog.csdn.net/u010983881/article/details/82704733
```