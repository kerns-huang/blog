title: openssh制作rpm包对线上环境升级
author: kerns
tags: []
categories:
  - 运维
abbrlink: 8959
date: 2024-09-28 09:54:00
---
# 前置原因

为了通过等保3，扫码提示一堆的openssh错误，openssh目前没有针对centos的最新包rpm，网上都是一些自行编译源码，然后升级的教程。但有一个担心，因为自行编译源吗，需要安装依赖包，有可能导致线上运行环境不稳定，所以还是想着自己生成rpm包，然后在测试环境测试通过之后再放到线上环境。
![upload successful](/images/pasted-20.png)


# 操作流程

## 依赖安装

yum install rpm-build zlib-devel openssl-devel gcc perl-devel libXt-devel imake gtk2-devel krb5-devel pam-devel perl-IPC-Cmd

## 下载对应的源码包

下载最新的依赖包 x11-ssh-askpass包

```
https://github.com/sigmavirus24/x11-ssh-askpass
```

下载最新的依赖包 openssl包

```
 https://openssl-library.org/source/
```

下载最新openssh

```
https://www.openssh.com/portable.html
```

## 备份升级前配置文件

下面这两个文件如果不做备份，会在升级后自动修改

```
/etc/pam.d/sshd
/etc/ssh/sshd_config
```


## 编译openssl



#### 遇到的问题

```
Can't locate IPC/Cmd.pm in @INC (you may need to install the IPC::Cmd module)
```
解决方案：
```
yum install perl-IPC-Cmd
```
### 安装过程


#### 解压 

```
tar -zxvf openssl-3.3.2.tar.gz 
cd openssl-3.3.2/
```
#### 编译

```
./config --prefix=/usr/local/openssl shared -fPIC
make && make install
```
#### 检查函数库

```
ldd /usr/local/openssl/bin/openssl  # 检查函数库
```

#### 创建软链接

ln -s /usr/local/openssl/bin/openssl /usr/bin/openssl
ln -s /usr/local/openssl/include/openssl /usr/include/openssl

#### 添加动态链接库数据
echo "/usr/local/openssl/lib/" >> /etc/ld.so.conf

#### 更新函数库

ldconfig -v  

#### 检查版本
openssl version  


## 编译openssh

```
tar xf openssh-9.6p1.tar.gz -C /home/

mkdir -p /root/rpmbuild/{SOURCES,SPECS}
cp /root/openssh-9.6p1.tar.gz /root/rpmbuild/SOURCES/
cp /root/x11-ssh-askpass-1.2.4.1.tar.gz /root/rpmbuild/SOURCES/
cp /home/openssh-9.6p1/contrib/redhat/openssh.spec /root/rpmbuild/SPECS/
```

### rpmbuild 的知识介绍

https://www.cnblogs.com/zhangxinglong/p/11904922.html


## rpm 构建


```
	rpmbuild -ba openssh.spec 
```

执行成功的结果

![upload successful](/images/pasted-21.png)


## 通过rpm升级ssh版本。

```
rpm -Uvh openssh-* --nodeps --force
```

## 重启服务

```
systemctl restart sshd
```

# 执行的时候遇到的问题

## 缺少libcrypto.so.3，libssl.so.3

拷贝openssl里面的对应包到对应的/usr/lib64 环境中去。


# 相关命令解析

## ldd

	打印程序或者库文件所依赖的共享库列表
# 参考资料
	
    https://wangchujiang.com/linux-command/c/ldd.html