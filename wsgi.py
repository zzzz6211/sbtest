"""
WSGI 入口 —— PythonAnywhere 部署用
PythonAnywhere Web 标签页中 WSGI configuration file 路径指向本文件
"""
import os
import sys

# ---- 部署时改为你的 PythonAnywhere 项目路径 ----
project_home = '/home/<username>/mysite'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

from server import app as application
