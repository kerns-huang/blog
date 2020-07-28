title: Spring boot 类加载机制
author: kerns
abbrlink: 51241
date: 2020-07-21 22:41:29
tags:
---
spring boot的类加载机制其实和Spring 没有什么不同，如果有什么不同的，以前需要写一堆的xml配置文件来来申明类和类之间的关系，现在基本上不需要写这么多配置文件了。这说明Spring boot在Spring上还是做了优化了，能让程序员更好更快的开发自己的程序。
那么主要是那个变化省去了我们可以不用去写xml的麻烦。

扫描 -> 注册 - 生成bean

扫描注册类的过程如下：
{% plantuml %}
    class BeanDefinition{
	- String field
	+ getScope()
	# void method()
   }
   note right: spring 类的信息描述
   
   class RootBeanDefinition{
   }
   note right : 根路径信息描述，顶层类信息描述
   
   class ChildBeanDefinition{
   }
   note right : 属性描述
   
  interface BeanDefinitionRegistry{
    + registerBeanDefinition（String name, BeanDefinition definition）
  }
  note right: 类描述注册器
  
  class EntityScanPackages{
  
  }
  note right: EntityScan 注解实现类
  
  ChildBeanDefinition --|> BeanDefinition
  
  RootBeanDefinition --|> BeanDefinition
  
  BeanDefinitionRegistry ..> BeanDefinition
  
  EntityScanPackages ..> BeanDefinitionRegistry
  
{% endplantuml %}


获取bean的过程
{% plantuml %}

   interface BeanFactory{
   
   } 
   note right: bean 工厂类
  
{% endplantuml %}

## 核心类


+ BeanDefinition: Bean的定义类, 和xml里的配置一一对应;
+ BeanFacotry: Bean工厂接口;
+ BeanDefinitionRegistry: BeanDefinition的注册定义接口;
+ DefaultListableBeanFactory: ListableBeanFactory（extends BeanFactory）和BeanDefinitionRegistry的默认实现，提供BeanDefinition注册功能;
+ ApplicationContext: Spring上下文环境;
+ AbstractApplicationContext: 执行refresh()方法;
+ AbstractRefreshableApplicationContext： 提供抽象方法loadBeanDefinitions(DefaultListableBeanFactory beanFactory) 用于加载BeanDefinition.





## plantUML 参考资料

https://juejin.im/post/5c072b62e51d4520cf0ed5f8