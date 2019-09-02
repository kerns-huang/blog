---
title: jvm内存问题定位
date: 2019-09-02
categories: 
- java
tags:
- jvm
---
# 前提资料
### 内存的定义
```
VSS- Virtual Set Size 虚拟耗用内存（包含共享库占用的内存）
RSS- Resident Set Size 实际使用物理内存（包含共享库占用的内存）
PSS- Proportional Set Size 实际使用的物理内存（比例分配共享库占用的内存）
USS- Unique Set Size 进程独自占用的物理内存（不包含共享库占用的内存）
```
### mmap 文件
```
https://baike.baidu.com/item/mmap/1322217
```
# 内存总览
### ps -p $pid -o rss,vsz
查看应用逻辑内存，和实际物理内存使用。
### pmap -x $pid  | sort -n -k3
### 

### top -c

### sar 
```
怀疑CPU存在瓶颈，可用 sar -u 和 sar -q 等来查看
怀疑内存存在瓶颈，可用sar -B、sar -r 和 sar -W 等来查看
怀疑I/O存在瓶颈，可用 sar -b、sar -u 和 sar -d 等来查看
```
#### 参考资料
```
https://linuxtools-rst.readthedocs.io/zh_CN/latest/tool/sar.html
```
### gdb 
gdb --batch --pid 11 -ex "dump memory a.dump 0x7fd488000000 0x7fd488000000+56124000"
```
 strings a.dump | less
 hexdump -C a.dump | less
 view a.dump
```
查看应用内存块。
### strace 

# 堆内内存查看
```
jmap -heap 7732

打印堆栈，有个问题，堆栈太大，怎么取分析
jmap -histo:live -dump:live,format=b,file=accessservice.hprof 20048

tip: 如果内存过大，下一个linux 的mat进行分析，不知道有什么区别，意思是可以在出问题的服务器上分析该问题。

./ParseHeapDump.sh m.hprof  org.eclipse.mat.api:suspects org.eclipse.mat.api:overview org.eclipse.mat.api:top_components。
```
# 堆外内存查看

安装 google-perftools
https://github.com/gperftools/gperftools
```
https://www.ibm.com/developerworks/cn/linux/l-cn-perf1/index.html
http://www.brendangregg.com/perf.html
```
 [ Java NMT ](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/nmt-8.html?spm=a2c4e.10696291.0.0.56c519a4R0MXdK)

# 查看线程的内存使用
cat /proc/{pid}/smaps > smaps.txt

参考资料：
```
https://www.jianshu.com/p/309c9f61d495
https://blog.csdn.net/lycyingO/article/details/80854669
https://blog.csdn.net/f529352479/article/details/51908655/ 
https://yq.aliyun.com/articles/713959?spm=5176.12825654.ez4uczyfi.8.55f32c4apCxjXo
```
### 需要解决的疑问

young gc 什么时候触发 ？

full gc 什么时候触发？

### jvm 的内存计算

堆内内存 + 堆外内存+线程使用内存。
