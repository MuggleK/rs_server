# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/3/19 14:56
# @Author  : MuggleK
# @File    : app.py
import functools
import json as s_json
import time

from sanic import Sanic, json

from codes.Rshu_5 import Rshu5
from codes.Rshu_vmp import RshuVmp
from utils import logger

app = Sanic("RsServer")


# Define the timing decorator
def with_timing():
    def decorator(f):
        @functools.wraps(f)
        async def decorated_function(request, *args, **kwargs):
            start_time = time.time()
            try:
                response = await f(request, *args, **kwargs)
                return response
            finally:
                end_time = time.time()
                duration = end_time - start_time
                logger.info(f"Endpoint '{request.endpoint}' executed in {duration:.4f} seconds")
        return decorated_function
    return decorator


@app.route("/rs/5", name="rs_5_verify", methods=["POST"])
@with_timing()
async def rs5_verify(request):
    proxy = request.form.get("proxy")
    if proxy:
        proxy = s_json.loads(proxy)
    req_url = request.form.get("url")
    cookie_s = request.form.get("s")
    cookie_t = request.form.get("t")
    headers = request.form.get("headers")
    if headers:
        headers = s_json.loads(headers)
    if not (req_url and cookie_s and cookie_t):
        return json({"msg": "need url,cookie_s,cookie_t param!", "code": 400, "data": None})

    spider = Rshu5(req_url, cookie_s, cookie_t, headers)
    res = await spider.run(proxy)
    return json(res)


@app.route("/rs/vmp", name="rs_vmp_verify", methods=["POST"])
@with_timing()
async def vmp_verify(request):
    proxy = request.form.get("proxy")
    if proxy:
        proxy = s_json.loads(proxy)
    req_url = request.form.get("url")
    cookie_s = request.form.get("s")
    cookie_t = request.form.get("t")
    headers = request.form.get("headers")
    if headers:
        headers = s_json.loads(headers)
    if not (req_url and cookie_s and cookie_t):
        return json({"msg": "need url,cookie_s,cookie_t param!", "code": 400, "data": None})

    spider = RshuVmp(req_url, cookie_s, cookie_t, headers)
    res = await spider.run(proxy)
    return json(res)


if __name__ == '__main__':
    app.run(port=5602, host='0.0.0.0', auto_reload=True, workers=4, backlog=2000, access_log=True)
