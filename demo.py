# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/3/19 14:56
# @Author  : MuggleK
# @File    : demo.py

import requests


def test_4():
    cookie_s = 'UR3ZMlLdcLIE80S'
    cookie_t = 'UR3ZMlLdcLIE80T'
    base_url = 'http://cpquery.cnipa.gov.cn/'
    ts_url = 'http://cpquery.cnipa.gov.cn/a5IVAaJpIo06/DebmycUwILGb.ca73791.js'

    data = {
        "url": base_url,
        "ts_url": ts_url,
        "s": cookie_s,
        "t": cookie_t,
        "proxy": None
    }
    res = requests.post('http://192.168.9.3:5602/rs/4', data=data)
    print(res.json())


def test_5():
    cookie_s = 'FSSBBIl1UgzbN7NS'
    cookie_t = 'FSSBBIl1UgzbN7NT'
    base_url = 'http://www.xiantao.gov.cn/zwgk/zfxxgk/zfwjk/gfwj/'
    ts_url = 'http://www.xiantao.gov.cn/4QbVtADbnLVIc/c.FxJzG50F.b795048.js'
    data = {
        "url": base_url,
        "ts_url": ts_url,
        "s": cookie_s,
        "t": cookie_t
    }
    res = requests.post('http://192.168.9.3:5602/rs/5', data=data)
    print(res.json())


def test_vmp():
    cookie_s = 'VIP9lLgDcAL2S'
    cookie_t = 'VIP9lLgDcAL2T'
    base_url = 'http://beijing.chinatax.gov.cn/bjswj/c105358/hot.shtml'
    data = {
        "url": base_url,
        "s": cookie_s,
        "t": cookie_t,
    }
    res = requests.post('http://192.168.9.3:5602/rs/vmp', data=data)
    print(res.json())
    return res.json()


if __name__ == '__main__':
    # test_4()
    # test_5()
    vmp_res = test_vmp()
    hg_url = 'http://credit.customs.gov.cn/ccppserver/ccpp/queryList'
    hg_json = {"manaType": "0", "apanage": "", "depCodeChg": "", "curPage": "2", "pageSize": 20}
    headers = {
        "Cookie": vmp_res["data"]["cookie"],
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
    }
    hg_res = requests.post(hg_url, json=hg_json, headers=headers)
    print(hg_res.text)
