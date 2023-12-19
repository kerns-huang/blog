title: selenium 爬虫
author: kerns
abbrlink: 31378
tags:
  - 爬虫
  - ''
categories:
  - python
date: 2020-09-14 21:13:00
---
## 安装 selenium

pip install -U selenium

ps: 在安装的过程中如果遇到被墙的问题的，很容易 timeout

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

### 内核安装
[crome](https://chromedriver.chromium.org/)


### selenium 等待页面加载完成。

强制等待,目前用着是最好用的一个操作，

```
time.sleep
```

隐式等待
```
driver.implicitly_wait(10)
```
显示等待，有些时候执行不成功，具体原因还得定位，在python里面不好用，在java里面挺好用的
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

### 调用对应的事件
java:
```
Actions action = new Actions(driver);
action.doubleClick(tds.get(2)).perform();
```

### 回退和前进

java 回退
```
 driver.navigate().back();
```

java 前进
```
 driver.navigate().forward();
```

### 多页面，切换页面

```
Set<String> set = driver.getWindowHandles();
for (String handle : set) {
    driver.switchTo().window(handle);
    //获取满足条件的 页面
}
                            
```

## selenium 反爬机制

目前在爬取 问财 网站的时候遇到了 反爬的机制，反爬机制的原因是因为selenium的一个特征机制被识别，导致爬虫失效。
可以添加 如果配置项消除 selenium 特征。

```
chrome_options.add_argument("--disable-blink-features")
chrome_options.add_argument("--disable-blink-features=AutomationControlled")
```





## selenium方式的优劣

* 优势：虽然通过浏览器内核，是简单的通过http模拟是媲美不了的，如果ajax很多，而且有很多拼接操作的页面，通过http请求，分析各个接口的含义需要花很多的时间，这个时候通过selenium通过浏览器内核直接抓取页面元素会方便很多。

* 劣势：比如模拟表单提交，如果ajax请求很少，或者没有，只有一次请求，但是又有很多动态的元素生成，这种情况下直接分析请求报文是更简单的操作。



## 参考资料


http://www.python66.com/seleniumjiaocheng/182.html