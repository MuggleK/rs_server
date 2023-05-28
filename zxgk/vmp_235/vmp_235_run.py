# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/6/13 17:06
# @Author  : MuggleK
# @File    : vmp_235_full.py
import random
import re
import time
from traceback import format_exc
from urllib.parse import urljoin

import cchardet
import httpx
import requests
from execjs import compile
from utils import logger, ROOT_DIR
from requests.packages import urllib3

from utils.proxy import get_proxies

urllib3.disable_warnings()

with open(f'{ROOT_DIR}/zxgk/vmp_235/zxgk_235.js', 'r', encoding='utf-8')as f:
    rs_ev = f.read()


def random_version():
    s_ver = [str(random.randint(89, 114)), '0', str(random.randint(1000, 9999)), str(random.randint(100, 999))]
    version = '.'.join(s_ver)
    return version


class RshuVmp:

    userAgent_version = random_version()
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Host": "zxgk.court.gov.cn",
        "Pragma": "no-cache",
        "Proxy-Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": f"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
                      f"Chrome/{userAgent_version} Safari/537.36"
    }

    def __init__(self, url, cookie_s, cookie_t, proxy=None):
        self.cookie_name_1 = cookie_s
        self.cookie_name_2 = cookie_t
        self.session = requests.session()
        self.session = httpx.Client(proxies=proxy, verify=False, headers=self.headers, timeout=30)
        self.proxy = proxy
        self.url = url
        self.cookie_80s = None
        self.content, self.js_code = self.get_content()
        if self.js_code:
            self.full_code = rs_ev.replace("动态content", self.content).replace("userAgent_version",
                                                                              self.userAgent_version) + self.js_code
            self.cookie_80t = self.process_content()

    def get_content(self):
        res = self.session.get(self.url)
        res_text = res.content.decode(cchardet.detect(res.content)["encoding"])

        if res.status_code == 202 or res.status_code == 412:
            self.cookie_80s = self.session.cookies.get(self.cookie_name_1)
            content = re.findall('<meta content="(.*?)">', res_text)[0].split('"')[0]
            js_url = urljoin(self.url, re.findall(r"""<script type="text/javascript" charset="utf-8" src="(.*?)" r='m'>""", res_text)[0])
            ts_code = re.findall(r"<script .*?>(.*?)</script>", res_text)[1]
            js_code = ts_code + self.session.get(js_url).text
            return content, js_code

        return res.text, None

    def process_content(self):
        exec_code = self.full_code + """function get_cookie(){return document.cookie.split(';')[0].split('=')[1];};"""
        exec_ctx = compile(exec_code)
        return exec_ctx.call('get_cookie')

    def verify(self):
        if not self.js_code:
            return self.content, None
        self.session.headers.update({
            'cookie': f'{self.cookie_name_1}={self.cookie_80s};{self.cookie_name_2}={self.cookie_80t}',
            'referer': self.url
        })
        res = self.session.get(url=self.url)
        res_text = res.content.decode(cchardet.detect(res.content)["encoding"])

        if res.status_code == 200:
            logger.info(f'{self.url}：状态码{res.status_code}，Cookie可用')
            return res_text, self.session.headers.get('cookie')
        else:
            logger.debug(f'状态码{res.status_code},Cookie不可用')

    def search_url(self, path_name, search_detail_url, method='get'):
        if not self.js_code: return

        exec_code = self.full_code.replace("/shixin/disDetailNew", path_name) + """var get_search=function (){return XMLHttpRequest.prototype.open("%s","%s")};""" % (method, search_detail_url)
        exec_ctx = compile(exec_code)
        search_url_ = exec_ctx.call('get_search').replace(':80', '')
        return search_url_


def get_ck(base_url, cookie_s, cookie_t):
    for _ in range(3):
        try:
            proxy = get_proxies(http2=True)
            rs_vmp = RshuVmp(base_url, cookie_s, cookie_t, proxy)
            rs_vmp_text, cookies = rs_vmp.verify()
            if rs_vmp_text and cookies:
                return rs_vmp
        except:
            logger.error(f'当前url：{base_url}, {format_exc(limit=3)}')
            time.sleep(0.5)


if __name__ == '__main__':
    import ddddocr
    ocr = ddddocr.DdddOcr(beta=True)


    def get_sx():

        cookie_s = 'lqWVdQzgOVyaS'
        cookie_t = 'lqWVdQzgOVyaT'
        base_url = 'http://zxgk.court.gov.cn/shixin/'
        proxy = get_proxies(http2=True)
        rs_vmp = RshuVmp(base_url, cookie_s, cookie_t, proxy)
        rs_vmp_text, cookies = rs_vmp.verify()

        img_url = 'http://zxgk.court.gov.cn/shixin/captchaNew.do?captchaId=KUotM7iZMtrYceH003Z8U86h1GrVtapu&random=0.21500194251143379'
        img_res = rs_vmp.session.get(img_url)
        res = ocr.classification(img_res.content)
        print(res)

        img_verify_url = f"http://zxgk.court.gov.cn/shixin/checkyzm.do?captchaId=KUotM7iZMtrYceH003Z8U86h1GrVtapu&pCode={res}"
        img_verify_res = rs_vmp.session.get(img_verify_url)
        print(img_verify_res.text)

        search_list_url = 'http://zxgk.court.gov.cn/shixin/searchSX.do'
        search_list_data = {
            "pName": "张三",
            "pCardNum": "",
            "pProvince": "0",
            "pCode": res,
            "captchaId": "KUotM7iZMtrYceH003Z8U86h1GrVtapu",
            "currentPage": "1"
        }
        search_list_res = rs_vmp.session.post(search_list_url, data=search_list_data)
        print(search_list_res.status_code)
        print(search_list_res.json())

        for item in search_list_res.json()[0].get('result'):
            ids = item.get('id')
            caseCode = item.get('caseCode')

            search_detail_url = f'http://zxgk.court.gov.cn/shixin/disDetailNew?id=707271156&caseCode=%EF%BC%882019%EF%BC%89%E5%86%800423%E6%89%A7421%E5%8F%B7&pCode={res}&captchaId=KUotM7iZMtrYceH003Z8U86h1GrVtapu'
            search_code = rs_vmp.full_code.replace('7cka', res) + """var get_search = function(){return XMLHttpRequest.prototype.open("%s","%s")};""" % ('get', search_detail_url)
            search_ctx = compile(search_code)
            search_url_ = search_ctx.call('get_search').replace(':80', '')
            print(search_url_)
            search_res = rs_vmp.session.get(url=search_url_,)
            print(search_res.status_code)
            print(search_res.text)
            break


    def get_zb():

        cookie_s = 'lqWVdQzgOVyaS'
        cookie_t = 'lqWVdQzgOVyaT'
        base_url = 'http://zxgk.court.gov.cn/zhongben/'
        proxy = get_proxies(http2=True)
        rs_vmp = RshuVmp(base_url, cookie_s, cookie_t, proxy)
        rs_vmp_text, cookies = rs_vmp.verify()
        print(rs_vmp_text)
        print(cookies)


    get_sx()
