import mockjs from 'mockjs';

// 仓库管理 --- 商品库存 --- 开始
const goodsStockList = {
  'GET /common/export-goods-depot': {
    $desc: '导出盘点单',
    $params: {

    },
    $body: {
      code: 0,
    },
  },
};

// 仓库管理 --- 导入盘点单 --- 开始
const importInventoryList = {
  'POST /depot/goods-depot/import': {
    $desc: '导入盘点单',
    $body: {
      code: 0,
      data: mockjs.mock({
        'total|1': [100, 200, 300],
        'goodsList|1-10': [
          {
            'id|+1': 100,
            'img|1': ['xxx', 'xxxx'],
            'name|1': ['商品名称1', '商品名称2'],
            'sn|1': ['条码1', '条码2'],
            'unit|1': ['瓶', '盒'],
            'occupyNum|1': [122, 333, 123],
            'immNum|1': [111, 222, 33],
            'setFromNum|1': [222, 333, 444],
            'canUseNum|1': [333],
            'inWayNum|1': [333, 222, 111],
            'realNum|1': [333, 333],
            'ourateNum|1': [2, 3],
            'diffXm|1': [-1, 3, 4, 0, -2],
            'diffOurate|1': [-1, 3, -3, 0],
          },
        ],
      }),
    },
  },
  'POST /depot/goods-depot/confirm-depot-data': {
    $desc: '校正库存',
    $params: {
      goodsList: {
        desc: '商品列表',
        exp: '[{sn: 商品条码,realNum: 盘点数量,}],',
      },
    },
    $body: {
      code: 0,
    },
  },
};

// 仓库管理 --- 入库单列表 --- 开始
const inStoreList = {
  'GET /depot/purchase-import-depot-order/config': {
    $desc: '获取入库列表的配置项',
    $body: {
      code: 0,
      msg: 'xxx',
      data: mockjs.mock({
        inStoreTypeMap: {
          1: '采购入库',
          2: '销售入库',
          3: '某种入库',
        },
        inStoreStatusMap: {
          1: '待推送',
          2: '待审核',
        },
      }),
    },
  },

  'GET /depot/purchase-import-depot-order/list': {
    $desc: '获取入库单列表',
    $params: {
      curPage: {
        desc: '筛选页数',
        exp: '10',
      },
      pageSize: {
        desc: '每页数据数',
        exp: '15',
      },
      inStoreSn: {
        desc: '入库单号',
        exp: 'xxxx',
      },
      inStoreType: {
        desc: '入库类型',
        exp: '1',
      },
      inStoreStartDate: {
        desc: '入库时间 -- 起始时间',
        exp: '2018-01-01',
      },
      inStoreEndDate: {
        desc: '入库时间 -- 结束时间',
        exp: '2018-01-01',
      },
    },
    $body: {
      code: 0,
      msg: 'xxxx',
      data: mockjs.mock({
        'total|1': [100, 200, 300],
        'inStoreList|15-20': [
          {
            'id|+1': 100,
            'sn|1': ['条码2', '条码1'],
            'status|1': ['入库单状态1', '入库单状态2'],
            'inStoreTime|1': ['入库时间', '入库时间2'],
            'type|1': ['入库单类型', '入库单类型2'],
            'remark|1': ['我是备注', '我是备注2'],
            actionList: {
              'canPush|1': [false, true],
            },
            'goodsList|5-10': [
              {
                'id|+1': 200,
                'img|1': ['xxx', 'xxx'],
                'name|1': ['商品名', '商品名'],
                'sn|1': ['条码1', '条码2'],
                'unit|1': ['瓶', '罐', '盒'],
                'inStoreNum|1': ['入库数(10)', '入库数(20)'],
                'remark|1': ['备注(我是备注)', '备注(我也是备注)'],
              },
            ],
          },
        ],
      }),
    },
  },
};

// 仓库管理 --- 新增入库单 --- 开始
const inStoreAdd = {
  'GET /depot/purchase-import-depot-order/config': {
    $desc: '获取配置项',
    $body: {
      code: 0,
      data: {
        inStoreTypeMap: {
          1: '采购入库',
          2: '销售入库',
          3: '某种入库',
        },
      },
    },
  },
  'POST /depot/purchase-import-depot-order/create-by-user': {
    $desc: '新增入库单',
    $params: {
      inStoreType: {
        desc: '入库类型',
        exp: '1|2|3',
      },
      remark: {
        desc: '入库单备注',
        exp: '备注哈哈哈哈',
      },
      goodsList: {
        desc: '商品列表',
        exp: '[{id: 商品id,inStoreNum: 入库数量,remark: 商品备注},],',
      },
    },
    $body: {
      code: 0,
      msg: 'success',
    },
  },
};

export {
  goodsStockList,
  importInventoryList,
  inStoreList,
  inStoreAdd,
};
