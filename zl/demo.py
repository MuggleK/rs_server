# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2023/9/5 10:53
# @Author  : MuggleK
# @File    : demo.py
import re

import requests
from loguru import logger
from parsel import Selector

from utils.proxy import get_proxies

headers = {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Host": "epub.cnipa.gov.cn",
    "Origin": "http://epub.cnipa.gov.cn",
    "Pragma": "no-cache",
    "Referer": "http://epub.cnipa.gov.cn/Dxb/IndexPDQuery",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.50",
    "X-Requested-With": "XMLHttpRequest"
}


type_map = {
    "FMGB": "1",
    "FMSQ": "3",
    "XXSQ": "6",
    "WGSQ": "9",
}


def parse_index():
    pathname = "/Dxb/PageQuery"
    ind_url = "http://epub.cnipa.gov.cn/Index"

    proxy = get_proxies()
    session = requests.session()
    session.headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.50",
    }
    session.proxies = proxy
    index_html = session.get(ind_url, timeout=10, verify=False)

    api_json = requests.post("http://127.0.0.1:5699/suffix", data={
        "html": index_html.text,
        "checkPath": pathname
    }).json()
    session.cookies.update({
        "wIlwQR28aVgbT": api_json.get("cookie"),
    })

    ind_res = session.get(ind_url, timeout=10, verify=False)
    if ind_res.status_code == 200:
        logger.debug("index page parse successfully")
        selector = Selector(ind_res.text)
        list_xpath = selector.xpath('//ul[@class="uli"]/li/a')
        __RequestVerificationToken = selector.xpath('//input[@name="__RequestVerificationToken"]/@value').extract_first("")
        for l in list_xpath:
            date_type = re.findall(r"zl_Show\(\'(.*?)\',\'(.*?)\'\)", l.xpath('./@onclick').extract_first(""))[0]
            logger.debug(f"detail parsing date_type: {date_type}")
            parse_detail(date_type, __RequestVerificationToken)
            break
    else:
        logger.error(f"index page parse failed with status code: {ind_res.status_code}")


def parse_detail(date_type, __RequestVerificationToken):
    pathname = "/Dxb/PageQuery"
    detail_url = "http://epub.cnipa.gov.cn/Dxb/PageQuery"

    proxy = get_proxies()
    session = requests.session()
    session.headers = headers
    session.proxies = proxy
    index_html = session.get("http://epub.cnipa.gov.cn/", timeout=10, verify=False)

    api_json = requests.post("http://127.0.0.1:5699/suffix", data={
        "html": index_html.text,
        "checkPath": pathname
    }).json()
    session.cookies.update({
        "wIlwQR28aVgbT": api_json.get("cookie"),
        ".AspNetCore.Antiforgery._KFiUbxqpVA": __RequestVerificationToken,
    })

    detail_data = {
        "searchCatalogInfo.Pubtype": type_map[date_type[1]],
        "searchCatalogInfo.Ggr_Begin": date_type[0],
        "searchCatalogInfo.Ggr_End": "",
        "searchCatalogInfo.Pd_Begin": "",
        "searchCatalogInfo.Pd_End": "",
        "searchCatalogInfo.An": "",
        "searchCatalogInfo.Pn": "",
        "searchCatalogInfo.Ad_Begin": "",
        "searchCatalogInfo.Ad_End": "",
        "searchCatalogInfo.E71_73": "",
        "searchCatalogInfo.E72": "",
        "searchCatalogInfo.Edz": "",
        "searchCatalogInfo.E51": "",
        "searchCatalogInfo.Ti": "",
        "searchCatalogInfo.Abs": "",
        "searchCatalogInfo.Edl": "",
        "searchCatalogInfo.E74": "",
        "searchCatalogInfo.E30": "",
        "searchCatalogInfo.E66": "",
        "searchCatalogInfo.E62": "",
        "searchCatalogInfo.E83": "",
        "searchCatalogInfo.E85": "",
        "searchCatalogInfo.E86": "",
        "searchCatalogInfo.E87": "",
        "pageModel.pageNum": "1",
        "pageModel.pageSize": "10",
        "sortFiled": "ggr_desc",
        "searchAfter": f"{date_type[0]};2020101182089",
        "showModel": "1",
        "isOr": "False",
        # "__RequestVerificationToken": __RequestVerificationToken
    }
    detail_res = session.post(
        detail_url, timeout=10, verify=False, data=detail_data
    )
    if detail_res.status_code == 200:
        selector = Selector(detail_res.text)
        detail_xpath = selector.xpath('//div[@class="item"]')
        for d in detail_xpath:
            title = d.xpath('./h1/text()').extract_first("")
            print(title)

            sw_data = re.findall(r"zl_xm\(\'(.*?)\', \'(\d)\',\'(.*?)\'\)", d.xpath(".//a[contains(text(), '事务数据')]/@onclick").extract_first(""))
            if sw_data:
                parse_sw_data(sw_data)


def parse_sw_data(sw_data):
    pathname = "/Sw/SwDetail"
    proxy = get_proxies()
    session = requests.session()
    session.headers = headers
    session.proxies = proxy
    index_html = session.get("http://epub.cnipa.gov.cn/index", timeout=10, verify=False)

    api_json = requests.post("http://127.0.0.1:5699/suffix", data={
        "html": index_html.text,
        "checkPath": pathname
    }).json()
    session.cookies.update({
        "wIlwQR28aVgbT": api_json.get("cookie"),
    })

    url = 'http://epub.cnipa.gov.cn/Sw/SwDetail'
    data = {
        "an": sw_data[0][0],
        "pubType": sw_data[0][1],
        "ggr": sw_data[0][2],
    }
    res = session.post(
        url, timeout=10, verify=False, data=data
    )
    print(res.status_code)


if __name__ == '__main__':
    # parse_sw_data([('ZhCkm0FNMxGUROoY/6ognA==', '3', '', )])
    parse_index()
