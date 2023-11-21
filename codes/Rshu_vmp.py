# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/6/13 17:06
# @Author  : MuggleK
# @File    : Rshu_vmp.py
import asyncio
import re
from urllib.parse import urljoin

import aiohttp
import execjs
from aiohttp import ClientTimeout
from loguru import logger
from requests.packages import urllib3

from utils.proxy import get_proxies
from utils.tools import retry_with_reset_and_error_return
from utils.user_agent import UserAgent

urllib3.disable_warnings()

with open('./resources/Rshu_vmp.js', 'r', encoding='utf-8')as f:
    rs_ev = f.read()


class RshuVmp:
    semaphore = None
    cookie_80s = None
    cookie_80t = None

    def __init__(self, url, cookie_s, cookie_t, headers=None):
        self.url = url
        self.cookie_name_1 = cookie_s
        self.cookie_name_2 = cookie_t
        self.headers = headers or {
            'Cache-Control': 'no-cache',
            'Connection': 'close',
            'User-Agent': UserAgent(),
        }

    async def get_content(self, session, proxy):
        async with self.semaphore:
            async with session.get(self.url, ssl=False, proxy=proxy) as response:
                base_text = await response.text()
                if response.status == 202 or response.status == 412:
                    if response.cookies:    # cookie_s可能没有值
                        self.cookie_80s = response.cookies.get(self.cookie_name_1).value
                    content = re.findall('<meta content="(.*?)">', base_text)[0].split('"')[0]
                    js_url = urljoin(self.url, re.findall(r"""<script type="text/javascript" charset=".*" src="(.*?)" r='m'>""", base_text)[0])
                    ts_code = re.findall(r"<script .*?>(.*?)</script>", base_text)[1]
                    js_code = ts_code + await self.get_dynamic_js(session, proxy, js_url)
                    return content, js_code

        return base_text, None

    async def get_dynamic_js(self, session, proxy, js_url):
        async with self.semaphore:
            async with session.get(js_url, ssl=False, proxy=proxy) as response:
                js_code = await response.text()
                return js_code

    def process_headers(self, content, js_code):
        full_code = rs_ev.replace("动态content", content) + js_code + """;function get_cookie(){return document.cookie.split(';')[0].split('=')[1];};"""
        ctx = execjs.compile(full_code)
        self.cookie_80t = ctx.call('get_cookie')
        source_cookie = self.headers.get('Cookie', "") or self.headers.get('cookie', "")
        rs_cookie = f'{self.cookie_name_1}={self.cookie_80s}; {self.cookie_name_2}={self.cookie_80t}'
        if source_cookie and not source_cookie.endswith(";"):
            source_cookie += ";"
        self.headers["Cookie"] = source_cookie + rs_cookie if source_cookie else rs_cookie
        self.headers["Referer"] = self.url

    async def verify(self, session, proxy):
        async with self.semaphore:
            async with session.get(self.url, ssl=False, proxy=proxy, headers=self.headers) as response:
                status_code = response.status
                if status_code == 200:
                    verify_text = await response.text()
                    logger.info(f'{self.url}：状态码 200，Cookie可用')
                    return verify_text
                else:
                    logger.error(f'{self.url}：状态码 {status_code}, Cookie不可用')

    @retry_with_reset_and_error_return()
    async def run(self, proxy=None):
        proxy = proxy or await get_proxies()
        self.semaphore = asyncio.Semaphore(50)
        async with aiohttp.ClientSession(headers=self.headers, timeout=ClientTimeout(15)) as session:
            content, js_code = await self.get_content(session, proxy['http'])
            if not js_code:
                return {
                    'msg': 'success',
                    'code': 200,
                    'data': {'html': content, 'cookie': None}
                }

            self.process_headers(content, js_code)
            verify_text = await self.verify(session, proxy['http'])
            return {
                'msg': 'success',
                'code': 200,
                'data': {'html': verify_text, 'cookie': self.headers["Cookie"]}
            }


if __name__ == '__main__':
    cookie_s = '924omrTVcFchO'
    cookie_t = '924omrTVcFchP'
    base_url = 'https://dfjrjgj.hubei.gov.cn/zfxxgk_GK2020/fdzdgknr_GK2020/gysyjs_GK2020/hmhq/202308/t20230803_4780792.shtml'
    spider = RshuVmp(base_url, cookie_s, cookie_t)
    asyncio.get_event_loop().run_until_complete(spider.run())
