---
title: java高并发细节优化
author: kerns
tags:
  - 高并发
categories:
  - java
abbrlink: 5576
date: 2020-08-07 21:50:00
---
### 逃逸分析和栈上分配

* 逃逸分析：
   
   就是分析出对象的作用域。当一个对象在方法体内声明后，该对象的引用被其他外部所引用时该对象就发生了逃逸，反之就会在栈帧中为对象分配内存空间。就是一个对象如果尽量在自己的方法区内调用，能增加方法执行的效率。

* user1:

```
@Data
public class User {
    private String id;
    private String name;
}

```
* user1的测试时间：

![upload successful](/images/pasted-7.png)

user2:
```
public class User {
    private String id;

    private String name;

    private ArrayList<String> tt=new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


}
```
* user2 测试的执行时间

![upload successful](/images/pasted-6.png)

* 测试代码
```
public class UserTest {
    public static void alloc() {
        User user = new User();
        user.setId("12123");
        user.setName("1231231");
    }

    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        for (int i = 0; i < 1024 * 1024 * 1024; i++) {
            alloc();
        }
        System.out.println(System.currentTimeMillis() - start);
    }
}
```

两者之间的区别只是加了一个 ArrayList，效率的区别是几千倍。出现这种情况是因为 栈空间是有限的，而列表可以添加的数据是不确定的，所以jvm默认是不会把该对象放在栈空间，而只是放在堆空间。

jvm关闭逃逸分析
```
-XX:-DoEscapeAnalysis
```
jdk1.6之后默认情况下是开启的，正常情况也没有理由去关闭，毕竟能够更好的提神效率。


### 使用Integer的优化 

如果项目里面对于Integer的重复使用频率很高，Integer的优化主要是基于java代码的优化
下面的方法会优先使用缓存返回。而缓存的返回，可以继续看源码

![upload successful](/images/pasted-8.png)


* high的值你可以通过 环境变量去设置。

![upload successful](/images/pasted-9.png)


当然基于这种原理，如果你实现知道自己会使用很多重复的Long类型，也可以使用这种方式去优化,Long 里面其实也有cache 但是写死了只有-128 到127 ，如果需要更多，可以直接写一个类，做数据的缓存。


