title: fabric 链包开发和部署
categories:
  - go
tags:
  - 区块链
abbrlink: 60151
date: 2020-09-02 00:00:00
---
## 下载 [fabric-sample](git@github.com:hyperledger/fabric-samples.git) 工程
master不稳定，可能部署不成功，切换到release-1.4

# 测试链码

## 1进入目录 chaincode-docker-devmode

执行
```
docker-compose -f docker-compose-simple.yaml up
```
如果执行不成功，建议指定docker 版本号，目前我跑的是1.4.8

如果没有错误的话，我们的开发环境已经准备好了，接下来是对链码进行测试的步骤：

将编写的链码放到fabric-sample/chaincode/文件夹下

## 2打开第二个终端执行：

```
docker exec -it chaincode sh
```

编译链码,以官方的例子为例：

```
cd chaincode_example02/go
go build -o chaincode_example02
CORE_PEER_ADDRESS=peer:7052 CORE_CHAINCODE_ID_NAME=mycc:0 ./chaincode_example02
```
## 3.安装与实例化和测试：

打开第三个终端执行：

```
docker exec -it cli bash
```

### 以下命令按照自己的链码内容自行修改
```
peer chaincode install -p chaincodedev/chaincode/chaincode_example02/go -n mycc -v 0
peer chaincode instantiate -n mycc -v 0 -c '{"Args":["init","a","100","b","200"]}' -C myc
```

### 测试

#### 调用 set() 接口将 a 的值设置为20:

```
peer chaincode invoke -n mycc -c '{"Args":["set", "a", "20"]}' -C myc
```

#### 调用 get() 接口查询 a 的值，发现a的值已经更新为20，测试完毕。

```
peer chaincode query -n mycc -c '{"Args":["get","a"]}' -C myc
```