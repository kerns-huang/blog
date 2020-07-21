title: go gin web 初探
author: kerns
abbrlink: 19435
tags: []
categories:
  - go
date: 2020-07-20 09:57:00
---
## 1 ：gin 开发web 

使用goland新建一个go mod工程， 简单的 hello word 程序
```
import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main(){
	engine := gin.Default()
   
	engine.GET("test",func(c *gin.Context){
		c.JSON(http.StatusOK,gin.H{"code":200,"msg":"hell word"})
	})
	engine.Run(":8089")
}
```

## 2: 一般的web开发，总会使用到数据库，最常用的数据库就是mysql，所以我们需要引入mysql。
我们需要引入 mysql 的支持
```
go get github.com/go-sql-driver/mysql
```

然后代码变成了

```
func main(){
	engine := gin.Default()
	engine.GET("test",func(c *gin.Context){
		db, err := sql.Open("mysql", "user:password@tcp(ip:port)/dbname")
		db.Exec("insert into user values(?,?)",1,"张三")
		c.JSON(http.StatusOK,gin.H{"code":200,"msg":"hell word"})
	})
	engine.Run(":8089")
}

```


## 3 如2那样的代码，sql直接写在代码里面会不会不是太符合面向对象的逻辑，是否能够逻辑结构更清晰一点。

在这个阶段 gorm 登场
```
go get github.com/jinzhu/gorm
```

这个阶段把数据库的链接单独拿出来，整理一个单独的go文件
```
package db

import _ "github.com/go-sql-driver/mysql"
import "github.com/jinzhu/gorm"

var SqlDB *gorm.DB

func init() {
	//创建一个数据库的连接
	var err error
	SqlDB, err = gorm.Open("mysql", "username:password@tcp(ip:port)/dbname?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic("failed to connect database")
	}
}
```

定义一个单独的 user model 类

```
import (
	 "chain-web/user-web/db"
	"log"
)
type User struct {
	ID   int64 `json:"id"`
	Name  string `json:"name"`
}
//操作用户指针，不需要返回ID
func (user *User) Insert() (err error) {
	//添加数据
	err = db.SqlDB.Create(&user).Error
	return err
}
```

main 方法变为

```
func main(){
	engine := gin.Default()
	engine.GET("test",func(c *gin.Context){
		var user model.User
		c.ShouldBind(user)
		user.Insert()
		c.JSON(http.StatusOK,gin.H{"code":200,"msg":"hell word"})
	})
	engine.Run(":8089")
}
```

在这个场景下，我们还可以把 路径和具体实现这块单独抽离出来，定一个router的包,response的返回一般情况下我们会有同一个的格式，所以也会抽离出来，具体的实现也会抽离，所以结构会变成如下

```
web
   db //数据库的配置
   handler //具体的controller实现
   router  // 路由的配置
   response //同一个 response配置
   model  // 数据库的操作，user.Insert()之类。
```
db.mysql.go
```
import _ "github.com/go-sql-driver/mysql"
import "github.com/jinzhu/gorm"

var SqlDB *gorm.DB

func init() {
	//创建一个数据库的连接
	var err error
	SqlDB, err = gorm.Open("mysql", "username:password@tcp(ip:port)/dbname?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic("failed to connect database")
	}
}
```
model.test.go
```
import (
	 "chain-web/user-web/db"
)
type Test struct {
	ID   int64 `json:"id"`
	Name  string  `form:"name" json:"name"` 
}

//操作用户指针，不需要返回ID
func (test *Test) Insert() (err error) {
	//添加数据
	err = db.SqlDB.Create(&test).Error
	return err
}
```
handler.handler.go
```
import (
	"chain-web/user-web/model"
	"chain-web/user-web/response"
	"github.com/gin-gonic/gin"
)

func Insert(c *gin.Context) {
	var user model.Test
	c.ShouldBind(&user)
	err :=user.Insert()
	if err != nil{
		response.FailWithMessage("数据保存失败",c)
	}else {
		response.Ok(c)
	}
}
```
response.go

```
package response

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type Response struct {
	Code int         `json:"respCode"`
	Msg  string      `json:"respMsg"`
	Data interface{} `json:"respData"`
}

const (
	ERROR      = 7
	SUCCESS    = 0
)

func Result(code int, data interface{}, msg string, c *gin.Context) {
	// 开始时间
	c.JSON(http.StatusOK, Response{
		code,
		msg,
		data,
	})
}

func Ok(c *gin.Context) {
	Result(SUCCESS, map[string]interface{}{}, "操作成功", c)
}

func OkWithMessage(message string, c *gin.Context) {
	Result(SUCCESS, map[string]interface{}{}, message, c)
}

func OkWithData(data interface{}, c *gin.Context) {
	Result(SUCCESS, data, "操作成功", c)
}

func OkDetailed(data interface{}, message string, c *gin.Context) {
	Result(SUCCESS, data, message, c)
}

func Fail(c *gin.Context) {
	Result(ERROR, map[string]interface{}{}, "操作失败", c)
}

func FailWithMessage(message string, c *gin.Context) {
	Result(ERROR, map[string]interface{}{}, message, c)
}

func FailWithDetailed(code int, data interface{}, message string, c *gin.Context) {
	Result(code, data, message, c)
}
```

router.go

```
import "github.com/gin-gonic/gin"
import ."chain-web/user-web/handler"

func Init(router *gin.Engine)  {
	outAuthRouter(router)
}
// 不需要认证的接口
func outAuthRouter(router *gin.Engine) {
	v1 := router.Group("/api/v1")
	v1.POST("/test/insert", Insert)
}

```

## 4 参数的校验

在java环境中，特别是Spring环境中，我们可以使用valid 注解来做参数的自动化校验，去掉了很多和主要业务无关的代码，在go里面，是用什么样的方式去处理的？


## 5 一般的web开发还涉及 登陆，注册，权限状态的变化。










## 6 接口文档swagger的引入。




## 7 微服务的引入。