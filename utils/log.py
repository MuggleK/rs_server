# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/3/19 14:56
# @Author  : Changchuan.Pei
# @File    : log.py

import time
from loguru import logger
import os

t = time.strftime("%Y_%m_%d")
path = os.path.join(os.path.abspath(os.path.dirname(os.path.dirname(__file__))), "logs")


class Logging:
    __instance = None
    logger.add(f"{path}/log_{t}_info.log", encoding="utf-8", enqueue=True, retention="1 months", level="INFO", format="{time:YYYY-MM-DD HH:mm:ss}|{level}| {name}:{function}:{line}| {message}")
    logger.add(f"{path}/log_{t}_error.log", encoding="utf-8", enqueue=True, retention="10 days", level="ERROR", format="{time:YYYY-MM-DD HH:mm:ss}|{level}| {name}:{function}:{line}| {message}")
    logger.add(f"{path}/log_{t}_debug.log", encoding="utf-8", enqueue=True, retention="10 days", level="DEBUG", format="{time:YYYY-MM-DD HH:mm:ss}|{level}| {name}:{function}:{line}| {message}")

    def __new__(cls, *args, **kwargs):
        if not cls.__instance:
            cls.__instance = super(Logging, cls).__new__(cls, *args, **kwargs)

        return cls.__instance

    def info(self, msg):
        return logger.info(msg)

    def debug(self, msg):
        return logger.debug(msg)

    def warning(self, msg):
        return logger.warning(msg)

    def error(self, msg):
        return logger.error(msg)
