# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/3/19 14:56
# @Author  : MuggleK
# @File    : proxy.py

import requests
from loguru import logger


def get_proxies():
    try:
        proxy = requests.get("http://192.168.4.155:5555/random").text.strip()   # proxy_url自定义
        return {'http': 'http://' + proxy, 'https': 'http://' + proxy}
    except:
        logger.error("获取代理失败")
