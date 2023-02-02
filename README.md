# rs_server
![](https://img.shields.io/badge/python-3.7.3-brightgreen)

针对瑞数4，5，6，vmp版本，Python结合JS补环境逆向破解

---

Python环境启动接口

```shell
pip install -r requirements.txt

python3 app.py
```

直接拉取docker镜像

```shell
docker pull mugglek/rs_server:lastest

docker run -d -p 5602:5602 --name rs_server mugglek/rs_server
```

使用Docker构建接口服务镜像&容器

```shell
git clone https://github.com/MuggleK/rs_server.git

docker-compose build

docker-compose up -d
```