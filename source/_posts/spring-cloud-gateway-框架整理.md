title: spring cloud gateway 框架整理
author: kerns
abbrlink: 40835
tags:
  - spring cloud
categories:
  - java
date: 2020-06-21 15:32:00
---
## 配置文件配置
```
spring:
  cloud:
    gateway:
      routes:
      - id: fiction-server
        uri: lb://xd-fiction-server
        predicates:
            - Path=/book/**  # 
        filters:
          - PrefixPath=/client # GatewayFilter，可以配置多个    
```
上面的配置会先通过 PathRoutePredicateFactory 查到 小说服务。然后通过PrefixPath 查找 小说服务的 /client/book/** 接口

## 各个接口简单说明

### Predicate

gateway的入口类，主要是通过头信息，参数，时间和路径查找对应的服务

### GatewayFilter
配置在配置文件的filter的的接口类。

### GlobalFilter

全局过滤器，默认所有的route都会通过该过滤器执行，一般实现该接口都会实现 orderd 接口，过滤器的执行顺序需要通过order去判断先后顺序，需要是指责链模式,具体可以查找FilteringWebHandler，改类给出了详细的实现方式，GlobalFilter和GatewayFilter虽然继承不同的接口，其实最终还是同一个地方用到。

### FilteringWebHandler

过滤器执行,把全局过滤器和局部过滤器按照orderd顺序排序执行。

### RoutePredicateHandlerMapping
 **gateway的核心执行类，**
 
 先通过Predicate查找对应的router
 ```
 protected Mono<Route> lookupRoute(ServerWebExchange exchange) {
		return this.routeLocator.getRoutes()
				// individually filter routes so that filterWhen error delaying is not a
				// problem
				.concatMap(route -> Mono.just(route).filterWhen(r -> {
					// add the current route we are testing
					exchange.getAttributes().put(GATEWAY_PREDICATE_ROUTE_ATTR, r.getId());
					return r.getPredicate().apply(exchange);
				})
						// instead of immediately stopping main flux due to error, log and
						// swallow it
						.doOnError(e -> logger.error(
								"Error applying predicate for route: " + route.getId(),
								e))
						.onErrorResume(e -> Mono.empty()))
				// .defaultIfEmpty() put a static Route not found
				// or .switchIfEmpty()
				// .switchIfEmpty(Mono.<Route>empty().log("noroute"))
				.next()
				// TODO: error handling
				.map(route -> {
					if (logger.isDebugEnabled()) {
						logger.debug("Route matched: " + route.getId());
					}
					validateRoute(route, exchange);
					return route;
				});

		/*
		 * TODO: trace logging if (logger.isTraceEnabled()) {
		 * logger.trace("RouteDefinition did not match: " + routeDefinition.getId()); }
		 */
	}
 ```
 然后通过 router查找到对应的FilteringWebHandler
 
 ```
 protected Mono<?> getHandlerInternal(ServerWebExchange exchange) {
		// don't handle requests on management port if set and different than server port
		if (this.managementPortType == DIFFERENT && this.managementPort != null
				&& exchange.getRequest().getURI().getPort() == this.managementPort) {
			return Mono.empty();
		}
		exchange.getAttributes().put(GATEWAY_HANDLER_MAPPER_ATTR, getSimpleName());

		return lookupRoute(exchange)
				// .log("route-predicate-handler-mapping", Level.FINER) //name this
				.flatMap((Function<Route, Mono<?>>) r -> {
					exchange.getAttributes().remove(GATEWAY_PREDICATE_ROUTE_ATTR);
					if (logger.isDebugEnabled()) {
						logger.debug(
								"Mapping [" + getExchangeDesc(exchange) + "] to " + r);
					}

					exchange.getAttributes().put(GATEWAY_ROUTE_ATTR, r);
					return Mono.just(webHandler);
				}).switchIfEmpty(Mono.empty().then(Mono.fromRunnable(() -> {
					exchange.getAttributes().remove(GATEWAY_PREDICATE_ROUTE_ATTR);
					if (logger.isTraceEnabled()) {
						logger.trace("No RouteDefinition found for ["
								+ getExchangeDesc(exchange) + "]");
					}
				})));
	}
 
 ```
 
 至于后面其实是基于Spring webflux做的一些事情，基本上有问题，入口类从这里找起会比较合适。
 
 
  
### RouteDefinitionRouteLocator

路由加载器，请求的时候会加载一边数据。如果需要知道Predicate 可以加载一个还是多个，是如何加载的，可以看下里面的代码。