# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/6/13 17:06
# @Author  : MuggleK
# @File    : vmp_235_full.py

import re
from urllib.parse import urljoin

import cchardet
import requests
from execjs import compile
from loguru import logger
from requests.packages import urllib3

from utils.proxy import get_proxies
from utils.user_agent import UserAgent

urllib3.disable_warnings()

with open('zxgk_192.js', 'r', encoding='utf-8')as f:
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
        self.full_code = rs_ev.replace("动态content", self.content) + self.js_code + """
        function get_cookie(){return document.cookie.split(';')[0].split('=')[1];};
        """
        full_ctx = compile(self.full_code)
        self.cookie_80t = full_ctx.call('get_cookie')
        print(len(self.cookie_80t))

    def verify(self):
        if not self.js_code:
            return self.content, None
        self.session.headers.update({
            'cookie': f'{self.cookie_name_1}={self.cookie_80s};{self.cookie_name_2}={self.cookie_80t}',
            'referer': self.url
        })
        res = self.session.get(url=self.url, headers=self.session.headers, proxies=self.proxy)
        res_text = res.content.decode(cchardet.detect(res.content)["encoding"])

        if res.status_code == 200:
            logger.info(f'{self.url}：状态码{res.status_code}，Cookie可用')
            return res_text, self.session.headers.get('cookie')
        else:
            logger.debug(f'状态码{res.status_code},Cookie不可用')


if __name__ == '__main__':
    import ddddocr

    ocr = ddddocr.DdddOcr(beta=True)

    def get_sx():

        cookie_s = 'lqWVdQzgOVyaS'
        cookie_t = 'lqWVdQzgOVyaT'
        base_url = 'http://zxgk.court.gov.cn/shixin/'
        proxy = get_proxies()
        rs_vmp = RshuVmp(base_url, cookie_s, cookie_t, proxy)
        rs_vmp_text, cookies = rs_vmp.verify()

        img_url = 'http://zxgk.court.gov.cn/shixin/captchaNew.do?captchaId=KUotM7iZMtrYceH003Z8U86h1GrVtapu&random=0.21500194251143379'
        img_res = rs_vmp.session.get(img_url, proxies=proxy)
        res = ocr.classification(img_res.content)
        print(res)

        img_verify_url = f"http://zxgk.court.gov.cn/shixin/checkyzm.do?captchaId=KUotM7iZMtrYceH003Z8U86h1GrVtapu&pCode={res}"
        img_verify_res = rs_vmp.session.get(img_verify_url, proxies=proxy)
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
        search_list_res = rs_vmp.session.post(search_list_url, data=search_list_data, proxies=proxy)
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
            search_res = rs_vmp.session.get(url=search_url_, proxies=proxy)
            print(search_res.status_code)
            print(search_res.text)
            break


    def get_zb():

        cookie_s = 'lqWVdQzgOVyaS'
        cookie_t = 'lqWVdQzgOVyaT'
        base_url = 'http://zxgk.court.gov.cn/xgl/'
        proxy = None
        rs_vmp = RshuVmp(base_url, cookie_s, cookie_t, proxy)
        rs_vmp_text, cookies = rs_vmp.verify()

        img_url = 'http://zxgk.court.gov.cn/xgl/captchaXgl.do?captchaId=KUotM7iZMtrYceH003Z8U86h1GrVtapu&random=0.21500194251143379'
        img_res = rs_vmp.session.get(img_url, proxies=proxy)
        res = ocr.classification(img_res.content)
        print(res)

        img_verify_url = f"http://zxgk.court.gov.cn/xgl/checkyzm.do?captchaId=KUotM7iZMtrYceH003Z8U86h1GrVtapu&pCode={res}"
        img_verify_res = rs_vmp.session.get(img_verify_url, proxies=proxy)
        print(img_verify_res.text)

        search_list_url = 'http://zxgk.court.gov.cn/xgl/searchXgl.do'
        search_list_data = {
            "pName": "张三",
            "pCardNum": "",
            "selectCourtId": "0",
            "pCode": res,
            "captchaId": "KUotM7iZMtrYceH003Z8U86h1GrVtapu",
            "searchCourtName": "全国法院（包含地方各级法院）",
            "selectCourtArrange": "1",
            "currentPage": "1"
        }
        search_list_res = rs_vmp.session.post(search_list_url, data=search_list_data, proxies=proxy)
        print(search_list_res.status_code)
        print(search_list_res.json())

    get_zb()