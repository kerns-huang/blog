title: pyinstaller应用整理
author: kerns
tags:
  - python
  - 打包
categories:
  - python
abbrlink: 46317
date: 2024-02-26 18:41:00
---
# 安装pyinstaller

pip install pyinstaller

## 如果安装失败，可执行以下两步：

1）“pip install pywin32”

2）“pip install wheel”

3）再试一下“pip install pyinstaller”

# 执行生成命令

## 单文件打包

pyinstaller -F *.py

## 多文件打包

1. 通过 pyi-makespec  *.py 会生成 .spec文件，修改spec的相关配置如下

``` python
# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['start_up.py'],
    pathex=[],
    binaries=[],
    datas=[],
    hiddenimports=['frozen_dir.py','locallife_server.py','locallife_gui.py'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='locallife_server',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=True,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
```

2: 执行命令 pyinstaller *.spec


## 命令参数介绍：

-F 表示生成单个可执行文件

-w 表示去掉控制台窗口，这在GUI界面时非常有用。不过如果是命令行程序的话那就把这个选项删除

-p 表示你自己自定义需要加载的类路径，一般情况下用不到

-i 表示可执行文件的图标


# 注意事项

## 1.文件路径的问题

在源码里面通过os.path.dirname(__file__)就可以找到相对路径，如果通过pyinstaller打包会找不到文件路径，需要通过下面的代码去适配。

```
def app_path():
    """Returns the base application path."""
    if hasattr(sys, 'frozen'):
        # Handles PyInstaller
        return os.path.dirname(sys.executable)  #使用pyinstaller打包后的exe目录
    return os.path.dirname(__file__)     
```


                        