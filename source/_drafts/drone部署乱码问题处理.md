title: drone部署乱码问题处理
author: kerns
date: 2025-07-25 08:42:41
tags:
---
### 基础的配置

```
kind: pipeline
type: docker
name: deploy-production
workspace:
  base: /var/java/project/src
  path: mapi-ruoyi-backend

steps:
  - name: build
    image: maven:3.6.3-openjdk-8
    volumes: # 将容器内目录挂载到宿主机，仓库需要开启Trusted设置
      - name: maven-cache
        path: /root/.m2   # maven 的默认路径，/账号名字/.m2 所以这块理论上和操作的账号很有关系
    environment:
      GOOS: linux
      GOARCH: amd64
      MAVEN_OPTS: -Dfile.encoding=UTF-8
    commands:
      - echo "start build mapi backend"
      - locale # 检查区域设置
      - echo "测试字符: 你好" | iconv -f UTF-8 -t GBK  # 验证编码转换
      - mvn  clean package -Pprod -Dfile.encoding=UTF-8
```

