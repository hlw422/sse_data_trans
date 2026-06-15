import { EventType } from './types';

interface MockMessage {
  type: EventType;
  message: string;
}

// 用户名池
const userNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];

// 商品池
const products = ['iPhone 15', 'MacBook Pro', 'AirPods', 'iPad', 'Apple Watch', '小米14', '华为Mate60'];

// 城市池
const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京'];

// 随机整数
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 随机选择
function randPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 生成订单号
function genOrderId(): string {
  return `ORD${Date.now().toString(36).toUpperCase()}${randInt(100, 999)}`;
}

// 用户注册通知
function genUserRegister(): MockMessage {
  const user = randPick(userNames);
  const suffix = randInt(100, 999);
  return {
    type: 'notification',
    message: `新用户注册: ${user}${suffix} 来自${randPick(cities)}`
  };
}

// 新订单通知
function genNewOrder(): MockMessage {
  const user = randPick(userNames);
  const product = randPick(products);
  const qty = randInt(1, 5);
  const amount = randInt(100, 9999);
  return {
    type: 'notification',
    message: `新订单 ${genOrderId()}: ${user} 购买 ${product} x${qty}，金额 ¥${amount}`
  };
}

// 支付成功通知
function genPaymentSuccess(): MockMessage {
  const amount = randInt(100, 9999);
  return {
    type: 'notification',
    message: `支付成功: 订单 ${genOrderId()} 已支付 ¥${amount}`
  };
}

// 库存变动
function genStockUpdate(): MockMessage {
  const product = randPick(products);
  const change = randInt(-20, 50);
  const current = randInt(50, 500);
  return {
    type: 'update',
    message: `库存变动: ${product} ${change > 0 ? '+' : ''}${change}，当前库存 ${current}`
  };
}

// 价格变动
function genPriceUpdate(): MockMessage {
  const product = randPick(products);
  const change = (Math.random() * 10 - 5).toFixed(2);
  const price = randInt(100, 9999);
  return {
    type: 'update',
    message: `价格变动: ${product} ¥${price} (${change > 0 ? '+' : ''}${change}%)`
  };
}

// 物流状态更新
function genLogisticsUpdate(): MockMessage {
  const cities = ['北京', '上海', '广州', '深圳', '杭州'];
  const status = ['已发货', '运输中', '已到达', '派送中', '已签收'];
  return {
    type: 'update',
    message: `物流更新: 订单 ${genOrderId()} ${randPick(status)}，当前位置: ${randPick(cities)}`
  };
}

// 系统监控告警
function genSystemAlert(): MockMessage {
  const alerts = [
    `CPU使用率过高: ${randInt(80, 99)}%`,
    `内存使用率告警: ${randInt(85, 98)}%`,
    `磁盘空间不足: 剩余 ${randInt(1, 10)}%`,
    `API响应超时: 平均 ${randInt(3000, 8000)}ms`,
    `数据库连接池耗尽: ${randInt(90, 100)}%`,
    `错误率上升: ${randInt(5, 20)}%`
  ];
  return {
    type: 'alert',
    message: `系统告警: ${randPick(alerts)}`
  };
}

// 业务告警
function genBusinessAlert(): MockMessage {
  const alerts = [
    `订单处理延迟: ${randInt(100, 500)} 单排队中`,
    `退款申请激增: 最近1小时 ${randInt(50, 200)} 笔`,
    `库存预警: ${randPick(products)} 库存不足 ${randInt(1, 10)} 件`,
    `支付失败率上升: ${randInt(3, 15)}%`,
    `用户投诉增加: 最近1小时 ${randInt(10, 50)} 条`
  ];
  return {
    type: 'alert',
    message: `业务告警: ${randPick(alerts)}`
  };
}

// 所有生成器
const generators = [
  { weight: 20, fn: genUserRegister },
  { weight: 25, fn: genNewOrder },
  { weight: 15, fn: genPaymentSuccess },
  { weight: 10, fn: genStockUpdate },
  { weight: 10, fn: genPriceUpdate },
  { weight: 10, fn: genLogisticsUpdate },
  { weight: 5, fn: genSystemAlert },
  { weight: 5, fn: genBusinessAlert },
];

// 加权随机选择
function weightedRandom(): MockMessage {
  const totalWeight = generators.reduce((sum, g) => sum + g.weight, 0);
  let rand = Math.random() * totalWeight;
  
  for (const gen of generators) {
    rand -= gen.weight;
    if (rand <= 0) {
      return gen.fn();
    }
  }
  
  return generators[0].fn();
}

export function generateMockMessage(): MockMessage {
  return weightedRandom();
}
