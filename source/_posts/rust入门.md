title: rust 入门篇
author: kerns
tags: []
categories:
  - rust
abbrlink: 34623
date: 2025-01-09 17:11:00
---
### rustc查看版本

```
rustc --version
```

### cargo 查看版本

```
cargo --version
```

### rust 升级到最新的稳定版本

```
rustup update stable
```

### 新建工程

```
cargo new hello_cargo
```

### 构建已有的工程 

```
cargo build
```

### 查看rustup 版本，检查是否要更新

```
rustup --version 
```

### 更新rustup

```
rustup self update
```


### 安装rust格式化

```
rustup component add rustfmt
```

## 多版本

### rust多版本显示

```
rustup toolchain list
```

### 切换rust版本

```
rustup default aarch64-apple-darwin
```

### 显示rust概况

```
rustup show
```

# 入门文档

```
https://kaisery.github.io/trpl-zh-cn/ch01-02-hello-world.html
```
