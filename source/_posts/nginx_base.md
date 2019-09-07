---
title: nginx的基本操作配置
categories:
  - nginx
tags:
  - nginx
abbrlink: 60151
date: 2019-09-07 00:00:00
---

### 反向代理配置
```
反向代理代理的是服务端
```
代码示例：
```
  server {
        listen       80; #对外暴露
        listen       [::]:80;
        server_name  prewww.okkong.com;#限制访问的域名，可以有多个名称，中间用空格隔开，只有这些域名访问的才会代理到这个server配置下
        root         /okkong/kong/web/www/; #静态资源访问的根路径
        index index.html index.htm index.php; # 设置网站的默认首页
        include /etc/nginx/default.d/*.conf; #依赖的额外配置

        location / {
            try_files $uri $uri/ /index.html;
        }
        ## 反向代理设置
        location /api/ {
           proxy_pass http://127.0.0.1:8880;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; ##请求访问的外网ip
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_set_header X-Forwarded-Port $server_port;
        }
        error_page 404 500 502 503 504 /upgrade.html;
            location = /upgrade.html {
            root /usr/share/nginx/html/okni-status-html-master/upgrade;
        }
    }
```

### 请求gzip压缩

```
server {
        listen 80;
        server_name test.com www.test.com;
        root /webroot/www;
        location ~ .*\.(jpg|gif|png|bmp)$ {
                gzip on; #开启gzip压缩
                gzip_http_version 1.1;
                gzip_comp_level 3;
                gzip_types text/plain application/json application/x-javascript application/css application/xml application/xml+rss text/javascript application/x-httpd-php image/jpeg image/gif image/png image/x-ms-bmp;
                }
        }
```


### 正向代理配置
```
正向代理代理的是客户端，类似上网用的vpn。
```


### tcp 代理配置
正常的http代理机制
