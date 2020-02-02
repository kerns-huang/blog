---
title: nginx的基本操作配置
categories:
  - nginx
tags:
  - nginx
abbrlink: 41392
date: 2019-09-07 16:00:00
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
默认不开启tcp代理，需要编译时候开启
```
cd /usr/local/src
wget http://nginx.org/download/nginx-1.12.1.tar.gz
tar zxf nginx-1.12.1.tar.gz
cd nginx-1.12.1
./configure --prefix=/usr/local/nginx --with-stream --without-http
make && make install
```
需要添加的配置：
```
stream {
    server {
        listen 3000;
        proxy_pass 127.0.0.1:3306;

    # 也支持socket
    # proxy_pass unix:/var/lib/mysql/mysql.socket;
    }
}
```
测试的例子，可以考虑测试mysql的链接，这个后续经过自己测试再添加。
### udp 代理配置
```
events {
    use epoll;
    worker_connections  1024;
}


stream {
    server {
        listen 3000 udp;
        proxy_pass 127.0.0.1:3001;

    }
}
```
# 参考资料

```
https://www.jianshu.com/p/244386221cc5
https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/
```
