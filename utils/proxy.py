# -*- coding: utf-8 -*-
# @Project : RuiShu_Server
# @Time    : 2022/3/19 14:56
# @Author  : MuggleK
# @File    : proxy.py

import aiohttp

from utils import logger


async def get_proxies(proxy_type="random"):
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"http://crawlab.qizhidao.net/proxies/{proxy_type.lower()}") as response:
                proxy = await response.text()
                proxy = proxy.strip()
                return {'http': 'http://' + proxy, 'https': 'http://' + proxy}
    except Exception as err:
        logger.error(f'获取代理失败：{err}')
