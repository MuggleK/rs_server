# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2023/5/26 20:10
# @Author  : MuggleK
# @File    : run.py
import json
import random
from urllib.parse import quote

from vmp_235.vmp_235_run import get_ck
from utils import logger
import ddddocr

ocr = ddddocr.DdddOcr(beta=True)


class Zxgk(object):

    cookie_s = 'lqWVdQzgOVyaS'
    cookie_t = 'lqWVdQzgOVyaT'
    sx_base = 'http://zxgk.court.gov.cn/shixin/'
    xg_base = 'http://zxgk.court.gov.cn/xgl/'
    zb_base = 'http://zxgk.court.gov.cn/zhongben/'

    @staticmethod
    def cap_verify(session, captcha_id, url_type):
        for _ in range(3):
            img_url = f'http://zxgk.court.gov.cn/{url_type}?captchaId={captcha_id}&random={random.random()}'
            img_res = session.get(img_url)
            if img_res.status_code != 200:
                continue
            ocr_res = ocr.classification(img_res.content)

            img_verify_url = f"http://zxgk.court.gov.cn/{url_type.split('/')[0]}/checkyzm.do?captchaId={captcha_id}&pCode={ocr_res}"
            img_verify_res = session.get(img_verify_url)
            if '1' in img_verify_res.text:
                logger.info(f"Captcha verify success -> {ocr_res}")
                return ocr_res

    def sx_search(self, keyword):
        rs_vmp = get_ck(self.sx_base, self.cookie_s, self.cookie_t)
        session = rs_vmp.session
        if not session:
            logger.warning("List initial session failed, task push into queue")
            return # TODO: 任务失败回归队列

        # 验证码识别
        captcha_id = 'KUotM7iZMtrYceH003Z8U86h1GrVtapu'
        ocr_res = self.cap_verify(session, captcha_id, 'shixin/captchaNew.do')

        search_list_url = 'http://zxgk.court.gov.cn/shixin/searchSX.do'
        search_list_data = {
            "pName": keyword,
            "pCardNum": "",
            "pProvince": "0",
            "pCode": ocr_res,
            "captchaId": captcha_id,
            "currentPage": "1"
        }
        search_list_res = session.post(search_list_url, data=search_list_data)
        if search_list_res.status_code != 200 :
            logger.error("Capcha verify failed, task push into queue")
            return

        for item in search_list_res.json()[0].get('result'):
            logger.debug(f"searching id -> {item.get('id')}")
            self.sx_detail({
                "id": item.get('id'),
                "caseCode": item.get('caseCode'),
                'cap_code': ocr_res,
                'cap_id': captcha_id,
                'rs_object': rs_vmp
            })

    def sx_detail(self, task):
        rs_object = task.get("rs_object")
        for _ in range(3):
            if not rs_object:
                rs_object = get_ck(self.sx_base, self.cookie_s, self.cookie_t)
                if not rs_object.session: return

            search_detail_url = f'http://zxgk.court.gov.cn/shixin/disDetailNew?id={task["id"]}&caseCode={quote(task["caseCode"])}&pCode={task["cap_code"]}&captchaId={task["cap_id"]}'
            req_url = rs_object.search_url(task["cap_code"], search_detail_url)
            search_res = rs_object.session.get(url=req_url, )
            if search_res.status_code != 200:
                rs_object = None
                continue

            logger.info(search_res.text)
            return search_res.text

    def zb_search(self, keyword):
        rs_vmp = get_ck(self.zb_base, self.cookie_s, self.cookie_t)
        if not rs_vmp:
            logger.warning("List initial session failed, task push into queue")
            return # TODO: 任务失败回归队列
        session = rs_vmp.session

        # 验证码识别
        captcha_id = 'db05e68d52a64029a78ed9af995e3a19'
        ocr_res = self.cap_verify(session, captcha_id, 'zhongben/captcha.do')

        search_list_url = 'http://zxgk.court.gov.cn/zhongben/search.do'
        req_url = rs_vmp.search_url("/zhongben/search.do", search_list_url, 'post')
        search_list_data = {
            "pName": keyword,
            "pCardNum": "",
            "selectCourtId": "0",
            "pCode": ocr_res,
            "captchaId": captcha_id,
            "searchCourtName": "全国法院（包含地方各级法院）",
            "selectCourtArrange": "1",
            "currentPage": "1"
        }
        search_list_res = session.post(req_url, data=search_list_data)
        if search_list_res.status_code != 200:
            print(search_list_res.status_code)
            logger.error("Capcha verify failed, task push into queue")
            return

        for item in search_list_res.json()[0].get('result'):
            logger.debug(f"searching id -> {item.get('id')}")
            self.zb_detail({
                "id": item.get('id'),
                'cap_code': ocr_res,
                'cap_id': captcha_id,
                'rs_object': rs_vmp
            })

    def zb_detail(self, task):
        rs_object = task.get("rs_object")
        for _ in range(3):
            if not rs_object:
                rs_object = get_ck(self.sx_base, self.cookie_s, self.cookie_t)
                if not rs_object: return

            search_detail_url = f'http://zxgk.court.gov.cn/zhongben/searchZbDetail?id={task["id"]}&j_captcha={task["cap_code"]}&captchaId={task["cap_id"]}'
            req_url = rs_object.search_url("/zhongben/searchZbDetail", search_detail_url)
            search_res = rs_object.session.get(url=req_url, )
            if search_res.status_code != 200:
                logger.debug("Ck 失效, 重新获取")
                rs_object = None
                continue

            logger.info(search_res.text)
            return search_res.text


if __name__ == '__main__':
    zxgk = Zxgk()
    zxgk.zb_search('李明')
