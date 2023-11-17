# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/3/19 14:56
# @Author  : MuggleK
# @File    : tools.py

import ctypes
import time
from functools import wraps
from traceback import format_exc

from utils import logger


def int_overflow(val):
    maxint = 2147483647
    if not -maxint - 1 <= val <= maxint:
        val = (val + (maxint + 1)) % (2 * (maxint + 1)) - maxint - 1
    return val


def right_shift(n, i):
    # 无符号位运算
    if n < 0:
        n = ctypes.c_uint32(n).value
    if i < 0:
        return -int_overflow(n << abs(i))
    if i != 0:
        return int_overflow(n >> i)
    else:
        return n


def retry_with_reset_and_error_return(retries=3, delay=0.5, reset_arg='proxy', error_response=None):
    if error_response is None:
        error_response = {
            'msg': 'Max Retries Had Happened',
            'code': 500,
            'data': {'html': None}
        }

    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            nonlocal retries, delay
            for attempt in range(retries):
                try:
                    if reset_arg in kwargs:
                        kwargs[reset_arg] = None
                    return await func(*args, **kwargs)
                except:
                    logger.error(format_exc(limit=3))
                    if attempt == retries - 1:
                        return error_response
                    time.sleep(delay)
        return wrapper
    return decorator
