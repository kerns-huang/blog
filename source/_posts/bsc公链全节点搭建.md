title: centos7 bsc公链全节点搭建
author: kerns
abbrlink: 51281
date: 2021-09-18 14:44:27
tags:
---
# 快照安装过程

## 前置条件安装

### git 环境安装

```
yum -y install https://packages.endpoint.com/rhel/7/os/x86_64/endpoint-repo-1.7-1.x86_64.rpm
yum install git
```

### go 环境安装

1. 下载地址
```
标准官网：https://golang.org/ 需要墙
镜像官网：https://golang.google.cn/dl/ 【国内推荐】
```
2. 安装
```
tar -zxf go*.linux-amd64.tar.gz -C /usr/local
```
3. 添加环境变量

vi /etc/profile
```
export GO111MODULE=on
export GOROOT=/usr/local/go
export GOPATH=/home/gopath
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin
```

### nginx 安装
  
  ```
  yum install epel-release
  yum install nginx
  ```
  
  配置 bsc.conf
  
  ```
  server {
        listen       443;
        server_name  www.tianyisec.com;
        # ssl证书地址
        ssl_certificate     /etc/nginx/conf.d/6319711_www.tianyisec.com.pem;  # pem文件的路径
        ssl_certificate_key  /etc/nginx/conf.d/6319711_www.tianyisec.com.key; # key文件的路径

         # ssl验证相关配置
        ssl_session_timeout  5m;    #缓存有效期
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;    #加密算法
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;    #安全链接可选的加密协议
        ssl_prefer_server_ciphers on;   #使用服务器端的首选算法
        location / {
           add_header 'Access-Control-Allow-Origin' '*';
           add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
           add_header 'Access-Control-Allow-Headers' 'Content-Type';
           proxy_pass         http://localhost:8876;
           proxy_set_header   X-Forwarded-Proto $scheme;
           proxy_set_header   Host              $http_host;
           proxy_set_header   X-Real-IP         $remote_addr;
        }
    }
  ```
  

## 安装

1. 下载bsc 快照数据

使用快照的原因，从0开始同步数据会很慢，所以需要通过快照的加快区块的同步过程。

```
https://github.com/binance-chain/bsc-snapshots
```

下载命令：
```
nohup  wget -O geth.tar.gz "snapurl" >/dev/null 2>log &
```

另外一种下载方式,据说数据很快,有机会可以试下
```
apt install aria2

aria2c -o geth.tar.lz4 -s14 -x14 -k100M https://download.bsc-snapshot.workers.dev/{filename} -o geth.tar.lz4
```
原文
https://bbs.quantclass.cn/thread/15841
2. 下载 bsc  安装文件

```
https://github.com/binance-chain/bsc/releases
```

3. 下载初始化配置文件

主网
```
wget https://github.com/binance-chain/bsc/releases/download/v1.1.2/mainnet.zip
unzip mainnet.zip
```

测试网络

```
wget https://github.com/binance-chain/bsc/releases/download/v1.1.2/testnet.zip
unzip testnet.zip
```

config.toml 节点配置修改
```
[Node]
IPCPath = "geth.ipc"
HTTPHost = "0.0.0.0"
NoUSB = true
InsecureUnlockAllowed = false
HTTPPort = 8876
HTTPVirtualHosts = ["*"]
HTTPModules = ["eth", "net", "web3", "txpool", "parlia"]
WSPort = 8877    
WSModules = ["net", "web3", "eth"]
```

4. 初始化（当从快照执行的时候不用）

```
geth --datadir node init genesis.json
```

5. 运行

```
nohup geth --config ./config.toml --datadir ./server/data-seed/geth  --cache 30720 --rpc.allow-unprotected-txs --txlookuplimit 0 >/dev/null 2>&1 &
```


cache: 以m为单位，缓存设置约大，同步数据越快,目前设置为32G。

# 问题

## 同步速度跟不上主链的高度

### 添加常用节点

节点设置： <datadir>/geth/static-nodes.json:

### 信任节点设置

节点设置： <datadir>/geth/trusted-nodes.json 
  
### 参考资料

https://docs.binance.org/smart-chain/developer/fullnode.html

# 一些常用的命令

1. 查看节点最新同步的区块高度

```
curl -s -H Content-Type:application/json -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://127.0.0.1:8876
```

2. 查看是否同步完成

```
curl -s -H Content-Type:application/json -X POST --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' http://127.0.0.1:8876
```

3.


```
geth attach http://localhost:8545
eth.syncing
eth.blockNumber
```