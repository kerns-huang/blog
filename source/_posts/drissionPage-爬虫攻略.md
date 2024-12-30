title: drissionPage 爬虫攻略
author: kerns
tags:
  - 爬虫
categories:
  - python
abbrlink: 25700
date: 2024-12-30 09:51:00
---
# 简单的代码示例

``` python
from DrissionPage import WebPage, ChromiumOptions
# 基于谷歌浏览器的配置
options = ChromiumOptions()
# 无头设置
options.headless(True)
options.set_argument('--no-sandbox')
# 可以设置代理的配置
if proxy:
    options.set_proxy(proxy['http' if 'http' in proxy else 'https'])
# 初始化 SessionPage 对象
page = WebPage(timeout=50, chromium_options=options)
 page.get(baseurl)
page.wait.ele_displayed('__APP')
match = re.search(r'href="([^"]*delisting\?[^"]*)"', page.html)
if match:
   print(""12313")
```



# 总结

和 selenium 类似，本来就是从 selenium 发展而来，但也可以实现request的方法，既可以爬去网页，也可以直接调用请求。



# 官网

https://drissionpage.cn/

# 开源代码
https://gitee.com/PLA-huiziqin/DrissionPage?skip_mobile=true