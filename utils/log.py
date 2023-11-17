# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/3/19 14:56
# @Author  : MuggleK
# @File    : log.py

import time
from loguru import logger
import os

t = time.strftime("%Y_%m_%d")
path = os.path.join(os.path.abspath(os.path.dirname(os.path.dirname(__file__))), "logs")
FORMAT = "{time:YYYY-MM-DD HH:mm:ss}|{level}| {name}:{function}:{line}| {message}"


class Logging:
    __instance = None
    logger.add(f"{path}/log_{t}_info.log", encoding="utf-8", enqueue=True, retention="1 months", level="INFO", format=FORMAT)
    logger.add(f"{path}/log_{t}_error.log", encoding="utf-8", enqueue=True, retention="10 days", level="ERROR", format=FORMAT)
    logger.add(f"{path}/log_{t}_debug.log", encoding="utf-8", enqueue=True, retention="10 days", level="DEBUG", format=FORMAT)

    def __new__(cls, *args, **kwargs):
        if not cls.__instance:
            cls.__instance = super(Logging, cls).__new__(cls, *args, **kwargs)

        return cls.__instance

    @staticmethod
    def info(msg):
        return logger.info(msg)

    @staticmethod
    def debug(msg):
        return logger.debug(msg)

    @staticmethod
    def warning(msg):
        return logger.warning(msg)

    @staticmethod
    def error(msg):
        return logger.error(msg)
