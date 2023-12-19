title: kubectl 的命令收集
author: kerns
abbrlink: 10054
tags: []
categories:
  - 运维
date: 2023-03-21 14:40:00
---
## pod相关

### 获取某个项目的包含的pod
kubectl get pod -ncentralsystem

## 日志相关

### 查看某个pod日志

kubectl logs -f api-interface-6d489d7f49-7j4b7 -ncentralsystem


## 配置相关

### 查看某个配置
kubectl get cm centralsystem-mongodb-cm -ncentralsystem -oyaml

### 删除某个配置

kubectl delete cm mongodb-cert

## 镜像里面内容

### 查看镜像的内容

kubectl exec -it api-interface-f644fdd64-z4999 sh -ncentralsystem

## 查看某个镜像的配置信息

kubectl describe pods/api-interface-576475f4f5-k6sln -ncentralsystem
