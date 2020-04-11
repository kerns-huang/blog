title: linux内存和cpu查看
author: kerns
abbrlink: 49460
tags:
  - linux
categories:
  - 在线运维
date: 2020-04-09 21:07:00
---
### 1.CPU占用最多的前10个进程： 
```
ps auxw|head -1;ps auxw|sort -rn -k3|head -10 
```
### 2.内存消耗最多的前10个进程
```
ps auxw|head -1;ps auxw|sort -rn -k4|head -10 
```

### 3.虚拟内存使用最多的前10个进程 
```
ps auxw|head -1;ps auxw|sort -rn -k5|head -10
```

### 查看 内存信息
查看内存的统计信息
```
free -h
```
查看某个进程内存的具体使用信息
```
pmap -X pid

```

###查看文件句柄数
```
 cat /proc/sys/fs/file-nr
 ```
 ### 查看tcp连接数
 ```
 netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'
 ```
 
 ### 查看oom 信息
 ```
 sudo dmesg | grep -i kill | less
 ```
 ```
 /proc/$PID/oom_adj
/proc/$PID/oom_score
/proc/$PID/oom_score_adj
```
```
ps -eo pid,comm,pmem --sort -rss | awk '{"cat /proc/"$1"/oom_score" | getline oom; print $0"\t"oom}'
```

 ### 查看硬盘问题
 ```
 df -lh
 du -sh /*
 lsof |grep delete
 du|sort -nr|more
 ```
 ### java应用程序查看内存
 
https://qsli.github.io/2017/12/02/google-perf-tools/