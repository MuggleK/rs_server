# -*- coding: utf-8 -*-
# @Project : RuiShu_Server
# @Time    : 2022/3/19 14:56
# @Author  : Changchuan.Pei
# @File    : proxy.py

import requests


def get_proxies():
    proxy = requests.get("http://192.168.4.155:5555/random").text.strip()
    return {'http': 'http://' + proxy, 'https': 'http://' + proxy}
