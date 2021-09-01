#每条线段表示请求一个资源的响应时间
#横轴表示时间
#纵轴表示数据量
#颜色表示服务器

#读取json文件
print("找出多加载的那个资源")
f0=open("./data0.json","r")
f1=open("./data1.json","r")
import json
j0=json.load(f0)
j1=json.load(f1)
for i1 in j1:
    flag=0
    for i0 in j0:
        if i0["path"]==i1["path"]:
            flag=flag+1
    if flag==0:
        print(i1["path"])

print("找出重复加载的资源：")
f1=open("./data0.json","r")
import json
#j0=json.load(f0)
j1=json.load(f1)
for i0 in range(len(j1)):
    for i1 in range(len(j1)):
        if j1[i0]["path"]==j1[i1]["path"] and not i0==i1:
                print(j1[i0]["path"],i0,i1)
