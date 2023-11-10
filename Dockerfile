FROM python:3.7.3

ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

RUN ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN dpkg-reconfigure -f noninteractive tzdata
RUN mkdir -p /data/logs


WORKDIR /usr/spider
COPY . /usr/spider
RUN pip install --upgrade pip -i https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple &&\
    wget https://nodejs.org/dist/v16.20.0/node-v16.20.0-linux-x64.tar.xz &&\
    tar xf node-v16.20.0-linux-x64.tar.xz -C /opt/
ENV PATH=$PATH:/opt/node-v16.20.0-linux-x64/bin

RUN npm install

ENV PYTHONPATH=/usr/spider