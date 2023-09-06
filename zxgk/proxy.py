# -*- coding: utf-8 -*-
# @Project : CrawlersTools
# @Time    : 2022/6/21 17:06
# @Author  : MuggleK
# @File    : proxy.py

import httpx

from utils import logger


def get_proxies(http2=False):
    """
    默认httpx代理模式
    @param http2: 默认http1.1规则
    @return:
    """
    protocol = 'http://'
    try:
        proxy = httpx.get("http://crawlab.qizhidao.net/proxies/random").text.strip()
        proxy = protocol + proxy
        if http2:
            return {protocol: proxy, 'https://': proxy}
        return {"http": proxy, "https": proxy}
    except Exception as err:
        logger.error(f'获取代理失败：{err}')
