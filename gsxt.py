# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/7/27 15:28
# @Author  : Changchuan.Pei
# @File    : gsxt.py

import re
import json
import execjs
import requests
import hashlib
from codes.rs_test import run as run_vmp


def process_fuck_js(js_content):
    js_content = js_content.split(';location.href=loc')[0].split('document.cookie=')[-1]
    r = execjs.eval(js_content).split(';')[0]
    return r


def get_clearance(html):
    data = json.loads(re.findall('go\((.*?)\)',html)[1])
    chars_length = len(data.get('chars'))
    for i in range(chars_length):
        for j in range(chars_length):
            result = data.get('bts')[0] + data.get('chars')[i] + data.get('chars')[j] + data.get('bts')[1]
            b = eval('hashlib.{}()'.format(data.get('ha')))
            b.update(result.encode(encoding='utf-8'))
            res = b.hexdigest()
            if res == data.get('ct'):
                return result


def run():
    session = requests.session()
    url = 'https://xz.gsxt.gov.cn/corp-query-search-1.html'
    form_data = {
        "nowNum": "",
        "province": "540000",
        "geetest_challenge": "",
        "geetest_validate": "",
        "geetest_seccode": "|jordan",
        "searchword": "大疆科技",
        "tab": "ent_tab",
        "token": "75312832"
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    }
    res = session.post(url, data=form_data, headers=headers)
    __jsluid_s = session.cookies.get_dict()["__jsluid_s"]
    headers["Cookie"] = f'JSESSIONID=ec2365295e9102c634fb324dec63; tlb_cookie=S13.8.2.186;__jsluid_s={__jsluid_s};'

    if res.status_code == 521 and 'document.cookie' in res.text:
        fuck_js_res = process_fuck_js(res.text)
        headers["Cookie"] += fuck_js_res + ';'

    print(headers)
    res = session.post(url, data=form_data, headers=headers)
    if res.status_code == 521 and 'chars' in res.text:
        __jsl_clearance_s = get_clearance(res.text)
        headers["Cookie"] = '='.join(headers["Cookie"].split('=')[:-1]) + f'={__jsl_clearance_s};'

    print(headers)
    res = session.post(url, data=form_data, headers=headers)
    if res.status_code in (412, 202):
        rs_cookie = test_vmp()["data"].get("cookie")
        if rs_cookie:
            headers["Cookie"] += rs_cookie
            print(headers)
            res = session.post(url, data=form_data, headers=headers)
            print(res.text)
            print(res.status_code)


def test_vmp():
    cookie_s = 'CXYlUDpRKrs0O'
    cookie_t = 'CXYlUDpRKrs0P'
    base_url = 'https://bt.gsxt.gov.cn/%7B9F024A5AF723EB8804148D59D5FF69C4D4D6EA66B2B09A86CE1AB7A7A56203138A88A2BEF6221E7D0FA2C1B38F162AFED5456AEAA1CB17BFD5FA72DAB0D477FD15ED15ED159F77B55C9ECD35CD35CD35F17B2CE8470B0D9B5CFBB63A1086AF369B172EEA2EDD2558CEAFDDE46842D436A0C1B3CEF291E3DFDD4BC7FE749C649C649C-1658821422712%7D'
    res_ = run_vmp(base_url, cookie_s, cookie_t)
    return res_


if __name__ == '__main__':
    run()
