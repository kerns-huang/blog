title: gogs-drone自动化部署
author: kerns
abbrlink: 20381
tags:
  - 部署
categories:
  - 运维
date: 2020-12-23 14:42:00
---
### 第一步docker 部署

docker 安装

docker-compose 安装


### 第二步 gogs drone compose 文件下载

https://github.com/alicfeng/gogs-drone-docker.git

cd gogs-drone-docker

```
docker-compose up -d
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

#### go 部署的文件配置
下面的 host ，password 等就是在drone 工程里面配置的变量
```
kind: pipeline
name: code_manager_backstage
workspace:
  base: /var/goproject/src
  path: code_manager_backstage

steps:
  - name: build
    image: golang:1.14.4
    environment:
      GOOS: linux
      GOARCH: amd64
    commands:
      - export GOPATH=/var/goproject
      - export PATH=$PATH:$GOROOT/bin
      - go env -w GO111MODULE=on
      - go env -w GOPROXY=https://goproxy.io,direct
      - go version
      - go env
      - go mod tidy
      - go mod vendor
      - go build -i -o bin/code_manager_backstage main.go
  - name: deploy_server
    image: appleboy/drone-scp
    settings:
      host:
        from_secret: host  
      port:
        from_secret: port
      username:
        from_secret: username
      password:
        from_secret: password
      target:
        from_secret: target
      source: ./bin
      rm: false
      when:
        branch:
          - master
  - name: run
    image: appleboy/drone-ssh
    settings:
      host:
        from_secret: host
      port:
        from_secret: port
      username:
        from_secret: username
      password:
        from_secret: password
      command_timeout: 2m
      script:
        - cd /generatecode/code_manager_backstage
        - rm -rf code_manager_backstage
        - cp bin/code_manager_backstage code_manager_backstage
        - ./restart.sh
        - nohup ./code_manager_backstage 1>/code_manager_backstage/log/nohup`date +%Y-%m-%d`.log 2>&1 &
trigger:
  branch:
    - master
```
    
    