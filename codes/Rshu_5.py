# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/3/19 14:56
# @Author  : MuggleK
# @File    : Rshu_5.py
import asyncio
from urllib.parse import urljoin

import aiohttp
import execjs
import requests
import re
import time
from traceback import format_exc

from aiohttp import ClientTimeout
from requests.packages import urllib3

from loguru import logger
from utils.proxy import get_proxies
from utils.tools import retry_with_reset_and_error_return
from utils.user_agent import UserAgent

urllib3.disable_warnings()


with open('./resources/Rshu_5.js', 'r', encoding='utf-8')as f:
    rs_ev = f.read()


class Rshu5:
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
                    if response.cookies:
                        self.cookie_80s = response.cookies.get(self.cookie_name_1).value
                    content = re.findall('<meta content="(.*?)">', base_text)[0].split('"')[0]
                    js_code = re.findall(r'(\(function\(\).*\(\))</script>', base_text)[0]
                    js_url = urljoin(self.url, re.findall(r"""<script type="text/javascript" charset=".*" src="(.*?)" r='m'>""", base_text)[0])
                    ts_text = await self.get_dynamic_js(session, proxy, js_url)
                    return content, ts_text + js_code

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

    async def search_verify(self, session, proxy, full_code, search_url, method='POST', post_data=None):

        search_code = full_code.replace('search.jsp', search_url.split('?')[0]) + """var get_search = function(){return XMLHttpRequest.prototype.open("%s","%s")};""" % (method, search_url)
        search_ctx = execjs.compile(search_code)
        search_url_ = search_ctx.call('get_search').replace(':80', '')
        async with self.semaphore:
            async with session.request(search_url_, ssl=False, proxy=proxy, headers=self.headers, data=post_data, method=method.lower()) as response:
                if response.status == 200:
                    search_res = await response.text()
                    return search_res
                else:
                    logger.error(f'searchVerify search_url：{search_url} -> {response.status}')

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
    """
    后缀环境修改：location & document.charset & document.characterSet & canvas下的pathname（针对接口不一致的情况）
    """
    cookie_s = 'sVoELocvxVW0S'
    cookie_t = 'sVoELocvxVW0T'
    base_url = 'http://www.nhc.gov.cn/wjw/gfxwjj/list.shtml'
    spider = Rshu5(base_url, cookie_s, cookie_t)
    asyncio.get_event_loop().run_until_complete(spider.run())
    # cookie_s = 'neCYtZEjo8GmS'
    # cookie_t = 'neCYtZEjo8GmT'
    # base_url = 'http://app1.nmpa.gov.cn/data_nmpa/face3/base.jsp?tableId=25&tableName=TABLE25&title=%B9%FA%B2%FA%D2%A9%C6%B7&bcId=152904713761213296322795806604'
    # ts_url = 'http://app1.nmpa.gov.cn/ZvbYc1RuNkYg/h2XbjSpBo3BD.a670748.js'
    # while True:
    #     startTime = time.time()
    #     temp_gx = Rshu5(base_url, ts_url, cookie_s, cookie_t)
    #     cookies = temp_gx.verify()
    #     if cookies:
    #         logger.success(f'base_url -> {base_url} -> {cookies}')
    #         costTime = format(time.time() - startTime, '.2f')
    #         logger.debug(f'Total Cost: {costTime}s')
    #         post_data_ = {
    #             'bcId': '152904713761213296322795806604',
    #             'tableId': 25,
    #             'keyword': '%E7%94%9F%E7%89%A9',
    #             'State': 1
    #         }
    #         search_res = temp_gx.searchVerify("search.jsp?", method='POST', post_data=post_data_)
    #         print(search_res.text)
    #     break
