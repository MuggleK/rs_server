# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2022/3/19 14:56
# @Author  : MuggleK
# @File    : __init__.py
from os.path import dirname, abspath

from utils.log import Logging


ROOT_DIR = dirname(dirname(abspath(__file__)))
logger = Logging(f"{ROOT_DIR}/logs")
