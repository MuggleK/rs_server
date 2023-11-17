FROM python:3.7.3

ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

RUN ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN dpkg-reconfigure -f noninteractive tzdata
RUN mkdir -p /data/logs


WORKDIR /usr/src/app
COPY . /usr/src/app
RUN pip install -U pip -i https://pypi.douban.com/simple/
RUN pip install -r requirements.txt -i https://pypi.douban.com/simple/ &&\
    wget https://nodejs.org/dist/v14.15.4/node-v14.15.4-linux-x64.tar.xz &&\
    tar xf node-v14.15.4-linux-x64.tar.xz -C /opt/
ENV PATH=$PATH:/opt/node-v14.15.4-linux-x64/bin

ENV PYTHONPATH=/usr/src/app