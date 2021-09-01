#每条线段表示请求一个资源的响应时间
#横轴表示时间
#纵轴表示数据量
#颜色表示服务器

#读取json文件
f1=open("./data3.json","r")
import json
j=json.load(f1)

#设置曲线颜色
colors={
    "localhost":'#00FF00',
    "101.34.166.68":'#FF0000',
    "110.40.255.87":'#FF00FF',
    "101.34.161.225":'#FFFF00',
    "81.71.38.168":'#0000FF',
    }
for i in j:
    i["color"]=colors[ i["ip"] ]
#9400D3

#设置曲线的绘制风格linestyle
for i in j:
    path=i["path"]
    if len(path.split(".jpg"))>1:
        i["linestyle"]=":"
    else:
        i["linestyle"]="-"

#读取文件大小
import os
for i in j:
    path="../"+i["path"]
    i["fileSize"]=os.stat(path).st_size

def sort0(obj,key):
    for i1 in range(len(obj)):
        i1=len(obj)-i1-1
        max=i1
        for i2 in range(i1):
            if obj[i2][key]>obj[max][key]:
                max=i2
        temp=obj[max]
        obj[max]=obj[i1]
        obj[i1]=temp
    return obj
#按照请求的发起时间进行排序
j=sort0(j,"time0")

import matplotlib.pyplot as plt
#1.绘制响应事件
plt.subplot(121)
k=0
for i in j:
    x=[]
    y=[]
    k=k+(5+i["fileSize"]/200000)
    x.append(i["time0"])
    y.append(k)
    x.append(i["time1"])
    y.append(k)
    plt.plot(x, y, color=i["color"],linestyle=i["linestyle"])
plt.xlabel("time")
plt.ylabel("data volume")
plt.title('Response Event')

#按照响应时间排序
j=sort0(j,"time1")

#2.绘制资源加载图
plt.subplot(122)
k=0
x=[]
y=[]
y_pre=0
for i in j:
    k=k+(5+i["fileSize"]/200000)
    x.append(i["time1"])
    y.append(y_pre)
    x.append(i["time1"])
    y.append(k)
    y_pre=k
plt.plot(x, y)
plt.xlabel("time")
plt.ylabel("data volume")
plt.title('Resource Loading')
plt.show()

#统计资源个数和平均加载时间
timeAll=0
fileCount=0
for i in j:
    fileCount=fileCount+1
    timeAll=timeAll+(i["time1"]-i["time0"])
print("资源个数:",fileCount)
print("平均时延:",timeAll/fileCount)
