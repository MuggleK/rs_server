# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/6/13 17:06
# @Author  : Changchuan.Pei
# @File    : Rshu_vmp.py
import json

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

# with open('../resources/Rshu_vmp.js', 'r', encoding='utf-8')as f:
#     rs_ev = f.read()


class RshuVmp:

    def __init__(self, url, cookie_s, cookie_t, proxy=None):
        self.cookie_name_1 = cookie_s
        self.cookie_name_2 = cookie_t
        self.session = requests.session()
        self.session.headers = {
            'Cache-Control': 'no-cache',
            'User-Agent': UserAgent()
        }
        self.proxy = proxy
        # self.ev = rs_ev
        self.url = url
        self.cookie_80s = None
        self.cookie_80t = None
        self.full_code = None
        self.content, self.js_code, self.html_code = self.get_content()
        if self.js_code:
            self.new_code = self.get_ts()
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
        ts_code = re.findall(r"<script .*?>(.*?)</script>", self.html_code)[1] + ';'
        self.js_code = ts_code + self.js_code
        # try:
        #     temp_flag = re.findall(r'(.{4}=_\$.{2}\[_\$.{2}\[\d{2}\]\]\(_\$.{2},(.*?)\))', self.js_code)[0]
        # except:
        #     temp_flag = re.findall(r'(.{4}=_\$.{2}\.call\(.*?,(.*?)\))', self.js_code)[0]
        # new_js = """window.new_code = %s;break""" % temp_flag[1]
        # self.js_code = self.js_code.replace(temp_flag[0].replace('{', ''), new_js)
        # try:
        #     """处理将$_ts置空的情况"""
        #     ts_convert = re.findall("\{_\$.{2}\['\$_ts'\]=\{\};", self.js_code)[0]
        #     self.js_code = self.js_code.replace(ts_convert, '{return;')
        # except:
        #     pass
        # get_ts = """;function get_newcode(){return window.new_code;};"""
        # self.js_code = ts_code + self.js_code + get_ts
        # try:
        #     ctx = execjs.compile(self.js_code)
        #     new_code = ctx.call("get_newcode")
        # except:
        #     ctx = execjs.compile(self.js_code.encode('utf-8').decode('gbk', errors='ignore'))
        #     new_code = ctx.call("get_newcode")
        return ''

    def process_content(self):
        # env_content = re.findall('"content": "(.*?)",', self.ev)[0]
        self.full_code = self.js_code.replace('window = global;document={};', "") + self.new_code
        url = 'http://127.0.0.1:8001/api/cookie'
        rs_data = {
            "content": self.content,
            "js": self.full_code
        }
        res = requests.post(url, data={'requestdata': json.dumps(rs_data, ensure_ascii=False)}).json()
        if res["code"] == 200:
            self.cookie_80t = res["data"]

    def verify(self):
        if not self.js_code:
            return self.content, None
        self.session.headers.update({
            'cookie': f'{self.cookie_name_1}={self.cookie_80s};{self.cookie_name_2}={self.cookie_80t}'
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
            # if rs_vmp_text:
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
    cookie_s = '4hP44ZykCTt5S'
    cookie_t = '4hP44ZykCTt5T'
    base_url = 'http://www.gansu.gov.cn//common/search/2131cd29a68d4e9a8d847b20a8f37e43?_isAgg=false&amp;_isJson=false&amp;_pageSize=20&amp;_template=index&amp;_rangeTimeGte=&amp;_channelName=&amp;page=1'
    for _ in range(20):
        res = run(base_url, cookie_s, cookie_t)
        print(res)
