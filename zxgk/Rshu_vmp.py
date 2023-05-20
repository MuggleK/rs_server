# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/6/13 17:06
# @Author  : MuggleK
# @File    : Rshu_vmp.py

import re
import time
from urllib.parse import urljoin
from traceback import format_exc

import cchardet
import requests
from requests.packages import urllib3
from execjs import compile
from loguru import logger

from utils.proxy import get_proxies
from utils.user_agent import UserAgent

urllib3.disable_warnings()

with open('./Rshu_vmp_.js', 'r', encoding='utf-8')as f:
    rs_ev = f.read()


class RshuVmp:

    def __init__(self, url, cookie_s, cookie_t, proxy=None):
        self.cookie_name_1 = cookie_s
        self.cookie_name_2 = cookie_t
        self.session = requests.session()
        self.session.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36'
        }
        self.proxy = proxy
        self.url = url
        self.cookie_80s = None
        self.cookie_80t = None
        self.content, self.js_code = self.get_content()
        if self.js_code:
            self.process_content()

    def get_content(self):
        res = self.session.get(self.url, verify=False, proxies=self.proxy, headers=self.session.headers, timeout=30)
        res_text = res.content.decode(cchardet.detect(res.content)["encoding"])

        if res.status_code == 202 or res.status_code == 412:
            self.cookie_80s = res.cookies.get_dict().get(self.cookie_name_1)
            content = re.findall('<meta content="(.*?)">', res_text)[0].split('"')[0]
            js_url = urljoin(self.url, re.findall(r"""<script type="text/javascript" charset="utf-8" src="(.*?)" r='m'>""", res_text)[0])
            ts_code = re.findall(r"<script .*?>(.*?)</script>", res_text)[1]
            js_code = ts_code + self.session.get(js_url, verify=False, proxies=self.proxy, headers=self.session.headers, timeout=30).text
            return content, js_code

        return res.text, None

    def process_content(self):
        full_code = rs_ev.replace("动态content", self.content) + self.js_code + """
        function get_cookie(){return document.cookie.split(';')[0].split('=')[1];};
        """
        full_ctx = compile(full_code)
        self.cookie_80t = full_ctx.call('get_cookie')
        print(len(self.cookie_80t))

    def verify(self):
        if not self.js_code:
            return self.content, None
        self.session.headers.update({
            'cookie': f'{self.cookie_name_1}={self.cookie_80s};{self.cookie_name_2}={self.cookie_80t}',
            'Referer': self.url
        })
        res = self.session.get(url=self.url, headers=self.session.headers, proxies=self.proxy)
        res_text = res.content.decode(cchardet.detect(res.content)["encoding"])

        if res.status_code == 200:
            logger.info(f'{self.url}：状态码{res.status_code}，Cookie可用')
            return res_text, self.session.headers.get('cookie')
        else:
            logger.debug(f'状态码{res.status_code},Cookie不可用')


def run(base_url, cookie_s, cookie_t, proxy=None):
    start_time = time.time()
    for _ in range(3):
        try:
            rs_vmp = RshuVmp(base_url, cookie_s, cookie_t, proxy)
            rs_vmp_text, cookies = rs_vmp.verify()
            if rs_vmp_text:
                cost_time = format(time.time() - start_time, '.2f')
                logger.debug(f'{base_url} Total Cost: {cost_time}s')
                return {
                    'msg': 'success',
                    'code': 200,
                    'data': {'html': rs_vmp_text, 'cookie': cookies}
                }
        except:
            logger.error(f'当前url：{base_url}, {format_exc(limit=3)}')
            time.sleep(0.5)
            proxy = get_proxies()

    return {
        'msg': 'Max Retries Had Happened',
        'code': 500,
        'data': {'html': None}
    }


if __name__ == '__main__':
    cookie_s = 'lqWVdQzgOVyaS'
    cookie_t = 'lqWVdQzgOVyaT'
    base_url = 'http://zxgk.court.gov.cn/shixin/'
    res = run(base_url, cookie_s, cookie_t, get_proxies())
    print(res)