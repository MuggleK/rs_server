# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2023/9/5 10:53
# @Author  : MuggleK
# @File    : demo.py
import json
import random
import time
from urllib.parse import quote

import ddddocr
import requests
from loguru import logger

from zxgk.proxy import get_proxies

ocr = ddddocr.DdddOcr(beta=True)
map_code = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"


def cap_verify(captcha_id, cap_pathname, session):
    img_url = f'http://zxgk.court.gov.cn{cap_pathname}?captchaId={captcha_id}&random={random.random()}'
    img_res = session.get(img_url, timeout=10, verify=False)  # 验证码识别不校验
    if img_res.status_code != 200:
        print(img_res.status_code)
        logger.debug("img cookie 不可用，正在重试...")
        return

    ocr_res = ocr.classification(img_res.content)

    img_verify_url = f"http://zxgk.court.gov.cn/{cap_pathname.split('/')[1]}/checkyzm.do?captchaId={captcha_id}&pCode={ocr_res}"
    img_verify_res = session.get(img_verify_url, timeout=10, verify=False, )
    if '1' in img_verify_res.text:
        logger.info(f"Captcha Verify success -> {ocr_res}")
        return ocr_res


def sx_search(keyword):
    pathname = '/shixin/searchSX.do'
    cap_pathname = '/shixin/captchaNew.do'
    cap_id = "".join([random.choice(map_code) for _ in range(32)])
    proxy = get_proxies()

    session = requests.session()
    session.headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Host": "zxgk.court.gov.cn",
        "Pragma": "no-cache",
        "Proxy-Connection": "close",
        "Upgrade-Insecure-Requests": "1",
        "Referer": f'http://zxgk.court.gov.cn/{pathname.split("/")[1]}/',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.50"
    }
    session.proxies = proxy
    index_html = session.get("http://zxgk.court.gov.cn/shixin", timeout=10, verify=False)

    api_json = requests.post("http://127.0.0.1:5678/houzhui", data={
        "source": index_html.text,
        "url": pathname
    }).json()
    session.cookies.update({
        "lqWVdQzgOVyaT": api_json.get("ck"),
    })

    code = cap_verify(cap_id, cap_pathname, session)
    if not code:
        raise Exception(f"Sx keyword：{keyword} cap_verify failed")

    search_list_data = {
        "pName": keyword[0],
        "pCardNum": keyword[1],
        "pProvince": "0",
        "pCode": code,
        "captchaId": cap_id,
        "currentPage": "1",
        "pageSize": 50
    }
    req_url = f'http://zxgk.court.gov.cn{pathname}'
    search_list_res = session.post(
        url=req_url, data=search_list_data, params={'vG5nbKcB': api_json.get("houzhui")},
        timeout=10, verify=False
    )
    if search_list_res.status_code != 200:
        raise Exception(f"Sx keyword：{keyword} searching failed status_code: {search_list_res.status_code}")

    for item in search_list_res.json()[0].get('result'):
        logger.debug(f"searching id -> {item.get('id')}")
        sx_detail(item.get('id'), item.get('caseCode'))
        break


def sx_detail(detail_id, detail_code):
    pathname = "/shixin/disDetailNew?"
    cap_pathname = '/shixin/captchaNew.do'
    cap_id = "".join([random.choice(map_code) for _ in range(32)])
    proxy = get_proxies()

    session = requests.session()
    session.headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Host": "zxgk.court.gov.cn",
        "Pragma": "no-cache",
        "Proxy-Connection": "keep-alive",
        "Referer": "http://zxgk.court.gov.cn/shixin/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.50",
        "X-Requested-With": "XMLHttpRequest"
    }
    session.proxies = proxy
    index_html = session.get("http://zxgk.court.gov.cn/shixin/", timeout=10, verify=False)

    api_json = requests.post("http://127.0.0.1:5678/houzhui", data={
        "source": index_html.text,
        "url": pathname
    }).json()
    session.cookies.update({
        "lqWVdQzgOVyaT": api_json.get("ck"),
    })
    code = cap_verify(cap_id, cap_pathname, session)

    post_data = f'id={detail_id}&caseCode={quote(detail_code, safe="/()")}&pCode={code}&captchaId={cap_id}'
    api_json = requests.post("http://127.0.0.1:5678/houzhui", data={
        "source": index_html.text,
        "url": pathname,
        'data': post_data
    }).json()
    session.cookies.update({
        "lqWVdQzgOVyaT": api_json.get("ck"),
    })
    search_detail_url = f'http://zxgk.court.gov.cn/shixin/disDetailNew?vG5nbKcB={api_json.get("houzhui")}'
    search_res = session.get(url=search_detail_url)

    logger.info(search_res.status_code)
    logger.info(search_res.text)
    return search_res.text


def zb_search(keyword):
    pathname = "/zhongben/search.do"
    cap_pathname = '/zhongben/captcha.do'
    cap_id = "".join([random.choice(map_code) for _ in range(32)])
    proxy = get_proxies()

    session = requests.session()
    session.headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Host": "zxgk.court.gov.cn",
        "Pragma": "no-cache",
        "Proxy-Connection": "close",
        "Upgrade-Insecure-Requests": "1",
        "Referer": f'http://zxgk.court.gov.cn/{pathname.split("/")[1]}/',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.50"
    }
    session.proxies = proxy
    index_html = session.get("http://zxgk.court.gov.cn/zhongben", timeout=10, verify=False)

    api_json = requests.post("http://127.0.0.1:5678/houzhui", data={
        "source": index_html.text,
        "url": pathname
    }).json()
    session.cookies.update({
        "lqWVdQzgOVyaT": api_json.get("ck"),
    })

    code = cap_verify(cap_id, cap_pathname, session)
    if not code:
        raise Exception(f"Sx keyword：{keyword} cap_verify failed")

    search_list_data = {
        "pName": keyword[0],
        "pCardNum": keyword[1],
        "pProvince": "0",
        "pCode": code,
        "captchaId": cap_id,
        "currentPage": "1",
        "pageSize": 50
    }
    req_url = f'http://zxgk.court.gov.cn{pathname}'
    search_list_res = session.post(
        url=req_url, data=search_list_data, params={'vG5nbKcB': api_json.get("houzhui")},
        timeout=10, verify=False
    )
    if search_list_res.status_code != 200:
        raise Exception(f"Sx keyword：{keyword} searching failed status_code: {search_list_res.status_code}")

    for item in search_list_res.json()[0].get('result'):
        logger.debug(f"searching id -> {item.get('id')}")
        zb_detail(item.get('id'))
        break


def zb_detail(detail_id):
    pathname = "/zhongben/searchZbDetail?"
    cap_pathname = '/zhongben/captcha.do'
    cap_id = "".join([random.choice(map_code) for _ in range(32)])
    proxy = get_proxies()

    session = requests.session()
    session.headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Host": "zxgk.court.gov.cn",
        "Pragma": "no-cache",
        "Proxy-Connection": "close",
        "Upgrade-Insecure-Requests": "1",
        "Referer": f'http://zxgk.court.gov.cn/{pathname.split("/")[1]}/',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.50"
    }
    session.proxies = proxy
    index_html = session.get("http://zxgk.court.gov.cn/zhongben", timeout=10, verify=False)

    api_json = requests.post("http://127.0.0.1:5678/houzhui", data={
        "source": index_html.text,
        "url": pathname
    }).json()
    session.cookies.update({
        "lqWVdQzgOVyaT": api_json.get("ck"),
    })
    code = cap_verify(cap_id, cap_pathname, session)

    post_data = f'id={detail_id}&j_captcha={code}&captchaId={cap_id}'
    api_json = requests.post("http://127.0.0.1:5678/houzhui", data={
        "source": index_html.text,
        "url": pathname,
        'data': post_data
    }).json()
    search_detail_url = f'http://zxgk.court.gov.cn/zhongben/searchZbDetail?vG5nbKcB={api_json.get("houzhui")}'
    search_res = session.get(url=search_detail_url)

    logger.info(search_res.status_code)
    logger.info(search_res.text)
    return search_res.text


def zx_search(keyword):
    pathname = "/zhixing/searchBzxr.do"
    cap_pathname = '/zhixing/captcha.do'
    cap_id = "".join([random.choice(map_code) for _ in range(32)])
    proxy = get_proxies()

    session = requests.session()
    session.headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Host": "zxgk.court.gov.cn",
        "Pragma": "no-cache",
        "Proxy-Connection": "close",
        "Upgrade-Insecure-Requests": "1",
        "Referer": f'http://zxgk.court.gov.cn/{pathname.split("/")[1]}/',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.50"
    }
    session.proxies = proxy
    index_html = session.get("http://zxgk.court.gov.cn/zhixing", timeout=10, verify=False)

    api_json = requests.post("http://127.0.0.1:5678/houzhui", data={
        "source": index_html.text,
        "url": pathname
    }).json()
    session.cookies.update({
        "lqWVdQzgOVyaT": api_json.get("ck"),
    })

    code = cap_verify(cap_id, cap_pathname, session)
    if not code:
        raise Exception(f"Sx keyword：{keyword} cap_verify failed")

    search_list_data = {
        "pName": keyword[0],
        "pCardNum": keyword[1],
        "pProvince": "0",
        "pCode": code,
        "captchaId": cap_id,
        "currentPage": "1",
        "pageSize": 50
    }
    req_url = f'http://zxgk.court.gov.cn{pathname}'
    search_list_res = session.post(
        url=req_url, data=search_list_data, params={'vG5nbKcB': api_json.get("houzhui")},
        timeout=10, verify=False
    )
    if search_list_res.status_code != 200:
        raise Exception(f"Sx keyword：{keyword} searching failed status_code: {search_list_res.status_code}")

    for item in search_list_res.json()[0].get('result'):
        logger.debug(f"searching id -> {item.get('id')}")
        zx_detail(item.get('id'))
        break


def zx_detail(detail_id):
    pathname = "/zhixing/newdetail?"
    cap_pathname = '/zhixing/captcha.do'
    cap_id = "".join([random.choice(map_code) for _ in range(32)])
    proxy = get_proxies()

    session = requests.session()
    session.headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Host": "zxgk.court.gov.cn",
        "Pragma": "no-cache",
        "Proxy-Connection": "close",
        "Upgrade-Insecure-Requests": "1",
        "Referer": f'http://zxgk.court.gov.cn/{pathname.split("/")[1]}/',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.50"
    }
    session.proxies = proxy
    index_html = session.get("http://zxgk.court.gov.cn/zhixing", timeout=10, verify=False)

    api_json = requests.post("http://127.0.0.1:5678/houzhui", data={
        "source": index_html.text,
        "url": pathname
    }).json()
    session.cookies.update({
        "lqWVdQzgOVyaT": api_json.get("ck"),
    })
    code = cap_verify(cap_id, cap_pathname, session)

    post_data = f'id={detail_id}&j_captcha={code}&captchaId={cap_id}&_={int(time.time() * 1000)}'
    api_json = requests.post("http://127.0.0.1:5678/houzhui", data={
        "source": index_html.text,
        "url": pathname,
        'data': post_data
    }).json()
    session.cookies.update({
        "lqWVdQzgOVyaT": api_json.get("ck"),
    })
    search_detail_url = f'http://zxgk.court.gov.cn{pathname}vG5nbKcB={api_json.get("houzhui")}'
    search_res = session.get(url=search_detail_url)

    logger.info(search_res.status_code)
    logger.info(search_res.text)
    return search_res.text


def xgl_search(keyword):
    pathname = "/xgl/searchXgl.do"
    cap_pathname = '/xgl/captchaXgl.do'
    cap_id = "".join([random.choice(map_code) for _ in range(32)])
    proxy = get_proxies()

    session = requests.session()
    session.headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Host": "zxgk.court.gov.cn",
        "Pragma": "no-cache",
        "Proxy-Connection": "close",
        "Upgrade-Insecure-Requests": "1",
        "Referer": f'http://zxgk.court.gov.cn/{pathname.split("/")[1]}/',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.50"
    }
    session.proxies = proxy
    index_html = session.get("http://zxgk.court.gov.cn/xgl/", timeout=10, verify=False)

    api_json = requests.post("http://127.0.0.1:5678/houzhui", data={
        "source": index_html.text,
        "url": pathname
    }).json()
    session.cookies.update({
        "lqWVdQzgOVyaT": api_json.get("ck"),
    })

    code = cap_verify(cap_id, cap_pathname, session)
    if not code:
        raise Exception(f"Sx keyword：{keyword} cap_verify failed")

    search_list_data = {
        "pName": keyword[0],
        "pCardNum": "",
        "selectCourtId": "0",
        "pCode": code,
        "captchaId": cap_id,
        "searchCourtName": "全国法院（包含地方各级法院）",
        "selectCourtArrange": "1",
        "currentPage": "1"
    }
    req_url = f'http://zxgk.court.gov.cn{pathname}'
    search_list_res = session.post(
        url=req_url, data=search_list_data, params={'vG5nbKcB': api_json.get("houzhui")},
        timeout=10, verify=False
    )
    if search_list_res.status_code != 200:
        raise Exception(f"xgl keyword：{keyword} searching failed status_code: {search_list_res.status_code}")

    for item in search_list_res.json()[0].get('result'):
        logger.debug(f"searching detail -> {item}")
        file_url = f'http://zxgk.court.gov.cn/xglfile{item.get("FILEPATH")}'
        session.headers["Referer"] = "http://zxgk.court.gov.cn/xgl/static/javascript/pdf.worker.js"
        file_res = session.get(url=file_url, timeout=10, verify=False)
        with open("test.pdf", "wb") as f:
            f.write(file_res.content)
        break


if __name__ == '__main__':
    # xgl_search(["张三", ""])
    # zx_search(["张三", ""])
    # sx_search(["张三", ""])
    zb_search(["张三", ""])