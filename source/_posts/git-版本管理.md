title: git 版本管理
author: kerns
abbrlink: 30905
date: 2024-03-15 09:48:49
tags:
---
## git tag 管理

创建本地分支: git tag release-1.0.1 -m "drone调整"

推送本地所有分支: git push --tags

删除本地tag分支: git tag -d release-1.0.2

同步本地分和远程分支：git push origin :refs/tags/release-1.0.2


### tag 管理的好处

1. 能够很好的做版本管理，随时可以通过tag分支进行版本的回退，比如如果你所有的代码的发布都是通过master版本发布，一旦你需要做代码回退的处理，就只能修改代码取做回退，而代码修改难免出现问题，当然也可以使用docker镜像这种做版本管理。