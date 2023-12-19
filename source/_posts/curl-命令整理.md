title: curl 命令整理
author: kerns
abbrlink: 58890
tags: []
categories:
  - 运维
date: 2023-04-10 11:27:00
---
### 自动跳转
```
curl -L www.sina.com
```

### 显示头信息
```
curl -i www.sina.com
```
### 显示请求显示各项时间指标

```
curl -o /dev/null -s -w ‘%{time_total}’ http://www.miotour.com
curl -o /dev/null -s -w ‘%{http_code}’ http://www.miotour.com
curl -o /dev/null -s -w %{http_code}:%{time_connect}:%{time_starttransfer}:%{time_total} http://www.miotour.com
```

### 显示通信信息
```
curl -v www.sina.com
curl --trace output.txt www.sina.com
curl --trace-ascii output.txt www.sina.com
```
### post 请求
```
curl -d "user=Summer&passwd=12345678" "http://127.0.0.1:8080/check_your_status"

curl -X POST --data "data=xxx&data1=1231" example.com/form.cgi
curl -X POST "http://192.168.2.43:8801/graph/hashrate/search?minerType=1&timeType=123" -H "accept: */*" -H "userId: 12"

post方法还可以这样，传递json数据
curl -H "Content-Type:application/json" -X POST --data '{"message": "sunshine"}' http://localhost:8000/
```
### 表达编码
```
 curl -X POST--data-urlencode "date=April 1" example.com/form.cgi
```

### 添加头信息
```
curl --user-agent "[User Agent]" [URL]
curl --cookie "name=xxx" www.example.com
```
### 上传文件
```
curl -T wordpress.zip ftp://james:123456@202.121.137.58/path/to/backup/
curl -T data.tar.gz -u james sftp://202.121.137.58/
```
### 下载文件
重定向
```
 curl -L -o 'file.zip' 'http://example.com/download.php?fileID=foo'
```
下载需要用户名，密码
```
curl -O ftp://james:123456@202.121.137.58:21/path/to/backup.tar.gz
curl -O http://james:123456@202.121.137.58/file/path/data.tar.gz
```
节省带框
```
curl -L -O --compressed 'http://example.com/large.report-tab.html'
```
显示下载进度
```
curl -# -O http://wordpress.org/latest.zip
```
重命名
```
curl -o wordpress-3.8.zip 'http://wordpress.org/latest.zip'
```
带加密的连接
```
curl --ftp-ssl -u james:123456 -O ftp://202.121.137.58:21/backups/07/07/2012/mysql.blog.sql.tar.gz
curl -u james -O sftp://202.121.137.58/backups/data.tar.gz

```