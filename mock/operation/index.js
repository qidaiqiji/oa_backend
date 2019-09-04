import mockjs from 'mockjs';

const goodsManage = {
  'GET /sale/goods/config': {
    $desc: '获取 运营管理--商品管理 map',
    $body: {
      code: 0,
      msg: '成功了喂~',
      data: mockjs.mock({
        goodsStatusMap: {
          0: '下架',
          1: '上架',
        },
        goodsTypeMap: {
          0: '直发',
          1: '代发',
        },
      }),
    },
  },
  'GET /sale/goods/goods-list': {
    $desc: '获取 运营管理--商品管理 商品列表',
    $params: {
      keywords: {
        desc: '品牌/商品/条码模糊搜索关键词',
        exp: '美迪惠尔',
      },
      goodsStatus: {
        desc: '商品状态',
        exp: '默认 -1 为全部, 其他由后端传入',
      },
      goodsType: {
        desc: '商品类型',
        exp: '默认 -1 为全部, 其他由后端传入',
      },
      curPage: {
        desc: '页码',
        exp: 5,
      },
      pageSize: {
        desc: '页数',
        exp: 10,
      },
    },
    $body: {
      code: 0,
      msg: '接口信息',
      data: mockjs.mock({
        total: mockjs.Random.integer(20, 100),
        'goodsList|0-20': [{
          goodsImg: mockjs.Random.image('50x50'),
          'goodsId|+1': 0,
          'goodsName|1': ['美迪惠尔18ml巨大帅哥性面膜18*50', '丽得姿18ml巨大帅哥性面膜'],
          'goodsSn|1': ['12983791827397', '88738827166'],
          'goodsUnit|1': ['瓶', '罐', '盒'],
          goodsPlatformPrice: mockjs.Random.float(5, 200, 2, 2),
          goodsCostPrice: mockjs.Random.float(2, 100, 2, 2),
          goodsFloorPrice: mockjs.Random.float(3, 150, 2, 2),
          goodsImStore: mockjs.Random.integer(0, 200),
          goodsInWayStore: mockjs.Random.integer(0, 200),
          goodsCanUseStore: mockjs.Random.integer(0, 200),
          goodsOccupyStore: mockjs.Random.integer(0, 200),
          isOut: mockjs.Random.boolean(),
        }],
      }),
    },
  },
  'POST /sale/goods/change-lowest-price': {
    $desc: '运营管理--商品管理 修改商品低级价格',
    $params: {
      goodsId: {
        desc: '商品id',
        exp: 10,
      },
      goodsFloorPrice: {
        desc: '商品将要修改到的底价',
        exp: 10.50,
      },
    },
    $body: {
      code: 0,
      msg: 'xxx',
    },
  },
};

export {
  goodsManage,
};
