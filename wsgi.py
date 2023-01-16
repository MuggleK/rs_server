# -*- coding: utf-8 -*-
# @Project : flaskProject
# @Time    : 2022/6/23 10:42
# @Author  : MuggleK
# @File    : wsgi.py

from app import app
import logging

gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
