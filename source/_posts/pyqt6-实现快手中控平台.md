title: pyqt6 实现快手中控平台
author: kerns
abbrlink: 63055
date: 2024-07-03 14:45:21
tags:
---
# 需求

	1.快手所有的消息汇集到中控平台。
    2.新消息过来需要有声音提示
    3.需要实现类似微信那样点击用户名，回复该用户的功能。
    4.消息框输入消息，按Enter键发送消息的功能。
    
# 需要代码实现

## 快手所有消息汇集到中控平台

通过socket把快手的消息转发给中控，通过 pyqtSignal 转发给gui页面

server_socket.py
```
class Server:

    def __init__(self, host, port):
        self.data = '' # 需要发送的消息
        self.host = host
        self.port = port
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.outputs = []  # 流出
        self.inputs = []  # 流入
        self.msg_queue = {}  # 这个字典用来存放不同连接的消息队列
        self.online_conversition = {}  # 在线用户名列表
        self.sock.bind((self.host, self.port))  # 套接字绑定到指定地址
        self.inputs.append(self.sock)  # 将sock加入传入列表，可以监控连接请求


    def add_conn(self,conn):
            self.inputs.append(conn)
            self.outputs.append(conn)
            self.msg_queue[conn] = queue.Queue()  # 新建conn和消息队列的键值对

    # 根据待发送消息的类型做不同处理
    def send_message(self,conversition:str,data:dict):
        # 发送消息给对应的地址
         # 发送消息给对应的地址
        sock=  self.get_client(conversition=conversition)
        if sock is None:
            return False
        msg=json.dumps(data)
        self.msg_queue[sock].put(msg.encode("utf-8"))
        return True


    def get_client(self,conversition:str):
        # 遍历所有的连接，获取所有的客户端
        for key, val in self.online_conversition.items():
            if "conversition" in val and val['conversition'] == conversition:
                return key
        return None        


```

server_thread.py

```
class ServerThread(QThread):

    message_signal = pyqtSignal(dict)

    def __init__(self, sockServer:Server):
        super().__init__()
        self.sockServer = sockServer
         # 定义字典型的signal，用于发送同步用户消息

   


    def handle_message(self,data,sock):
        message=json.loads(data)
        
        if "type" in message and message['type'] == "heatbeat":
                """
                监测消息是否是心跳消息，是心跳则更信息信息
                {"conversition": "测试直播-12313",type:"heatbeat"}
                """
                self.sockServer.online_conversition[sock]={"last_heatbeat":time.time(),"conversition":message['conversition']}
        elif "type" in message and message['type'] == "message":
                """
                解析数据，并把数据放在一个日志文件里面。
                    {"conversition": "测试直播-12313","from":"李四","content": "12312312",time:12332423411,"type":"message"}
                    {"conversition": "\u4eac\u4e1c\u5bb6\u7535\u6e05\u6d17\u7279\u60e0\u4e13\u573a-12480794987", "from": "\uff20\u996d\u5c0f\u8431\uff08\u4eac\u4e1c\u5bb6\u7535\u6e05\u6d17\uff09", "content": "\u6709\u4ec0\u4e48\u95ee\u9898\u53ef\u4ee5\u6253\u5728\u516c\u5c4f\u4e0a\u54e6", "time": 1718693761524, "type": "message"}
                """
                self.sockServer.online_conversition[sock]={"last_heatbeat":time.time(),"conversition":message['conversition']}
                self.message_signal.emit(message) # 重置gui主线程有新的消息

    # 监听请求
    def listening(self):
        self.sockServer.sock.listen(100)  # 可以挂起的最大连接数
        print('Server start at: %s:%s' % (self.sockServer.host, self.sockServer.port))
        print('wait for connection...')
        while True:
            readable, writable, exceptional = select.select(self.sockServer.inputs, self.sockServer.outputs, self.sockServer.inputs)
            for r in readable:
                if r is self.sockServer.sock: 
                    # 表明有传入请求
                    conn, addr = self.sockServer.sock.accept()
                    print('Connected by ', addr)
                    self.sockServer.add_conn(conn=conn)
                else:
                    # 表示是已有的连接有传入数据
                    body=''
                    try:
                        l= r.recv(4)
                        body_length=struct.unpack('i',l)[0] # 读取报文的长度
                        body=r.recv(body_length)
                    except:
                        pass
                    if body:
                        # 如果接收到数据
                        self.handle_message(body, r)
                        body = ''  # 清空data
                    else:
                        # 连接已断开
                        print("connection closed from ", r.getpeername())
                        if r in self.sockServer.outputs:
                            # 就不再给它发消息了，移除outputs
                            self.sockServer.outputs.remove(r)
                            self.sockServer.inputs.remove(r)  # 从连接列表中也移去

                        # 从在线用户中移除
                        try:
                            del  self.sockServer.msg_queue[r]
                            del  self.sockServer.online_conversition[r]  # 删除对应的在线用户信息
                        except:
                            pass
                        r.close()  # 关闭该连接

            for w in writable:
                if w in self.sockServer.msg_queue.keys() and not self.sockServer.msg_queue[w].empty():
                    data = self.sockServer.msg_queue[w].get(False)
                    w.send(data)    

    # 覆盖Qthread的run方法，进行接收和发送信息的工作
    def run(self):
       self.listening()

```



## 新消息过来需要有声音提示

	```python
       effect = QtMultimedia.QSoundEffect() #短声音组件，
       effect.setSource(QUrl.fromLocalFile(f{app_path()}/voice/receive.wav")) # 声音文件，目前只支持wav格式，mp3有问题
       effect.setVolume(1) # 设置音量
       effect.play() # 播放声音
    
    ```
    
## 实现微信那样的汽泡

### 一种基于小懵白小趣谈的画笔画图实现

但操作起来太过复杂，而且后面的代码也开始收费了，所以以另外一种方法实现，只是看代码还算有意思，就记录了一下，并不符合需求。

```python

window_height = 10
begin_width_spacing = 20
begin_height_spacing = 16
icon_width = 40
icon_height = 40
text_width_spacing = 12
text_height_spacing = 12
triangle_width = 6
triangle_height = 10
triangle_height_spacing = 10
text_min_width = 0
min_width = 0
text_max_width = 0
real_width = 0
text_height = 0

class MessageItemWidget(QWidget):

    def __init__(self,parent=None,fromUser="",content=""):
        super(MessageItemWidget,self).__init__(parent=parent)
        self.content=content


        # 重写paintEvent 否则不能使用样式表定义外观
    def paintEvent(self, event):
        self.init_data() # 获取文本长度、气泡框架问题
        global text_min_width, min_width, text_max_width, real_width, text_height, window_height
        # 初始化QPainter对象，一支画笔
        painter = QtGui.QPainter(self)
        painter.setRenderHints(QtGui.QPainter.Antialiasing | QtGui.QPainter.SmoothPixmapTransform)
        font = QtGui.QFont()
        font.setFamily("实体")
        font.setPointSize(12)
        painter.setFont(font)
   
        # 画框架
        bubbleRect = QRect(begin_width_spacing + icon_width, begin_height_spacing,
                           triangle_width + text_width_spacing + text_max_width + text_width_spacing,
                           text_height_spacing + text_height + text_height_spacing)
        painter.setPen(Qt.NoPen)
        painter.setBrush(QtGui.QBrush(QtGui.QColor(180, 180, 180)))
        painter.drawRoundedRect(bubbleRect.x() + triangle_width, bubbleRect.y(), bubbleRect.width() - triangle_width,
                                bubbleRect.height(), 18, 18)
        # 实现颜色渐变                        
        linearGradient = QtGui.QLinearGradient(QPointF(bubbleRect.x() + triangle_width + 1, bubbleRect.y() + 1),
                                         QPointF(bubbleRect.x() + bubbleRect.width() - 1,
                                                 bubbleRect.y() + bubbleRect.height() - 1))
        linearGradient.setColorAt(0, QtGui.QColor(151, 220, 227))
        linearGradient.setColorAt(0.25, QtGui.QColor(151, 220, 227))
        linearGradient.setColorAt(0.5, QtGui.QColor(151, 220, 227))
        linearGradient.setColorAt(0.75, QtGui.QColor(151, 220, 227))
        linearGradient.setColorAt(1, QtGui.QColor(151, 220, 227))
        painter.setBrush(linearGradient)
        # 画圆
        painter.drawRoundedRect(bubbleRect.x() + triangle_width + 1, bubbleRect.y() + 1,
                                bubbleRect.width() - triangle_width - 2, bubbleRect.height() - 2, 18, 18)
        painter.setPen(QtGui.QPen(QtGui.QColor(244, 164, 96)))
        painter.drawPolygon(QPointF(bubbleRect.x(), bubbleRect.y() + triangle_height_spacing - 4),
                            QPointF(bubbleRect.x() + triangle_width + 1, bubbleRect.y() + triangle_height_spacing),
                            QPointF(bubbleRect.x() + 6 + 1, bubbleRect.y() + 10 + 10))

        painter.setPen(QtGui.QPen(QtGui.QColor(180, 180, 180)))
        painter.drawLine(QPointF(bubbleRect.x(), bubbleRect.y() + 10 - 4),
                         QPointF(bubbleRect.x() + 6, bubbleRect.y() + 10))
        painter.drawLine(QPointF(bubbleRect.x(), bubbleRect.y() + 10 - 4),
                         QPointF(bubbleRect.x() + 6, bubbleRect.y() + 10 + 10))
        # 画文字
        penText = QtGui.QPen()
        penText.setColor(QtGui.QColor(56, 56, 56))
        painter.setPen(penText)
        option = QtGui.QTextOption(Qt.AlignmentFlag.AlignLeft | Qt.AlignmentFlag.AlignVCenter)
        option.setWrapMode(QtGui.QTextOption.WrapMode.WrapAtWordBoundaryOrAnywhere)
        painter.drawText(
            QRectF(bubbleRect.x() + triangle_width + text_width_spacing, bubbleRect.y() + text_height_spacing,
                   text_max_width, text_height), self.content, option)          
        
    def init_data(self):
        font = QtGui.QFont()
        font.setFamily("实体")
        font.setPointSize(12)
        metrics = QtGui.QFontMetrics(font)
        global text_min_width, min_width,text_max_width,real_width, text_height, window_height
        if metrics.horizontalAdvance("A") * 2 + begin_height_spacing * 1.5 > text_width_spacing:
            text_min_width = begin_height_spacing * 1.5 - text_width_spacing
        else:
            text_min_width = 0
        min_width = begin_width_spacing + icon_width + triangle_width + text_width_spacing + text_width_spacing + icon_width + begin_width_spacing
        if self.width()< min_width+text_min_width:
            self.setMinimumWidth(min_width + text_min_width)
        text_max_width = self.width() - min_width
        real_width = metrics.width(self.content)
        if real_width < text_max_width:
            text_max_width = real_width
            if text_height_spacing+metrics.height()+text_height_spacing>triangle_height_spacing+triangle_height+triangle_height_spacing:
                text_height = metrics.height()
            else:
                text_height = triangle_height_spacing + triangle_height + triangle_height_spacing
        else:
            flag = Qt.TextFlag.TextWordWrap
            textRect = QRect(0, 0, text_max_width, 0)
                        # 自动换行
            textRect = metrics.boundingRect(textRect, flag, self.content)
            text_height = textRect.height()

```

#### 实现的效果


![upload successful](/images/pasted-19.png)







## 消息框输入消息，按Enter键发送消息的功能


## 参考资料

https://github.com/pyqt/examples