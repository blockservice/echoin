# Echoin 验证人节点计划

### 1. echoin 全球BP节点（block producer）数量
根据全球主要消耗能源类型：石油、天然气、煤炭、水能、核能、太阳能、风能、潮汐能； 再根据拜占庭容错共识要求3X+1，一共25个BP节点，
目前规定设置备用BP节点6个，以防意外发生。BP节点也称为验证人节点。

### 2. 如何成为备用验证人
全网BP节点有25个验证人，6个备用验证人；按照质押token的多少排序，质押token最多的前25位是验证人节点，从26～31位，自动成为备用验证人。

### 3. 区块奖励
验证人以及权益投票人共获得总区块奖励的90%，备用验证人以及权益投票人共获得10%. 相对验证人来说，备用验证人及其权益投票人获得的区块奖励较低，是因为备用验证人承担的削减风险较低

### 4. 权益投票是否可以交易
处于投票状态的token是锁定，不能交易的，如果投票人不想再继续投，想把token拿出去流通，需要先解除投票权益，然后等待7天(为了防止“长距离双花攻击”)，token会解锁到账

### 5. 最低自我投票比例
验证人自我投票的数量必须达到或者超过其所有投票数量的10%，这是为了将投票人和验证人作为一体进行奖惩机制。

### 6. BP节点作恶惩罚措施：
如果BP节点（验证人）有不当行为或者挖矿产生出不同的结果，系统会每秒燃烧投票人和验证人所投token总量的0.1%，连续削减12次后，移除验证人，排名第26位的备选验证节点会荣升正式的验证节点。 在这个过程中，投票人和验证人最多会损失所投数量的1.2%，被移除后双方都不再获得区块奖励。

### 7. 质押限额，及其条件限制
**最小质押限额：**默认生成的配置文件中最小质押数量是1000，这个数字可以通过调整代码中参数修改；

**质押投票不是越多越好：**
echoin 会限制任何一个验证人发展过大，如果单个验证人权益投票比例超过网络总权益投票的12%，该验证人可能会导致网络不稳定。因此，当网络分配区块奖励时，超过12%限额的权益投票不会获得区块奖励。举个栗子：每个验证人上限为12%，如果验证人拥有5%的全部投票量，则他获得5%的投票权，如果验证人B拥有20%的投票量，他也只有12%的投票权。

### 8.质押，解除质押的操作步骤：
**委托人(delegator)的操作：**
*质押：*
普通用户要想成为一个委托人，必须要向验证人质押一定数量的ECHO币（也就是权益投票），向验证人质押ECHO币，必须通过ECHOIN硬件钱包的签名。钱包生成签名的过程如下：
```
var crypto = require("crypto")
// this private key is for testing only, use it together with cubeBatch "01"
var privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQCiWpvDnwYFTqgSWPlA3VO8u+Yv9r8QGlRaYZFszUZEXUQxquGl
FexMSVyFeqYjIokfPOEHHx2voqWgi3FKKlp6dkxwApP3T22y7Epqvtr+EfNybRta
15snccZy47dY4UcmYxbGWFTaL66tz22pCAbjFrxY3IxaPPIjDX+FiXdJWwIDAQAB
AoGAOc63XYz20Nbz4yyI+36S/UWOLY/W8f3eARxycmIY3eizilfE5koLDBKm/ePw
2dvHJTdBDI8Yu9vWy3Y7DWRNOHJKdcc1gGCR36cJFc4/h02zdaK+CK4eAaZLXhdK
H8DljEx6QAeRtxVLZGeYa4actY+3GeujYvkQ5QwNprchTSECQQDO4VMmLB+iIT/N
jnADYOuWKe3iLBoTKHmVfAaTRMMeHATMkpgyVzTLO7jMYCWy7+S0DL4wDNUTQv+P
Nna/hrAxAkEAyObfMAgjnW6s+CGoN+yWtdBC0LvDXDrzaT3KqmHxK2iCg2kQ9R6P
0vCvGJytuPxmIVZn54+KpKfR6ok6RJSbSwJAF+CRxDobfI7x2juyWfF5v18fgZct
e0CUp9gkuiKZkoQRWbshrc263ioKbiw6rahacR13ZfxVK1/0NwdGNVzKQQJBAJpw
QGpgF2DSz8z/sp0rFsA1lOd5L7ka6Dui8MUB/a9s68exYQPNtqpls3SsHS/zd19x
WPa9dcsV51zwmQZXZvkCQQChnQLBs6BbH6O85ePXSSbe7RUvHua6EEkmCNkIw+vT
3Jqmk4ecxCzmEv3xbzrCdgOhfjxqjrsqLLK6BH+lJsWS
-----END RSA PRIVATE KEY-----`
var address = "0x38d7b32e7b5056b297baf1a1e950abbaa19ce949"
var nonce = 5
var message = address + "|" + nonce
var hash = crypto.createHash("sha256").update(message).digest("hex")
let signature = crypto.privateDecrypt(
  {
    key: privateKey,
    padding: crypto.constants.RSA_NO_PADDING
  },
  new Buffer(hash, "hex")
)
var signature_hex = signature.toString("hex")
console.log(signature_hex)
//输出签名
036b6dddefdb1d798a9847121dde8c38713721869a24c77abe2249534f6d98622727720994f663ee9cc446c6e246781caa3a88b7bff78a4ffc9de7c7eded00caef61c2ea36be6a0763ed2bf5af4cf38e38bd6b257857f314c4bbb902d83c8b4413ba2f880d24bf0d6874e392807dfbc2bd03910c58989bc69a9090eddefe8e55
```
然后通过web3或者console界面执行如下命令：
>**web3.ec.stake.delegator.accept(delegateObject)**
>
delegateObject 包含如下必要参数：
from: 需要质押资产的账户地址 string 类型；
validatorAddress: 验证人账户地址；
amount： 质押的ECHO币数量
cubeBatch: ecohin 硬件钱包的批号
sig: 这里填充上面获取的硬件钱包的签名

执行完上述步骤，一个普通用户就可以成为一个委托人，并获得相关收益。

*取消质押：*
委托人收回资金可执行命令：
>**web3.ec.stake.delegator.withdraw(withdrawObject)**
>
withdrawObject 包含参数如下：
from: 委托人账户地址；
validatorAddress: 验证人地址
amount: 提取金额

执行完提取命令后，质押的资金7天后会自动发送到原委托人账户中

**BP/backup BP节点：**
*质押：*
一个普通账户想成为验证人节点，需要先通过declare命令成为一个candidate：
> **web3.ec.stake.validator.declare(DeclareObject)**

> DeclareObject参数包含参数如下：
from: 质押账户的地址
pubKey: 出块节点的公钥
maxAmount: 质押的金额
comRate:  验证人收取的出块奖励比率；

执行完该命令后，节点就会变成候选节点。当质押的金额在网络中排名到前25位，同时又获得了网络中其他用户的权益投票，该节点就会从候选节点成为验证人节点。

如果declare命令执行后，需要修改参数，可以执行命令
> **web3.ec.stake.validator.update()**

这个命令可以重新设置质押的资产数目，调整委托人的收益率等等。
*取消质押：*
取消质押的命令：
>**web3.ec.stake.validator.withdraw(withdrawObject)**
>withdrawObject 包含参数如下：
from: 验证人/备用节点的账户地址

执行完上述命令，验证人以及验证人相关的投票权益人的资金将在7日后到账。

### 9.决定收益的因素
验证人/备份验证人：
- 验证人质押的资产数量越多，收益就越多；
- 验证人获得权益投票越多，验证人获得的报酬就越多;
- 验证人如果有多个权益投票人，每个权益投票人投票的数量较少，验证人获得的报酬越多;
- 权益投票人的忠诚度，在180内，权益投票人不撤销投票，收益会一直增长，到180天后达到平衡;
- 验证人设置的区块奖励收益率，验证人在声明成为验证人的时候设置的收益率越过，其获得的报酬越多;

委托人：
- 委托人质押的权益投票越多，收益就越多；
- 委托人忠诚度越高，在180天内，收益会稳步增长；
- 如果验证人向委托人设置的收益率较低，委托人就会获得相对较高的收益；

### 10.查看自己收益的方法：
通过web3接口或者本地console口，输入查询指令：
> **web3.ec.stake.delegator.query(address)**

得到返回结果：
>{
  data: [{
      average_staking_date: 6,
      award_amount: "212010452277072165369322",
      block_height: 0,
      candidate_id: 1,
      comp_rate: "1/5",
      created_at: 0,
      delegate_amount: "1000000000000000000000000",
      delegator_address: "0x2c2411acf7d145c41e55e464ce615e1efd0d0321",
      id: 1,
      pending_withdraw_amount: "0",
      pub_key: {
        type: "tendermint/PubKeyEd25519",
        value: "oOWBaoGBh1XNVnFG/Vf8Isner4TSQp5MeAu7uy9Qfss="
      },
      slash_amount: "0",
      state: "Y",
      validator_address: "0x2c2411AcF7d145C41E55e464ce615e1eFD0D0321",
      voting_power: 23822,
      withdraw_amount: "0"
  }],
  height: 57706
}

award_amount栏：显示的数字就是所得收益

### 11.验证人如何查看自己状态
通过web3接口，或者console口，输入命令：
>**web3.ec.stake.validator.query(validatorAddress)**

得到返回结果如下：
>{
  data: {
    active: "Y",
    block_height: 0,
    comp_rate: "1/5",
    created_at: 0,
    description: {
      email: "",
      location: "",
      name: "",
      profile: "",
      website: ""
    },
    id: 2,
    max_shares: "10000000000000000000000000",
    num_of_delegators: 1,
    owner_address: "0x5a5C08AFc74f636058b22CB207D832523F8Baec0",
    pending_voting_power: 0,
    pub_key: {
      type: "tendermint/PubKeyEd25519",
      value: "84M60PwC5Z/90oHCx7LZ+8ev9DlmB1vPoZtbdbranGo="
    },
    rank: 3,
    shares: "1223013767460719214241478",
    state: "Validator",
    verified: "N",
    voting_power: 24032
  },
  height: 60241
}

从返回信息中可以看到BP节点的创建时间，区块奖励的收益率，BP节点的描述信息，投票权值，节点的公钥信息，质押的资产值等信息。

### 12.验证节点修改对某个委托人的报酬率
执行命令如下：
> **web3.ec.stake.validator.setCompRate(comRateObject)**
>
>comRateObject包含参数如下：
from：验证节点的账户地址；
delegatorAddress:委托人的账户地址；
comRate: 收益率值

### 13. 预估各角色收益值

 TODO