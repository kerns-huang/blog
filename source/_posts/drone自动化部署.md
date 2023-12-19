title: gogs drone搭建java自动化部署
author: kerns
abbrlink: 20381
tags:
  - 部署
  - java
categories:
  - 运维
date: 2020-12-23 14:42:00
---
### 第一步docker 部署

docker 安装

docker-compose 安装


### 新建docker-compose

网上很多资料目前已经过时很久,官网的配置又不够无脑化,折腾了好几天查找资料.

#### 可以参考的资料
https://blog.csdn.net/uisoul/article/details/113554242

#### docker-compose.yml

```
version: '3.5'
services:
  gogs:
    image: gogs/gogs:0.12
    container_name:  mobile-gogs
    volumes:
      - ./gogs:/data
    ports:
      - "3000:3000"

  drone-server:
    image: drone/drone:2.12.1
    container_name:  mobile-drone-server
    ports:
      - 8000:80
    volumes:
      - /var/lib/drone:/data
      - /var/run/docker.sock:/var/run/docker.sock
    restart: always
    environment:
      - TZ=Asia/Shanghai
      - DRONE_AGENTS_ENABLED=true
      - DRONE_SERVER_PROTO=http
      - DRONE_OPEN=true
      - DRONE_SERVER_HOST= 宿主机ip:8000
      - DRONE_USER_CREATE=username:kerns,admin:true
      - DRONE_GOGS_SERVER=http://宿主机ip:3000
      - DRONE_RPC_SECRET=ALQU2M0KdptXUdTPKcEw 
      - DRONE_DEBUG=true
      - DRONE_LOGS_TRACE=true
      - DRONE_LOGS_DEBUG=true
      - DRONE_LOGS_PRETTY=true
      - DRONE_GIT_ALWAYS_AUTH=false

  drone-runner-docker:     
    image: drone/drone-runner-docker:1.8.2            
    container_name:  mobile-drone-runner-docker
    ports:
      - 10081:3000
    depends_on:
      - drone-server  
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    restart: always
    environment:
      - TZ=Asia/Shanghai
      - DRONE_DEBUG=true
      - DRONE_RPC_PROTO=http
      - DRONE_RPC_HOST=drone-server
      - DRONE_RPC_SECRET=ALQU2M0KdptXUdTPKcEw
      - DRONE_RUNNER_CAPACITY=2
networks:
  dronenet:
    external: true # 使用外部网络, 需先创建网络      
```

### 启动完之后配置

 1. gogs 地址 : http://ip:3000/  
 
    gogs类似gitlab，做代码管理的工具，刚开始安装的时候你需要自己创建帐号密码，然后把自己的项目推送到环境上去。
     
![upload successful](/images/pasted-12.png)

需要查看下钩子能否推送到drone这边，有可能配置错误，导致推送不成功。点击编辑里面有一个测试推送的设置，默认hook是不需要鉴权的。

![upload successful](/images/pasted-13.png)

    
 2. drone 的默认地址: http://ip:8000/   
 
 
![upload successful](/images/pasted-14.png)


当gogs配置好之后，drone 默认基本不需要变动，不过服务器的配置可以在drone里面去配置，可以在.drone.yml里面写死，但是不如在drone配置可以统一管理和保密。

#### java 的配置文件

```
kind: pipeline
type: docker
name: mobile-h5-backend
workspace:
  base: /var/javaproject/src
  path: mobile-h5-backend

steps:
  - name: build
    image: maven:3.6.3-openjdk-8
    volumes: # 将容器内目录挂载到宿主机，仓库需要开启Trusted设置
      - name: maven-cache
        path: /root/.m2   # maven 的默认路径，/账号名字/.m2 所以这块理论上和操作的账号很有关系
    environment:
      GOOS: linux
      GOARCH: amd64
    commands:
      - echo "start build mobile h5 backend"
      - mvn  clean package -Pprod -Dmaven.test.skip=true

  - name: deploy
    image: appleboy/drone-scp
    settings:
      host:
        - 121.199.51.109
      port:
        from_secret: port
      username:
        from_secret: username
      password:
        from_secret: password
      target:
        - /root/card-h5-backend
      source: ./target/card-h5-backend-assembly.tar.gz
      rm: true
      when:
        branch:
          - master

  - name: run
    image: appleboy/drone-ssh
    settings:
      host:
        - 121.199.51.109
      port:
        from_secret: port
      username:
        from_secret: username
      password:
        from_secret: password
      command_timeout: 2m
      script:
        - cd /root/card-h5-backend/target
        - tar -zxvf card-h5-backend-assembly.tar.gz
        - ./card-h5-backend/bin/kill.sh && ./card-h5-backend/bin/start.sh prod 1024

volumes: # 定义流水线挂载目录，用于共享数据
  - name: maven-cache
    host:
      path: /root/drone/maven/cache
trigger:
  branch:
    - master

```
配置文件的说明
1. 基于maven镜像我们可能需要配置自己的私服，这种情况下，需要把配置文件放到/root/drone/maven/cache目录下,maven镜像会直接使用你的settings-docker.xml配置

![upload successful](/images/pasted-18.png)

### 镜像源的修改