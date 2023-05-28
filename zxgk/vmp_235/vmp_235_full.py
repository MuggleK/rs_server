# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/6/13 17:06
# @Author  : MuggleK
# @File    : vmp_235_full.py

import execjs
import requests
import re
import time
from urllib.parse import urljoin
from traceback import format_exc
from requests.packages import urllib3

from loguru import logger
from utils.proxy import get_proxies
from utils.user_agent import UserAgent

urllib3.disable_warnings()

with open('zxgk_235.js', 'r', encoding='utf-8')as f:
    rs_ev = f.read()


class RshuVmp:

    def __init__(self, url, cookie_s, cookie_t, proxy=None):
        self.cookie_name_1 = cookie_s
        self.cookie_name_2 = cookie_t
        self.session = requests.session()
        self.session.headers = {
            'Cache-Control': 'no-cache',
            'Connection': 'close',
            'User-Agent': UserAgent()
        }
        self.proxy = proxy
        self.ev = rs_ev
        self.url = url
        self.cookie_80s = None
        self.cookie_80t = None
        self.full_code = None
        self.content, self.js_code, self.html_code = self.get_content()
        if self.js_code:
            self.new_code = self.get_ts()
            # phrase = re.findall(r'<=48\?\((.*?)\):_\$.{2}<=49\?', self.new_code)[0]
            # t_phrase = phrase.split(",")[1]
            # true_flag = phrase.split("=")[-1]
            # j_flag = re.findall(r'(_\$.{2})\[ --_\$.{2}\]', phrase)[0]
            # phrase_replace = phrase.replace(t_phrase, f'{t_phrase},{true_flag}=({j_flag}[0].length==3)?true:{true_flag}')
            # self.new_code = self.new_code.replace(phrase, phrase_replace)
            self.process_content()

    def get_content(self):
        res = self.session.get(self.url, verify=False, proxies=self.proxy, headers=self.session.headers, timeout=30)
        res.encoding = res.apparent_encoding
        if res.status_code == 202 or res.status_code == 412:
            self.cookie_80s = res.cookies.get_dict().get(self.cookie_name_1)
            content = re.findall('<meta content="(.*?)">', res.text)[0].split('"')[0]
            js_url = urljoin(self.url, re.findall(r"""<script type="text/javascript" charset="utf-8" src="(.*?)" r='m'>""", res.text)[0])
            js_code = self.session.get(js_url, verify=False, proxies=self.proxy, headers=self.session.headers, timeout=30).text
            return content, js_code, res.text
        return res.text, None, None

    def get_ts(self):
        ts_code = self.ev + re.findall(r"<script .*?>(.*?)</script>", self.html_code)[1]
        try:
            temp_flag = re.findall(r'(.{4}=_\$.{2}\[_\$.{2}\[\d{2}\]\]\(_\$.{2},(.*?)\))', self.js_code)[0]
        except:
            temp_flag = re.findall(r'(.{4}=_\$.{2}\.call\(.*?,(.*?)\))', self.js_code)[0]
        new_js = """window.new_code = %s;break""" % temp_flag[1]
        self.js_code = self.js_code.replace(temp_flag[0].replace('{', ''), new_js)
        try:
            """处理将$_ts置空的情况"""
            ts_convert = re.findall("\{_\$.{2}\['\$_ts'\]=\{\};", self.js_code)[0]
            self.js_code = self.js_code.replace(ts_convert, '{return;')
        except:
            pass
        get_ts = """;function get_newcode(){return window.new_code;};"""
        self.js_code = ts_code + self.js_code + get_ts
        try:
            ctx = execjs.compile(self.js_code)
            new_code = ctx.call("get_newcode")
        except:
            ctx = execjs.compile(self.js_code.encode('utf-8').decode('gbk', errors='ignore'))
            new_code = ctx.call("get_newcode")
        return new_code

    def process_content(self):
        self.full_code = self.js_code.replace('window = global;document={};', self.ev.replace("动态content", self.content)) + self.new_code + """var get_cookie = function(){return document.cookie.split(';')[0].split('=')[1];};"""
        self.full_code = self.full_code.replace("动态content", self.content)
        ctx = execjs.compile(self.full_code)
        self.cookie_80t = ctx.call('get_cookie')
        print(len(self.cookie_80t))

    def verify(self):
        if not self.js_code:
            return self.content, None
        self.session.headers.update({
            'cookie': f'{self.cookie_name_1}={self.cookie_80s};{self.cookie_name_2}={self.cookie_80t}',
            'referer': self.url,
        })
        res = self.session.get(url=self.url, headers=self.session.headers, proxies=self.proxy)
        res.encoding = res.apparent_encoding
        if res.status_code == 200:
            logger.info(f'{self.url}：状态码{res.status_code}，Cookie可用')
            return res.text, self.session.headers.get('cookie')
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
    base_url = 'http://zxgk.court.gov.cn/xgl/'
    res = run(base_url, cookie_s, cookie_t, get_proxies())
    print(res)