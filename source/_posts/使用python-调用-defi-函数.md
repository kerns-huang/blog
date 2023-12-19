---
title: 使用python 调用 defi 函数
author: kerns
abbrlink: 32391
date: 2021-09-17 05:30:11
tags:
---
## 安装 web3 py

```
pip install web3

```

## 连接节点的最常用方法是

```
1.IPC（使用本地文件系统：最快，最安全）
2.Websockets（远程工作，比 HTTP 更快,但一般只有私人节点开发）
3.HTTP（更多节点支持它）

```
具体的参考资料网上很多


## 合约调用代码demo

```
"""
swap 合约  新币抢链机器人
"""
import json
import requests
from web3 import Web3

import time


def getAbi(contract_address):
    """
    :param contract_address: 合约地址
    """
    url_scan = "https://api.bscscan.com/api?module=contract&action=getabi&address=" + str(contract_address)
    r = requests.get(url=url_scan)
    response = r.json()
    abi = json.loads(response["result"])
    return abi


# 交换虚拟货币
def swap():
    contract_address = web3.toChecksumAddress(router_contract_address)
    contract = web3.eth.contract(address=contract_address,
                                 abi=contract_abi)
    # 交易对
    pair = [token_in, token_out]
    amounts = contract.functions.getAmountsOut(amount_in, pair).call()
    amount_out_min = amounts[1] * (1 - slippage)
    if amount_out_min < min_buy_token_amount:
        print("目前能买到的币数量为: {0},最小购买的币数量为: {1},已经小于最小购买数量".format(amount_out_min, min_buy_token_amount))
        return
    # 开始交易
    txn = contract.functions.swapExactTokensForTokens(
        amount_in,
        amount_out_min,
        pair,
        # 接收人的币种地址
        address,
        (int(time.time()) + 10000)
    ).buildTransaction({
        'chainId': 56,
        'from': address,
        # 手续费根据需要加大
        'gas': gas,
        'gasPrice': web3.eth.gasPrice,
        'nonce': nonce,
    })
    signed_txn = web3.eth.account.sign_transaction(txn, private_key=private_key)
    tx_token = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
    print("swap token tx is {0}".format(web3.toHex(tx_token)))


if __name__ == '__main__':
    # 币安的写成币安的地址
    url = "https://bsc-dataseed1.binance.org"
    web3 = Web3(Web3.HTTPProvider(url))
    # pancake 智能合约
    router_contract_address = "0x10ED43C718714eb63d5aA57B78B54704E256024E"
    # 钱包私钥信息
    private_key = ""
    # 钱包地址
    address = web3.toChecksumAddress("")
    # 发送的币种信息
    send_token_address = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
    # 交易的币种信息
    buy_token_address = "0xfbb4f2f342c6daab63ab85b0226716c4d1e26f36"
    # 交易的币数量
    send_token_amount = 0.3
    # 最小买入金额
    min_buy_token_amount = 2000
    # 燃烧的gas 费
    gas = 7000000
    # 间隔时间
    split_second = 5
    # 滑点 0.5 = 50%
    slippage = 0.5

    amount_in = Web3.toWei(send_token_amount, 'ether')
    token_in = Web3.toChecksumAddress(send_token_address)
    token_out = Web3.toChecksumAddress(buy_token_address)
    nonce = web3.eth.getTransactionCount(address)
    while True:
        try:
            swap()
            nonce = nonce + 1
        except ValueError as e:
            print("swap error {0}".format(e))
        time.sleep(split_second)
```




