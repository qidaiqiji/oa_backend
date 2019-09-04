import mockjs from 'mockjs';
// 常用接口
const common = {
  'GET /sale/goods/list': {
    $desc: '获取全部商品',
    $params: {
      currentPage: {
        desc: '第几页',
        exp: 1,
      },
      pageSize: {
        desc: '每页多少条数据',
        exp: 15,
      },
      isZhifa: {
        desc: '是否直发商品',
        exp: '0 => 全部, 1 => 直发, 2 => 非直发',
      },
      keywords: {
        desc: '搜索字段',
        exp: 112232,
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'total|+1': [100, 200, 300],
        'goods|1-20': [
          {
            'inWayNum|+1': 100,
            'imNum|+1': 100,
            'canUseNum|+1': 100,
            'setFromNum|+1': 100,
            'occupyNum|+1': 111,
            'goodsId|+1': 100,
            'img|1': ['xxx', 'xx', 'xx'],
            'goodsNo|1': ['ces1', 'ces12', 'ces13'],
            'goodsName|1': ['面膜1', '面膜2', '香水1', '香水2', '香水3'],
            'unit|1': ['个', '瓶', '罐'],
            'salePrice|1': ['100', '27', '75'],
            'discount|1': ['3.5', '5.5'],
            'category|1': ['面膜', '面膜', '香水', '香水', '香水'],
          },
        ],
      }),
    },
  },
  'GET /purchase/purchase-supplier-info/list': {
    $desc: '获取供应商列表',
    $params: {
      id: {
        desc: '供应商id',
        exp: '123',
      },
      keyword: {
        desc: '供应商关键词',
        exp: '帅哥供应商',
      },
      status: {
        desc: '供应商状态',
        exp: '-1=>全部, 0=>禁用, 1=>启用',
      },
      curPage: {
        desc: '页数',
        exp: '10',
      },
    },
    $body: {
      code: 0,
      message: 'goods',
      data: mockjs.mock({
        'total|1': [100, 200],
        'suppliers|1-10': [
          {
            'id|+1': 10,
            'sn|1': ['检索简码(1xxx)', '检索简码(sjhx123)'],
            'name|1': ['供应商名称(帅哥供应商)', '供应商名称(美女供应商)'],
            'linkman|1': ['联系人(帅哥)', '联系人(美女)'],
            'contact|1': ['联系方式(17620323555)'],
            'address|1': ['地址(深圳宝安), 地址(广州白云)'],
            'status|1': ['启用', '禁用'],
            'remark|1': ['备注(xxx)', '备注(321312)'],
          },
        ],
      }),
    },
  },
};

export { common };
