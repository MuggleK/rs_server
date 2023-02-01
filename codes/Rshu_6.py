# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/3/19 15:01
# @Author  : MuggleK
# @File    : Rshu_6.py

import re
import time
from traceback import format_exc

import cchardet
import requests
from requests.packages import urllib3
from execjs import compile
from loguru import logger

from utils.proxy import get_proxies
from utils.user_agent import UserAgent

urllib3.disable_warnings()

with open('./resources/Rshu_6.js', 'r', encoding='utf-8')as f:
    rs_ev = f.read()


class Rshu6:

    def __init__(self, url, ts_url, cookie_s, cookie_t, proxy=None):
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
        self.ts_url = ts_url
        self.cookie_80s = None
        self.cookie_80t = None
        self.full_code = None
        self.js_code = self.get_content()
        if isinstance(self.js_code, str):
            self.process_ts()

    def get_content(self):
        res = self.session.get(self.url, verify=False, proxies=self.proxy)
        res_text = res.content.decode(cchardet.detect(res.content)["encoding"])

        if res.status_code == 202 or res.status_code == 412:
            self.cookie_80s = res.cookies.get_dict().get(self.cookie_name_1)
            onload_value = re.findall(r'<input type="hidden" id="__onload__".*?value="(.*?)">', res_text, re.S)
            self.ev = self.ev.replace("onload_value", onload_value[0]) if onload_value else self.ev
            js_code = re.findall(r'(\(function\(\).*\(\))</script>', res_text)[0]
            return js_code
        return {"html": res_text}

    def process_ts(self):
        ts_res = self.session.get(self.ts_url, proxies=self.proxy).text
        self.full_code = self.ev + self.js_code + ';' + ts_res + """;function get_cookie(){return document.cookie.split(';')[0].split('=')[1];};module.exports = {get_cookie}"""
        full_ctx = compile(self.full_code)
        self.cookie_80t = full_ctx.call("get_cookie")

    def verify(self):
        if isinstance(self.js_code, dict):
            return self.js_code.get("html"), None
        self.session.headers.update({
            'cookie': f'{self.cookie_name_1}={self.cookie_80s};{self.cookie_name_2}={self.cookie_80t}'
        })
        res = self.session.get(url=self.url, headers=self.session.headers, proxies=self.proxy)
        res_text = res.content.decode(cchardet.detect(res.content)["encoding"])
        if res.status_code == 200:
            logger.info(f'{self.url}：状态码{res.status_code}，Cookie可用')
            return res_text, self.session.headers.get('cookie')
        else:
            logger.debug(f'状态码{res.status_code},Cookie不可用')

    def search_verify(self, search_url, method='POST', post_data=None):
        """
        :param search_url:
        :param method:
        :return:
        """
        search_code = self.full_code.replace('search.jsp', search_url.split('?')[0]) + """var get_search = function(){return XMLHttpRequest.prototype.open("%s","%s")};""" % (method, search_url)
        search_ctx = compile(search_code)
        search_url_ = search_ctx.call('get_search').replace(':80', '')
        if method == 'POST':
            search_res = self.session.post(url=search_url_, headers=self.session.headers, data=post_data, proxies=self.proxy)
        else:
            search_res = self.session.get(url=search_url_, headers=self.session.headers, proxies=self.proxy)
        if search_res.status_code == 200:
            return search_res
        else:
            logger.error(f'searchVerify search_url：{search_url} -> {search_res.status_code}')


def run(base_url, ts_url, cookie_s, cookie_t, proxy=None):
    start_time = time.time()
    for _ in range(3):
        try:
            rs6 = Rshu6(base_url, ts_url, cookie_s, cookie_t, proxy)
            rs6_text, cookies = rs6.verify()
            if rs6_text:
                cost_time = format(time.time() - start_time, '.2f')
                logger.debug(f'{base_url} Total Cost: {cost_time}s')
                return {
                    'msg': 'success',
                    'code': 200,
                    'data': {'html': rs6_text, 'cookie': cookies}
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
    """
    后缀环境修改：location & document.charset & document.characterSet & canvas下的pathname（针对接口不一致的情况）
    """
    cookie_s = 'Cc2838679FS'
    cookie_t = 'Cc2838679FT'
    base_url = 'https://book.qidian.com/info/1031493614/'
    ts_url = 'https://book.qidian.com/b3c79ec/f890b6f5917/6da34174.js'
    temp_gx = run(base_url, ts_url, cookie_s, cookie_t)
    logger.info(temp_gx)
    # search_res = temp_gx.search_verify("content.jsp?tableId=25&tableName=TABLE25&tableView=国产药品&Id=109228", method='GET')
    # print(search_res.text)
