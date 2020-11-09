title: selenium 爬虫
author: kerns
abbrlink: 31378
date: 2020-09-14 21:13:13
tags:
---
## 安装 selenium

pip install -U selenium

ps: 在安装的过程中如果遇到被强的问题的，很容易 timeout

在mac 环境下需要修改下载源
```
cd ~
mkdir .pip
cd .pip
vim pip.conf
```

接着进入vim编辑，写入
```
[global]
index-url=http://mirrors.aliyun.com/pypi/simple/
[install]
trusted-host=mirrors.aliyun.com
```


### selenium 等待页面加载完成。

强制等待,目前用着是最好用的一个操作，

```
time.sleep
```

隐式等待
```
driver.implicitly_wait(10)
```
显示等待，有些时候执行不成功，具体原因还得定位
```
element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, '//*[@id="su"]'))
    )
```


### 后台执行

当需要在服务端运行的时候，这个非常有用。

```
chrome_options = Options()
chrome_options.add_argument('--headless') chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--disable-gpu')
dr = webdriver.Chrome(chrome_options=chrome_options)
```

### form 表单模拟登陆

如下，非常简单的操作，通过send_keys 就可以给表单对象设置value
```
uInput = dr.find_element_by_id("username")
uInput.send_keys("name")
passInput = dr.find_element_by_id("password")
passInput.send_keys("pasword")
dr.find_element_by_class_name("btn-login").click()
```


## selenium方式的优劣

* 优势：虽然通过浏览器内核，是简单的通过http模拟是媲美不了的，如果ajax很多，而且有很多拼接操作的页面，通过http请求，分析各个接口的含义需要花很多的时间，这个时候通过selenium通过浏览器内核直接抓取页面元素会方便很多。

* 劣势：比如模拟表单提交，如果ajax请求很少，或者没有，只有一次请求，但是又有很多动态的元素生成，这种情况下直接分析请求报文是更简单的操作。