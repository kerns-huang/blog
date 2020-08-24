title: 反向代理实现
author: kerns
date: 2020-08-20 08:57:27
tags:
---
反向代理，我们常用的反向代理工具是nginx，我们通过nginx 来实现流量分发。因为nginx是一个高并发的服务器，可以高达100万的并发处理。

## nginx 实现反向代理

## 网关代理


## go 反向代理实现

### 简易http 反向代理

```
type Poxy struct{}

func (p *Poxy) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	trueServer := "https://localhost:8019"
	url, err := url.Parse(trueServer)
	if err != nil {
		log.Println(err)
		return
	}
	proxy := httputil.NewSingleHostReverseProxy(url)
	log.Println(proxy)
	proxy.ServeHTTP(w, r)
}

func main() {
	http.Handle("/", &Poxy{})
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```
如上面的代理，我可以把对 http://localhost:8019/api/v1/propaganda/no的访问通过http://localhost:8080/api/v1/propaganda/no实现，单这种情况下我没办法实现对https的代理。






