# -*- coding: utf-8 -*-
# @Project : flaskProject
# @Time    : 2022/6/23 10:41
# @Author  : Changchuan.Pei
# @File    : gunicorn.py

import os
import gevent.monkey
import multiprocessing

gevent.monkey.patch_all()

if not os.path.exists('logs'):
    os.mkdir('logs')

debug = True
# 监听端口
bind = '0.0.0.0:5602'
# 启动的进程数
workers = multiprocessing.cpu_count() * 2 + 1
# 指定每个工作者的线程数
threads = 1
# 并发方式
worker_class = 'gunicorn.workers.ggevent.GeventWorker'
# 设置最大并发量
worker_connections = 3000
# 日志等级
loglevel = 'debug'
# 日志目录
pidfile = 'logs/gunicorn.pid'
logfile = 'logs/debug.log'
errorlog = 'logs/error.log'
accesslog = 'logs/access.log'

x_forwarded_for_header = 'X-FORWARDED-FOR'
