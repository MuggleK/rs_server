# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/3/19 14:56
# @Author  : MuggleK
# @File    : app.py

from gevent import monkey
monkey.patch_all()


import time
import json
import logging
from flask import Flask, request
from gevent.pywsgi import WSGIServer

from codes.Rshu_4 import run as run4
from codes.Rshu_5 import run as run5
from codes.Rshu_6 import run as run6
from codes.Rshu_vmp import run as run_vmp


app = Flask(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
LOGGER = logging.getLogger(__name__)


@app.route('/')
def index():
    """
    get home page, you can define your own templates
    :return:
    """
    time.sleep(5)
    return '<h2>Welcome to RS Decrypt System</h2>'


@app.route('/rs/4', methods=['POST', 'GET'])
def rs4_serer():
    if request.method == 'POST':
        data = request.form
        proxy = data.get('proxy', None)
        if proxy:
            proxy = json.loads(proxy)
        req_url = data.get('url', None)
        ts_url = data.get('ts_url', None)
        cookie_s = data.get('s', None)
        cookie_t = data.get('t', None)
    elif request.method == 'GET':
        proxy = request.args.get("proxy")
        if proxy:
            proxy = json.loads(proxy)
        req_url = request.args.get("url")
        ts_url = request.args.get("ts_url")
        cookie_s = request.args.get("s")
        cookie_t = request.args.get("t")
    else:
        return '未支持的请求方式'
    res = {}
    if not req_url:
        msg = "Need Request Url Param!"
        code = 400
        res['msg'] = msg
        res['code'] = code
        res['data'] = None
    else:
        res = run4(req_url, ts_url, cookie_s, cookie_t, proxy)
    return res


@app.route('/rs/5', methods=['POST', 'GET'])
def rs5_serer():
    if request.method == 'POST':
        data = request.form
        proxy = data.get('proxy', None)
        if proxy:
            proxy = json.loads(proxy)
        req_url = data.get('url', None)
        ts_url = data.get('ts_url', None)
        cookie_s = data.get('s', None)
        cookie_t = data.get('t', None)
    elif request.method == 'GET':
        proxy = request.args.get("proxy")
        if proxy:
            proxy = json.loads(proxy)
        req_url = request.args.get("url")
        ts_url = request.args.get("ts_url")
        cookie_s = request.args.get("s")
        cookie_t = request.args.get("t")
    else:
        return '未支持的请求方式'
    res = {}
    if not req_url:
        msg = "Need Request Url Param!"
        code = 400
        res['msg'] = msg
        res['code'] = code
        res['data'] = None
    else:
        res = run5(req_url, ts_url, cookie_s, cookie_t, proxy)
    return res


@app.route('/rs/6', methods=['POST', 'GET'])
def rs6_serer():
    if request.method == 'POST':
        data = request.form
        proxy = data.get('proxy', None)
        if proxy:
            proxy = json.loads(proxy)
        req_url = data.get('url', None)
        ts_url = data.get('ts_url', None)
        cookie_s = data.get('s', None)
        cookie_t = data.get('t', None)
    elif request.method == 'GET':
        proxy = request.args.get("proxy")
        if proxy:
            proxy = json.loads(proxy)
        req_url = request.args.get("url")
        ts_url = request.args.get("ts_url")
        cookie_s = request.args.get("s")
        cookie_t = request.args.get("t")
    else:
        return '未支持的请求方式'
    res = {}
    if not req_url:
        msg = "Need Request Url Param!"
        code = 400
        res['msg'] = msg
        res['code'] = code
        res['data'] = None
    else:
        res = run6(req_url, ts_url, cookie_s, cookie_t, proxy)
    return res


@app.route('/rs/vmp', methods=['POST', 'GET'])
def rs_vmp_serer():
    if request.method == 'POST':
        data = request.form
        proxy = data.get('proxy', None)
        if proxy:
            proxy = json.loads(proxy)
        req_url = data.get('url', None)
        cookie_s = data.get('s', None)
        cookie_t = data.get('t', None)
    elif request.method == 'GET':
        proxy = request.args.get("proxy")
        if proxy:
            proxy = json.loads(proxy)
        req_url = request.args.get("url")
        cookie_s = request.args.get("s")
        cookie_t = request.args.get("t")
    else:
        return '未支持的请求方式'
    res = {}
    if not req_url:
        msg = "Need Request Url Param!"
        code = 400
        res['msg'] = msg
        res['code'] = code
        res['data'] = None
    else:
        res = run_vmp(req_url, cookie_s, cookie_t, proxy)
    return res


if __name__ == '__main__':
    # app.run(port=5602, host="0.0.0.0", threaded=True, debug=False)
    WSGIServer(("0.0.0.0", 5602), app).serve_forever()
