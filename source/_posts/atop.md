title: 运维历史信息监控-atop
author: kerns
tags:
  - 运维
categories:
  - 运维
abbrlink: 63111
date: 2025-02-02 09:30:00
---
### 安装命令

```
yum install atop -y
```

### 配置并启动 atop
参考以下步骤，配置 atop 监控周期及日志保留时间。
#### 修改配置

vim /etc/sysconfig/atop

```
将 LOGINTERVAL=600 修改为 LOGINTERVAL=30，表示将默认的600s监控周期修改为30s。建议修改为30s，您可结合实际情况进行修改。
将 LOGGENERATIONS=28 修改为 LOGGENERATIONS=7，表示将默认的日志保留时间28天修改为7天。为避免 atop 长时间运行占用太多磁盘空间，建议修改为7天，您可结合实际情况进行修改。
修改完成后如下图所示：
```
### 重启配置


systemctl restart atop


### 分析日志

atop -r /var/log/atop/atop_2021xxxx




### 常用命令

```
您可在打开日志文件后，使用以下命令筛选所需数据：
c：按照进程的 CPU 使用率降序筛选。
m：按照进程的内存使用率降序筛选。
d：按照进程的磁盘使用率降序筛选。
a：按照进程资源综合使用率进行降序筛选。
n：按照进程的网络使用率进行降序筛选（使用此命令需安装额外的内核模块，默认不支持）。
t：跳转到下一个监控采集点。
T：跳转到上一个监控采集点。
b：指定时间点，格式为 YYYYMMDDhhmm。
```

#### 查看指定日期内的历史指标日志。示例中，指定日期为2024年11月06日。
```
atop -r 20250206
```

#### 查看指定日期内自指定时间起的历史指标日志。示例中，指定日期为2024年11月06日，开始时间为14:00。

```
atop -r 20241106 -b 14:00
```
#### 查看指定日期内，指定时间段的历史指标日志。示例中，指定的日期为2024年11月5日，时间段为00:04至00:08。

```
atop -r 20241105 -b 00:04 -e 00:08
```
### 主要参数说明如下

```
ATOP 行：主机名、信息采样日期和时间点。
PRC 行：进程整体运行情况。
sys 及 user：CPU 被用于处理进程时，进程在内核态及用户态所占 CPU 的时间比例。
#proc：进程总数。
#zombie：僵死进程的数量。
#exit：Atop 采样周期期间退出的进程数量。
CPU 行：CPU 整体（即多核 CPU 作为一个整体 CPU 资源）的使用情况。CPU 行的各字段数值相加结果为 100%，N 为 CPU 核数。
sys 及 user：CPU 被用于处理进程时，进程在内核态及用户态所占 CPU 的时间比例。
irq：CPU 被用于处理中断的时间比例。
idle：CPU 处在完全空闲状态的时间比例。
wait：CPU 处在“进程等待磁盘 IO 导致 CPU 空闲”状态的时间比例。
CPL 行：CPU 负载情况。
avg1、avg5 和 avg15：过去1分钟、5分钟和15分钟内运行队列中的平均进程数量。
csw：指示上下文交换次数。
intr：指示中断发生次数。
MEM 行：内存的使用情况。
tot：物理内存总量。
cache ：用于页缓存的内存大小。
buff：用于文件缓存的内存大小。
slab：系统内核占用的内存大小。
SWP 行：交换空间的使用情况。
tot：交换区总量。
free：空闲交换空间大小。
PAG 行：虚拟内存分页情况
swin 及 swout：换入和换出内存页数。
DSK 行：磁盘使用情况，每一个磁盘设备对应一列。如果有 sdb 设备，那么增加一行 DSK 信息。
sda：磁盘设备标识。
busy：磁盘忙时比例。
read 及 write：读、写请求数量。
NET 行：多列 NET 展示了网络状况，包括传输层（TCP 和 UDP）、IP 层以及各活动的网口信息。
xxxxxi：各层或活动网口收包数目。
xxxxxo：各层或活动网口发包数目。
```

### 参考操作文档

```
https://cloud.tencent.com/document/product/213/61086
https://help.aliyun.com/zh/ecs/use-cases/use-the-atop-tool-to-monitor-linux-system-metrics?spm=5176.smartservice_service_create_ticket_step_2.0.0.6c8543ecjTvcos
```

### 衍生的信息

[btop,top的增强版](https://github.com/aristocratos/btop)

[htop,交互式top实现](https://github.com/htop-dev/htop)