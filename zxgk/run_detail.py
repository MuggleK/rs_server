# -*- coding: utf-8 -*-
# @Project : rs_server
# @Time    : 2023/5/26 20:10
# @Author  : MuggleK
# @File    : run.py
import random
import time
from urllib.parse import quote

import ddddocr

from utils import logger
from zxgk.vmp_235.vmp_235_run import get_ck

ocr = ddddocr.DdddOcr(beta=True)


class Zxgk(object):

    cookie_s = 'lqWVdQzgOVyaS'
    cookie_t = 'lqWVdQzgOVyaT'
    sx_base = 'http://zxgk.court.gov.cn/shixin/'    # 失信被执行人
    xg_base = 'http://zxgk.court.gov.cn/xgl/'    # 限制高消费
    zb_base = 'http://zxgk.court.gov.cn/zhongben/'  # 终本案件
    zx_base = 'http://zxgk.court.gov.cn/zhixing/'   # 执行人

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
                logger.info(f"Captcha Verify success -> {ocr_res}")
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
        req_url = rs_vmp.search_url("/shixin/searchSX.do", search_list_url, 'post')
        search_list_res = session.post(req_url, data=search_list_data)
        if search_list_res.status_code != 200:
            logger.error("List Query failed, task push into queue")
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

    def sx_detail(self, search_id):
        rs_vmp = get_ck(self.sx_base, self.cookie_s, self.cookie_t)
        session = rs_vmp.session
        if not session:
            logger.warning("List initial session failed, task push into queue")
            return  # TODO: 任务失败回归队列

        # 验证码识别
        captcha_id = 'KUotM7iZMtrYceH003Z8U86h1GrVtapu'
        cap_code = self.cap_verify(session, captcha_id, 'shixin/captchaNew.do')

        search_detail_url = f'http://zxgk.court.gov.cn/shixin/disDetailNew?id={search_id}&caseCode=&pCode={cap_code}&captchaId={captcha_id}'
        req_url = rs_vmp.search_url("/shixin/disDetailNew", search_detail_url)
        search_res = rs_vmp.session.get(url=req_url, )
        if search_res.status_code != 200:
            logger.debug("Ck 失效, 重新获取")

        logger.info(search_res.text)
        return search_res.text

    def zb_search(self, keyword):
        rs_vmp = get_ck(self.zb_base, self.cookie_s, self.cookie_t)
        if not rs_vmp:
            logger.warning("List initial session failed, task push into queue")
            return # TODO: 任务失败回归队列
        session = rs_vmp.session

        # 验证码识别
        captcha_id = 'KUotM7iZMtrYceH003Z8U86h1GrVtapu'
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
            logger.error("List Query failed, task push into queue")
            return

        for item in search_list_res.json()[0].get('result'):
            logger.debug(f"searching id -> {item.get('id')}")
            self.zb_detail({
                "id": item.get('id'),
                'cap_code': ocr_res,
                'cap_id': captcha_id,
                'rs_object': rs_vmp
            })

    def zb_detail(self, search_id):
        rs_vmp = get_ck(self.zb_base, self.cookie_s, self.cookie_t)
        if not rs_vmp:
            logger.warning("List initial session failed, task push into queue")
            return  # TODO: 任务失败回归队列
        session = rs_vmp.session

        # 验证码识别
        captcha_id = 'KUotM7iZMtrYceH003Z8U86h1GrVtapu'
        cap_code = self.cap_verify(session, captcha_id, 'zhongben/captcha.do')

        search_detail_url = f'http://zxgk.court.gov.cn/zhongben/searchZbDetail?id={search_id}&j_captcha={cap_code}&captchaId={captcha_id}'
        req_url = rs_vmp.search_url("/zhongben/searchZbDetail", search_detail_url)
        search_res = rs_vmp.session.get(url=req_url, )
        if search_res.status_code != 200:
            logger.debug("Ck 失效, 重新获取")

        logger.info(search_res.text)
        return search_res.text

    def zx_search(self, keyword):
        rs_vmp = get_ck(self.zx_base, self.cookie_s, self.cookie_t)
        if not rs_vmp:
            logger.warning("List initial session failed, task push into queue")
            return # TODO: 任务失败回归队列
        session = rs_vmp.session

        # 验证码识别
        captcha_id = 'KUotM7iZMtrYceH003Z8U86h1GrVtapu'
        ocr_res = self.cap_verify(session, captcha_id, 'zhixing/captcha.do')

        search_list_url = 'http://zxgk.court.gov.cn/zhixing/searchBzxr.do'
        req_url = rs_vmp.search_url("/zhixing/searchBzxr.do", search_list_url, 'post')
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
            logger.error("List Query failed, task push into queue")
            return

        for item in search_list_res.json()[0].get('result'):
            logger.debug(f"searching detial -> {item.get('jsonObject')}")
            self.zx_detail({
                "id": item.get('id'),
                'cap_code': ocr_res,
                'cap_id': captcha_id,
                'rs_object': rs_vmp
            })

    def zx_detail(self, search_id):
        rs_vmp = get_ck(self.zx_base, self.cookie_s, self.cookie_t)
        if not rs_vmp:
            logger.warning("List initial session failed, task push into queue")
            return  # TODO: 任务失败回归队列
        session = rs_vmp.session

        # 验证码识别
        captcha_id = 'KUotM7iZMtrYceH003Z8U86h1GrVtapu'
        cap_code = self.cap_verify(session, captcha_id, 'zhixing/captcha.do')

        search_detail_url = f'http://zxgk.court.gov.cn/zhixing/newdetail?id={search_id}&j_captcha={cap_code}&captchaId={captcha_id}&_={int(time.time() * 1000)}'
        req_url = rs_vmp.search_url("/zhixing/newdetail", search_detail_url)
        search_res = rs_vmp.session.get(url=req_url, )
        if search_res.status_code != 200:
            logger.debug("Ck 失效, 重新获取")

        logger.info(search_res.text)


if __name__ == '__main__':
    # s_id = 1600257359   # 6.8  执行人max_id:1600306640 min_id:1600257359
    # s_id = 719753748  # 6.8 失信max_id:719764952 min_id:719753748
    s_id = 19383092  # 6.8 终本案件max_id:719764952 min_id:719753748
    zxgk = Zxgk()
    zxgk.zb_detail(s_id)
