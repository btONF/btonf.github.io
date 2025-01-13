## 1. 前置条件 - 对频


``` mermaid
stateDiagram-v2
	A:无人机
    [*] --> A 
    state A {
        [*] --> 切换单控/多控
        切换单控/多控 --> 长按进入对频状态
        长按进入对频状态 -->  [*]
    }

    [*] --> RC
    RC: 遥控器组
    state RC {
        [*] --> RC1
        RC1 --> 开启对频
        [*] --> RC2
        RC2 --> 开启对频
        [*] --> RC3
        RC3 --> 开启对频
        开启对频 --> [*]
    }
	A --> 对频成功
	RC --> 对频成功
	对频成功 --> 建立连接
	state 建立连接 {
		direction LR
		RC[1] --> 无人机
		RC[2] --> 无人机
		RC[3] --> 无人机
	}

```
## 2. 无人机 Broker 登录信息的发现

客户端（RC / 移动设备）与无人机的交互通过 MQTT 协议进行，但是因为考虑到不同场景下（植保 / 物流），无人机的 IP 是可变的，为了连接的健壮与可扩展性，连接的参数需要通过广播的方式发送给客户端

### 2.1 UDP 广播

发送方（无人机）在启动完成自己的 Broker 服务后，通过 UDP 的方式持续广播自己的相关信息

- Broker 的地址
- 端口
- 用户名/密码

``` java
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UdpSender {
    public static void broadcastIp(int port, long intervalMillis) {
        try (DatagramSocket socket = new DatagramSocket()) {
            socket.setBroadcast(true); // 启用广播模式
            String localIp = InetAddress.getLocalHost().getHostAddress();

            while (true) {
                String message = "Device IP: " + localIp;
                byte[] buffer = message.getBytes();

                // 广播地址，假设网段是 192.168.1.0/24
                InetAddress broadcastAddress = InetAddress.getByName("192.168.1.255");

                // 创建广播数据包
                DatagramPacket packet = new DatagramPacket(buffer, buffer.length, broadcastAddress, port);

                // 发送广播数据包
                socket.send(packet);
                System.out.println("Broadcast sent: " + message);

                // 等待指定时间间隔
                Thread.sleep(intervalMillis);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### 2.2 客户端接收
在该环节，客户端有以下相关角色

- 对频模块
	- 触发对频功能，加入无人机内部网络
	- 提供对频状态监听服务
- UDP 监听模块
	- 监听 UDP 广播，接收 MQTT 连接信息
	- 依赖于`对频模块`的连接
	- MQTT 连接成功后停止监听
- 连接信息存储模块
	- 存储上次对频后，MQTT 连接成功的数据
	- 省去 MQTT 连接前的步骤
	- 清空/修改数据的时机应当在触发对频操作后及 MQTT 校验失败时
- MQTT 模块
	- MQTT 服务核心模块，当前环节仅暴露以下接口
		- 携带连接参数的连接请求
		- 连接状态监听
#### 2.2.1 状态图

```mermaid
stateDiagram-v2
    [*] --> 对频模块: 启动
    对频模块 --> UDP监听模块: 加入网络成功
    对频模块 --> 对频模块: 加入网络失败，重试
    UDP监听模块 --> 连接信息存储模块: 接收到连接信息
    UDP监听模块 --> UDP监听模块: 无有效信息，继续监听
    连接信息存储模块 --> MQTT连接模块: 信息存储完成
    对频模块 --> UDP监听模块: 对频成功，清空之前的数据
    对频模块 --> MQTT连接模块: 对频成功，尝试连接存储的MQTT信息
    MQTT连接模块 --> 连接成功: 连接成功
    MQTT连接模块 --> UDP监听模块: 连接失败，错误检查
    UDP监听模块 --> 连接信息存储模块: 验证失败，重新获取连接信息
    MQTT连接模块 --> MQTT连接模块: 其他错误，重试连接
    连接成功 --> [*]: 系统运行中

```
#### 2.2.2 时序图

```mermaid
sequenceDiagram
    participant 主设备 as 对频服务
    participant UDP监听模块 as UDP监听服务
    participant 连接信息存储模块 as 连接信息存储服务
    participant MQTT连接模块 as MQTT服务
    主设备->>UDP监听模块: 启动并加入网络
    alt 对频成功
        主设备->>UDP监听模块: 清空之前接收到的UDP数据
        主设备->>连接信息存储模块: 检查是否有存储的连接信息
        alt 存储连接信息
            主设备->>MQTT连接模块: 使用存储的信息尝试连接MQTT
            alt 连接成功
                MQTT连接模块->>主设备: 返回连接成功
                主设备->>主设备: 系统运行中
            else 连接失败
                MQTT连接模块->>主设备: 返回错误信息
                主设备->>MQTT连接模块: 错误检查
                alt 是认证失败
                    MQTT连接模块->>UDP监听模块: 返回认证失败，重新获取连接信息
                    UDP监听模块->>连接信息存储模块: 获取新的连接信息
                else
                    MQTT连接模块->>主设备: 返回其他错误，重试连接
                    主设备->>MQTT连接模块: 重试连接
                end
            end
        else 无存储连接信息
            主设备->>UDP监听模块: 继续监听UDP，获取新的连接信息
        end
    else 对频失败
        主设备->>主设备: 重试对频模块
    end

```
## 3. 无人机 Broker 的登录

### 3.1 无人机的自连接

无人机的 Broker 服务架设在自己内部，且自己作为默认授权的设备"优先"连接
这里优先的含义是，在 `无人机 Broker` 服务提供给外部连接前，应当确保 `无人机 Broker` 启动完成，并且自己的客户端（数据发布源）已经成功连接。

## 无人机关键信息获取

## 建立云端连接

## 设备权限分配

## 设备的互相发现及状态更新