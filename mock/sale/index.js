import mockjs from 'mockjs';
// 销售管理 --- 销售待出库列表 --- 开始
const saleAwaitOutStoreOrderList = {
  'GET /sale/order-info/await-export-depot-order-list': {
    $desc: '获取销售待出库订单列表',
    $params: {
      currentPage: {
        desc: '第几页',
        exp: 1,
      },
      sumOrderNum: {
        desc: '搜索的总单号',
        exp: 123123,
      },
      consignee: {
        desc: '收货人',
        exp: '梁朝伟',
      },
      startDate: {
        desc: '订单创建时间范围--开始时间',
        exp: '2017-01-01',
      },
      endDate: {
        desc: '订单创建时间范围--结束时间',
        exp: '2017-01-01',
      },
    },
    $body: {
      code: 0,
      msg: '成功',
      data: mockjs.mock({
        'total|+1': [100, 200, 300],
        'orderList|3-10': [
          {
            'id|+1': 100,
            'sumNo|+1': ['总单号1', '总单号2', '总单号3'],
            'subNo|+1': ['子单号1', '子单号2', '子单号3'],
            'storeNo|+1': ['出库单号1', '出库单号2', '出库单号3'],
            'user|+1': ['用户1', '用户2', '用户3'],
            'status|+1': [0, 1, 0],
            'consigneeMobile|+1': ['联系人电话1', '联系人电话2', '联系人电话3'],
            'consigneeName|+1': ['联系人名字1', '联系人名字2', '联系人名字3'],
            'address|+1': ['收货地址1', '收货地址2', '收货地址3'],
            // 'remark|+1': ['备注1', '备注2', '备注3'],
            'shippingName|+1': ['邮费政策1', '邮费政策2', '邮费政策3'],
            'dateTime|+1': ['创建时间1', '创建时间2', '创建时间3'],
            'orderRemark|+1': ['订单备注1', '订单备注2', '订单备注3'],
            'goods|3-10': [
              {
                'recId|+1': 102,
                'id|+1': 100,
                'img|1': ['商品缩略图1', '商品缩略图2'],
                'name|+1': ['商品名称1', '商品名称2', '商品名称3'],
                'no|+1': ['商品编号1', '商品编号2', '商品编号3'],
                'goodsNum|+1': ['商品数量1', '商品数量2', '商品数量3'],
                'awaitNum|+1': ['待发数量1', '待发数量2', '待发数量3'],
                'price|+1': ['单价1', '单价2'],
                'subtotal|+1': ['小计1', '小计2'],
                'remark|1': ['备注1', '备注2'],
              },
            ],
          },
        ],
      }),
    },
  },
  'POST /sale/order-info/update-order-goods-remark': {
    $desc: '商品备注',
    $params: {
      recId: {
        desc: '商品id',
        exp: 102,
      },
      remark: {
        desc: '备注',
        exp: '备注1',
      },
    },
    $body: {
      code: 0,
      msg: '成功',
      data: {},
    },
  },
  'POST /sale/genOutStoreOrder': {
    $desc: '生成出库单',
    $params: {
      ids: {
        desc: '订单id',
        exp: '[1,2,3,4,5]',
      },
    },
    $body: {
      code: 0,
      msg: '成功',
      data: {},
    },
  },
};
// 销售管理 --- 销售待出库列表 --- 结束

// 销售管理 --- 销售出库单列表 --- 开始
const salePushOrderList = {
  'GET /depot/sales-export-depot-order/get-status-map': {
    $desc: '所有状态列表',
    $params: {},
    $body: {
      code: 0,
      data: mockjs.mock({
        'statusMap|5': {
          1: '待主管审核',
          2: '主管审核通过',
          3: '下推待出库',
          4: '出库完成',
          5: '仓库驳回',
        },
        'typeMap|5': {
          1: '盘亏出库',
          2: '销售出库',
          3: '采购退货出库',
        },
        canPushMap: [2, 1],
        canRollbackMap: [1, 2],
        canCheckMap: [1, 2],
      }),
    },
  },
  'POST /depot/sales-export-depot-order/push': {
    $desc: '出库单推送',
    $params: {
      id: {
        desc: '要推送的出库单id',
        exp: 100,
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /depot/sales-export-depot-order/rollback': {
    $desc: '出库单销毁',
    $params: {
      id: {
        desc: '要销毁的出库单id',
        exp: 100,
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /depot/sales-export-depot-order/director-check-pass': {
    $desc: '出库单审核',
    $params: {
      id: {
        desc: '要审核的出库单id',
        exp: 100,
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'GET /depot/sales-export-depot-order/list': {
    $desc: '获取销售待推送出库单列表',
    $params: {
      currentPage: {
        desc: '第几页',
        exp: 1,
      },
      sumOrderNum: {
        desc: '搜索的出库单号',
        exp: 123123,
      },
      consignee: {
        desc: '收货人',
        exp: '金三胖',
      },
      status: {
        desc:
          '筛选的销售出库订单状态, -1|全部 1|状态1, 2|状态2, 3|状态3, 4|状态4, 5|状态5',
        exp: '-1',
      },
      startDate: {
        desc: '订单创建时间范围--开始时间',
        exp: '2017-01-01',
      },
      endDate: {
        desc: '订单创建时间范围--结束时间',
        exp: '2017-01-01',
      },
    },
    $body: {
      code: 0,
      msg: '成功',
      data: mockjs.mock({
        'total|+1': [100, 200, 300],
        'orderList|3-10': [
          {
            'id|+1': 100,
            'storeNo|+1': ['出库单号1', '出库单号2', '出库单号3'],
            subNo: [
              { 12211: '子单号1' },
              { 14411: '子单号2' },
              { 12251: '子单号3' },
            ],
            'fare|+1': ['运费1', '运费2', '运费3'],
            'shippingName|+1': ['邮费政策1', '邮费政策2', '邮费政策3'],
            'shipmentNo|+1': ['物流单号1', '物流单号2', '物流单号3'],
            'status|1': [3, 1, 5, 4],
            'consigneeMobile|+1': ['联系人电话1', '联系人电话2', '联系人电话3'],
            'consigneeName|+1': ['联系人名字1', '联系人名字2', '联系人名字3'],
            'address|+1': ['收货地址1', '收货地址2', '收货地址3'],
            'dateTime|+1': ['创建时间1', '创建时间2', '创建时间3'],
            'remark|+1': ['订单备注1', '订单备注2', '订单备注3'],
            'goods|3-10': [
              {
                'id|+1': 100,
                'img|1': ['商品缩略图1', '商品缩略图2'],
                'name|+1': ['商品名称1', '商品名称2', '商品名称3'],
                'no|+1': ['商品编号1', '商品编号2', '商品编号3'],
                'goodsNum|+1': ['商品数量1', '商品数量2', '商品数量3'],
                'sendNum|+1': ['实发数量1', '实发数量2', '实发数量3'],
              },
            ],
            'fare|+1': ['运费1', '运费2', '运费3'],
            'shippingName|+1': ['邮费政策1', '邮费政策2', '邮费政策3'],
            'shipmentNo|+1': ['物流单号1', '物流单号2', '物流单号3'],
            'status|1': [3, 1, 5, 4],
            'consigneeMobile|+1': ['联系人电话1', '联系人电话2', '联系人电话3'],
            'consigneeName|+1': ['联系人名字1', '联系人名字2', '联系人名字3'],
            'address|+1': ['收货地址1', '收货地址2', '收货地址3'],
            'dateTime|+1': ['创建时间1', '创建时间2', '创建时间3'],
            'remark|+1': ['订单备注1', '订单备注2', '订单备注3'],
            'goods|3-10': [
              {
                'id|+1': 100,
                'img|1': ['商品缩略图1', '商品缩略图2'],
                'name|+1': ['商品名称1', '商品名称2', '商品名称3'],
                'no|+1': ['商品编号1', '商品编号2', '商品编号3'],
                'goodsNum|+1': ['商品数量1', '商品数量2', '商品数量3'],
                'sendNum|+1': ['实发数量1', '实发数量2', '实发数量3'],
              },
            ],
          },
        ],
      }),
    },
  },
};
// 销售管理 --- 销售出库单列表 --- 结束

// 销售管理 --- 新建出库单 --- 开始
const outStoreAdd = {
  'GET /depot/sales-export-depot-order/config': {
    $desc: '获取新增出库单页面配置项',
    $body: {
      code: 0,
      data: {
        outStoreTypeMap: {
          1: '退货出库',
          2: '采购退货出库',
          3: '其他出库',
        },
      },
    },
  },
  'POST /depot/sales-export-depot-order/create-by-user': {
    $desc: '新增出库单',
    $params: {
      outStoreType: {
        desc: '出库单类型',
        exp: 1,
      },
      remark: {
        desc: '出库单备注',
        exp: '备注1122',
      },
      consignee: {
        desc: '收货人姓名',
        exp: '大帅哥',
      },
      mobile: {
        desc: '收货人号码',
        exp: '1355625571',
      },
      address: {
        desc: '地址[省, 市, 区]',
        exp: '[1, 2, 3]',
      },
      addressDetail: {
        desc: '详细地址',
        exp: 'xx街道, xxxxxx',
      },
      goodsList: {
        desc: '商品列表',
        exp: '[{id: 1,outStoreNum: 出库数量,remark: 商品备注,},],',
      },
    },
    $body: {
      code: 0,
      msg: 'success',
    },
  },
};
// 销售管理 --- 新建出库单 --- 结束

// 销售管理 --- 销售新建/修改订单列表 --- 开始
const saleOrderAdd = {
  'GET /sale/order-group/detail': {
    $desc: '获取已创建的订单信息',
    $params: {
      id: {
        desc: '订单id',
        exp: 123,
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        userId: 3079,
        userName: '肖云',
        receiving: '赛亚星球第三宇宙虫洞',
        date: '2018-01-10',
        payInfo: '支付方式: 现款支付',
        invoiceInfo: '发票信息Demo',
        invoiceType: '不开票',
        goodsInfos: [
          { goodsId: 1, saleNum: 50, remark: '你懂我说的' },
          { goodsId: 2, saleNum: 35, remark: '让兽人臣服我的王座' },
        ],
        specialPrice: '30.00',
        remark: '大结局顶顶顶顶顶',
      }),
    },
  },
  // 'GET /sale/goods/list': {
  //   $desc: '获取全部商品',
  //   $params: {
  //     currentPage: {
  //       desc: '第几页',
  //       exp: 1,
  //     },
  //     keywords: {
  //       desc: '搜索字段',
  //       exp: 112232,
  //     },
  //   },
  //   $body: {
  //     code: 0,
  //     data: mockjs.mock({
  //       'total|+1': [100, 200, 300],
  //       'goods|1-20': [
  //         {
  //           'inWayNum|+1': 100,
  //           'imNum|+1': 100,
  //           'canUseNum|+1': 100,
  //           'setFromNum|+1': 100,
  //           'goodsId|+1': 100,
  //           'img|1': ['', '', ''],
  //           'goodsNo|1': [
  //             'ces1',
  //             'ces12',
  //             'ces13',
  //           ],
  //           'goodsName|1': [
  //             '面膜1',
  //             '面膜2',
  //             '香水1',
  //             '香水2',
  //             '香水3',
  //           ],
  //           'unit|1': [
  //             '个',
  //             '瓶',
  //             '罐',
  //           ],
  //           'salePrice|1': [
  //             '100',
  //             '27',
  //             '75',
  //           ],
  //           'discount|1': [
  //             '3.5',
  //             '5.5',
  //           ],
  //           'category|1': [
  //             '面膜',
  //             '面膜',
  //             '香水',
  //             '香水',
  //             '香水',
  //           ],
  //         },
  //       ],
  //     }),
  //   },
  // },
  'GET /sale/user/list': {
    $desc: '获取筛选客户',
    $params: {
      currentPage: {
        desc: '第几页',
        exp: 1,
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
        'users|10': [
          {
            'userId|+1': 103,
            'level|+1': 100,
            'userNo|1': ['user1', 'user1', 'user1', 'user12', 'user13'],
            'userName|1': [
              '金三胖',
              '金日成',
              '金正日',
              '金刚葫芦娃',
              '金三胖-1',
              '金三胖-2',
              '金三胖-3',
              '金三胖-4',
              '金三胖-5',
              '金三胖=6',
              '金三胖-7',
              '金三胖=8',
              '金三胖-9',
              '金三胖-10',
              '金三胖-11',
              '金三胖-12',
              '金三胖-13',
              '金三胖-14',
              '金三胖-15',
              '金三胖-16',
              '金三胖-17',
            ],
            'mobilePhone|1': ['13277896544', '16457894621', '14635214569'],
            'address|1': ['火星', '金星', '赛亚星球'],
          },
        ],
      }),
    },
  },
  'GET /sale/user-address/list': {
    $desc: '获取客户收货信息',
    $params: {
      userId: {
        desc: '客户ID',
        exp: 100,
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'receiving|1-6': [
          {
            'receivingId|+1': 103,
            'isDefault|1': [0, 1],
            'userName|1': [
              '金三胖',
              '金日成',
              '金正日',
              '金刚葫芦娃',
              '金三胖-1',
              '金三胖-2',
              '金三胖-3',
              '金三胖-4',
              '金三胖-5',
              '金三胖=6',
              '金三胖-7',
              '金三胖=8',
              '金三胖-9',
              '金三胖-10',
              '金三胖-11',
              '金三胖-12',
              '金三胖-13',
              '金三胖-14',
              '金三胖-15',
              '金三胖-16',
              '金三胖-17',
            ],
            'mobilePhone|1': ['13277896544', '16457894621', '14635214569'],
            'province|+1': [{ id: 2136, name: '广东省' }],
            'city|+1': [{ id: 2163, name: '深圳市' }],
            'district|+1': [{ id: 2166, name: '福田区' }],
            'address|1': ['xxxxxxxxx', 'sssssssss', 'fffffffff'],
          },
        ],
      }),
    },
  },
  'POST /sale/user-address/create': {
    $desc: '新建收货信息',
    $params: {
      userId: {
        desc: '客户id',
        exp: 123,
      },
      userName: {
        desc: '收货人',
        exp: '金三胖',
      },
      mobilePhone: {
        desc: '手机号',
        exp: '13822112233',
      },
      province: {
        desc: '省份',
        exp: 21,
      },
      city: {
        desc: '城市',
        exp: 47,
      },
      district: {
        desc: '地区',
        exp: 129,
      },
      address: {
        desc: '详细地址',
        exp: '北京市海淀区万寿路126号',
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /sale/user-address/update': {
    $desc: '修改收货信息',
    $params: {
      userName: {
        desc: '收货人',
        exp: '金三胖',
      },
      mobiliePhone: {
        desc: '手机号',
        exp: '13822112233',
      },
      province: {
        desc: '省份',
        exp: 21,
      },
      city: {
        desc: '城市',
        exp: 47,
      },
      district: {
        desc: '地区',
        exp: 129,
      },
      address: {
        desc: '详细地址',
        exp: '北京市海淀区万寿路126号',
      },
      receivingId: {
        desc: '收货信息id',
        exp: 123656,
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /sale/user-address/delete': {
    $desc: '删除收货信息',
    $params: {
      addressId: {
        desc: '收货信息Id',
        exp: 21,
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /sale/user-address/default': {
    $desc: '设置默认收货信息',
    $params: {
      userId: {
        desc: '客户id',
        exp: 123,
      },
      addressId: {
        desc: '收货信息Id',
        exp: 21,
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /sale/sale-order/change-invoice-default': {
    $desc: '设置默认发票信息',
    $params: {
      userId: {
        desc: '客户id',
        exp: 123,
      },
      invoiceId: {
        desc: '发票信息Id',
        exp: 21,
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /sale/invoice/create': {
    $desc: '新建发票',
    $params: {
      userId: {
        desc: '客户id',
        exp: 123,
      },
      companyName: {
        desc: '发票抬头',
        exp: '小美诚品',
      },
      address: {
        desc: '单位地址',
        exp: '深圳市宝安区XXXXX',
      },
      phoneNumber: {
        desc: '联系电话',
        exp: '112131345646',
      },
      companyTaxID: {
        desc: '企业税号',
        exp: '66699779797',
      },
      bank: {
        desc: '开户银行',
        exp: '浦发银行',
      },
      bankAccount: {
        desc: '银行账户',
        exp: '7877-7787-4444-4444',
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /sale/invoice/delete': {
    $desc: '删除发票信息',
    $params: {
      invoiceId: {
        desc: '发票信息Id',
        exp: 21,
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /sale/invoice/update': {
    $desc: '修改发票',
    $params: {
      companyName: {
        desc: '发票抬头',
        exp: '小美诚品',
      },
      address: {
        desc: '单位地址',
        exp: '深圳市宝安区XXXXX',
      },
      phoneNumber: {
        desc: '联系电话',
        exp: '112131345646',
      },
      companyTaxID: {
        desc: '企业税号',
        exp: '66699779797',
      },
      bank: {
        desc: '开户银行',
        exp: '浦发银行',
      },
      bankAccount: {
        desc: '银行账户',
        exp: '7877-7787-4444-4444',
      },
      invoiceId: {
        desc: '发票id',
        exp: 123656,
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'GET /sale/invoice/list': {
    $desc: '获取客户发票信息',
    $params: {
      userId: {
        desc: '客户ID',
        exp: 100,
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'invoiceInfo|1-4': [
          {
            invoiceId: 31415926,
            'isDefault|1': [false, true],
            companyName: '小美诚品',
            address: '深圳市宝安区XXXXX',
            phoneNumber: '112131345646',
            companyTaxID: '66699779797',
            bank: '浦发银行',
            bankAccount: '7877-7787-4444-4444',
          },
        ],
      }),
    },
  },
  'GET /sale/order-group/config': {
    $desc: '获取制单配置项',
    $params: {},
    $body: {
      code: 0,
      data: mockjs.mock({
        fareInfoMap: {
          1: '包邮',
          2: '到付',
        },
        payInfoMap: {
          1: '现付',
          2: '挂账',
          3: '账期',
        },
      }),
    },
  },
  'POST /sale/order-group/create': {
    $desc: '提交审核',
    $params: {
      userId: {
        desc: '客户id',
        exp: 123,
      },
      fareInfo: {
        desc: '运费信息',
        exp: '1|包邮, 2|到付',
      },
      receiving: {
        desc: '收货信息id',
        exp: 101,
      },
      date: {
        desc: '交货日期',
        exp: '2018-01-10 11:11:11',
      },
      payInfo: {
        desc: '支付信息',
        exp: '1|现付, 2|挂账, 3|账期',
      },
      invoiceInfo: {
        desc: '发票信息id',
        exp: 100,
      },
      invoiceType: {
        desc: '发票类型',
        exp: '普通发票/增值发票',
      },
      goodsInfos: {
        desc: '商品id和数量以及商品备注',
        exp:
          "[{goodsId: 1,saleNum: 50,goodsRemark: '你懂我说的'},{goodsId: 2,saleNum: 35,goodsRemark: '让兽人臣服我的王座'}]",
      },
      specialPrice: {
        desc: '特批价',
        exp: 200,
      },
      remark: {
        desc: '制单备注',
        exp: '强大的契约卷轴！！',
      },
    },
    $body: {
      code: 0,
      data: {
        id: 12306,
      },
    },
  },
  'POST /sale/order-group/update': {
    $desc: '提交修改订单审核',
    $params: {
      userId: {
        desc: '客户id',
        exp: 123,
      },
      fareInfo: {
        desc: '运费信息',
        exp: '1|包邮, 2|到付',
      },
      receiving: {
        desc: '收货信息id',
        exp: 101,
      },
      date: {
        desc: '交货日期',
        exp: '2018-01-10 11:11:11',
      },
      payInfo: {
        desc: '支付信息',
        exp: '1|现付, 2|挂账, 3|账期',
      },
      invoiceInfo: {
        desc: '发票信息id',
        exp: 100,
      },
      invoiceType: {
        desc: '发票类型',
        exp: '普通发票/增值发票',
      },
      goodsInfos: {
        desc: '商品id和数量以及商品备注',
        exp:
          "[{goodsId: 1,saleNum: 50,goodsRemark: '你懂我说的'},{goodsId: 2,saleNum: 35,goodsRemark: '让兽人臣服我的王座'}]",
      },
      specialPrice: {
        desc: '特批价',
        exp: 200,
      },
      remark: {
        desc: '制单备注',
        exp: '强大的契约卷轴！！',
      },
    },
    $body: {
      code: 0,
      data: [12306],
    },
  },
};
// 销售管理 --- 销售新建/修改订单列表 --- 结束

// 销售管理 --- 销售订单列表 --- 开始
const saleOrderList = {
  'GET /sale/order-group/get-status-map': {
    $des: '获取配置项',
    $body: {
      code: 0,
      msg: 'success',
      data: {
        checkMap: {
          1: '审核状态1',
          2: '审核状态2',
        },
        statusMap: {
          1: '订单状态1',
          2: '订单状态2',
        },
        originMap: {
          1: '订单来源1',
          2: '订单来源2',
        },
        payMethodMap: {
          1: '支付方式1',
          2: '支付方式2',
        },
        payStatusMap: {
          1: '付款状态1',
          2: '付款状态2',
        },
      },
    },
  },
  'GET /sale/order-group/list': {
    $desc: '获取销售订单列表',
    $params: {
      checkStatus: {
        desc: '审核状态(-1 => 全部)',
        exp: '-1',
      },
      orderStatus: {
        desc: '订单状态(-1 => 全部)',
        exp: '-1',
      },
      orderOrigin: {
        desc: '订单来源(-1 => 全部)',
        exp: '-1',
      },
      orderStartTime: {
        desc: '搜索订单的创建时间范围(开始)',
        exp: '2017-10-10',
      },
      orderEndTime: {
        desc: '搜索订单的创建时间范围(结束)',
        exp: '2017-10-12',
      },
      customer: {
        desc: '订单号/客户名/客户手机号',
        exp: '15000299843',
      },
      consignee: {
        desc: '收货人/手机号',
        exp: '快乐收货人',
      },
      curPage: {
        desc: '当前页码',
        exp: '1',
      },
      pageSize: {
        desc: '每页条数',
        exp: '10',
      },
    },
    $body: {
      code: 0,
      msg: '获取列表成功',
      data: mockjs.mock({
        total: 100,
        'orderList|2-10': [
          {
            'orderId|+1': 1,
            'orderStatus|+1': [1, 2, 3, 4, 5],
            'orderNum|+1': ['订单号1', '订单号2', '订单号3'],
            'checkStatus|+1': [1, 2, 3],
            'customerName|+1': ['人1', '人2', '人3'],
            'allAmount|+1': [111, 222, 333, 444],
            'realAmount|+1': [11, 22, 33, 44],
            'payStatus|+1': [1, 2, 3, 4],
            createUser: '制单员',
            address: '收货地址',
            consignee: '收货人',
            mobile: '收货电话',
            'createTime|+1': ['2010-10-10', '2011-11-11', '2013-12-12'],
            remark: '备注',
            'payMethod|+1': [1, 2, 3, 4],
            'orderOrigin|+1': [1, 2, 3, 4],
            'isDiscount|+1': [true, false, false],
            'goodsList|5-15': [
              {
                'id|+1': 110,
                img: 'xxx',
                'name|+1': ['美迪惠尔爽肤水', '芙丽芳丝面膜'],
                'unit|+1': ['盒', '瓶', '桶'],
                'no|+1': ['商品编码1', '商品编码2', '商品编码3'],
                'price|+1': ['单价111', '单价2222', '单价333'],
                'number|+1': ['商品数量1', '商品数量2', '商品数量3'],
                'subtotal|+1': ['小计1111', '小计2222', '小计3333'],
                'remark|+1': ['备注1', '备注2', '备注3'],
                'isDiscount|+1': [true, false, false],
                'isGroupBuy|+1': [true, false, false],
              },
            ],
          },
        ],
      }),
    },
  },
};
// 销售管理 --- 销售订单列表 --- 结束

// 销售管理 --- 销售订单详情 --- 开始
const saleOrderDetail = {
  'GET /sale/order-group/get-status-map': {
    $desc: '获取配置项',
    $body: {
      code: 0,
      msg: 'success',
      data: {
        payMethodMap: {
          0: '现付现结',
          1: '挂账对冲',
          2: '账期预付',
        },
        payIdMap: {
          0: '支付宝',
          1: '建设银行',
          2: '中国银行',
        },
        collectAccountMap: {
          0: '招商银行',
          1: '建设银行',
          2: '中国银行',
        },
        statusMap: {
          1: '订单状态1',
          2: '订单状态2',
          3: '订单状态3',
          4: '订单状态4',
          5: '订单状态5',
        },
      },
    },
  },
  'POST /finance/sales-cash-bill/insert-from-order-group': {
    $desc: '生成现付支付流水',
    $params: {
      totalOrderId: {
        desc: '总单id',
        exp: '123',
      },
      amount: {
        desc: '支付金额',
        exp: '123.321',
      },
      payId: {
        desc: '支付渠道',
        exp: '0|1|2|3',
      },
      transactionSn: {
        desc: '银行流水',
        exp: '32321132',
      },
      payTime: {
        desc: '支付时间',
        exp: '2017-10-10 19:12:12',
      },
      collectAccount: {
        desc: '收款账户',
        exp: '0|1|2|3',
      },
      remark: {
        desc: '备注',
        exp: '备注备注备注',
      },
    },
    $body: {
      code: 0,
      msg: 'success',
      data: mockjs.mock({
        'id|+1': [1, 2, 3],
        'salesman|+1': ['业务员1', '业务员2'],
        'assessor|+1': ['审核员1', '审核员2'],
        'payNo|+1': ['支付流水号1', '支付流水号2'],
        'payTime|+1': ['支付时间1', '支付时间2'],
        'payAmount|+1': ['支付金额1', '支付金额2'],
        'payMethod|+1': ['支付方式1', '支付方式2'],
        'collectAccount|+1': ['收款账户1', '收款账户2'],
        'payStatus|+1': ['支付状态1', '支付状态2'],
        'remark|+1': ['备注1', '备注2'],
      }),
    },
  },
  'POST /finance/sales-balance-bill/insert-from-order-group': {
    $desc: '生成挂账对冲流水',
    $params: {
      totalOrderId: {
        desc: '总单id',
        exp: '123',
      },
      amount: {
        desc: '支付金额',
        exp: '123.321',
      },
      remark: {
        desc: '备注',
        exp: '备注备注备注',
      },
    },
    $body: {
      code: 0,
      msg: 'success',
      data: mockjs.mock({
        'id|+1': [1, 2, 3],
        'salesman|+1': ['业务员1', '业务员2'],
        'assessor|+1': ['审核员1', '审核员2'],
        'payNo|+1': ['支付流水号1', '支付流水号2'],
        'payTime|+1': ['支付时间1', '支付时间2'],
        'payAmount|+1': ['支付金额1', '支付金额2'],
        'payMethod|+1': ['支付方式1', '支付方式2'],
        'collectAccount|+1': ['收款账户1', '收款账户2'],
        'payStatus|+1': ['支付状态1', '支付状态2'],
        'remark|+1': ['备注1', '备注2'],
      }),
    },
  },
  'POST /finance/sales-credit-bill/insert-from-order-group': {
    $desc: '生成账期支付流水',
    $params: {
      totalOrderId: {
        desc: '总单id',
        exp: '123',
      },
      amount: {
        desc: '支付金额',
        exp: '123.321',
      },
      payTime: {
        desc: '支付时间',
        exp: '2017-10-10 19:12:12',
      },
      backTime: {
        desc: '预期回款时间',
        exp: '2017-10-10 10:10:10',
      },
      remark: {
        desc: '备注',
        exp: '备注备注备注',
      },
    },
    $body: {
      code: 0,
      msg: 'success',
      data: mockjs.mock({
        'id|+1': [1, 2, 3],
        'salesman|+1': ['业务员1', '业务员2'],
        'assessor|+1': ['审核员1', '审核员2'],
        'payNo|+1': ['支付流水号1', '支付流水号2'],
        'payTime|+1': ['支付时间1', '支付时间2'],
        'payAmount|+1': ['支付金额1', '支付金额2'],
        'payMethod|+1': ['支付方式1', '支付方式2'],
        'collectAccount|+1': ['收款账户1', '收款账户2'],
        'payStatus|+1': ['支付状态1', '支付状态2'],
        'remark|+1': ['备注1', '备注2'],
      }),
    },
  },
  'GET /sale/order-group/info': {
    $des: '获取订单详情',
    $params: {
      id: {
        desc: '订单id',
      },
    },
    $body: {
      code: 0,
      msg: 'success',
      data: mockjs.mock({
        totalOrder: {
          'canBossReject|1': [true, false],
          'canFinanceReject|1': [true, false],
          'canBossCheck|1': [true, false],
          'canFinanceCheck|1': [true, false],
          'canEdit|1': [true, false],
          'canAddRefundStream|1': [true, false],
          'canObsolete|1': [true, false],
          'canDelete|1': [true, false],
          'totalOrderStatus|1': [0, 1, 2],
          totalOrderNo: '总单号(11)',
          'isDiscount|+1': [true, false],
          'isReject|+1': [false, true],
          customer: '客户(帅哥森)',
          salesman: '业务员(业务森)',
          allGoodsNum: '所有商品数量(111)',
          actualAmount: '实际总额(22.22)',
          specialAmount: '特批价(11)',
          allAmount: '应付总额(111)',
          express: '运费信息(到付)',
          consignee: {
            name: '收货人名(超帅森)',
            mobile: '收货人手机号(13556215779)',
            address: '收货地址(广东省惠州市xxxxxx)',
          },
          deliveryTime: '交货日期(2018-10-10 10:10:10)',
          payInfo: {
            payMethod: '支付方式(现付)',
          },
          invoiceInfo: {
            invoiceType: '发票类型(不开票)',
            companyName: '发票抬头(小美诚品)',
            address: '单位地址(深圳市宝安区)',
            phoneNumber: '联系电话(112131345646)',
            companyTaxID: '企业税号(66699779797)',
            bank: '开户银行(浦发银行)',
            bankAccount: '银行账户(7877-7787-4444-4444)',
          },
          remark: '订单备注!!!!!!!',
          paidAmount: '已付款(11)',
          awaitSureAmount: '待确认款(22)',
          awaitPayAmount: '待支付款(33)',
          'goodsList|1-2': [
            {
              'id|+1': 100,
              'img|+1': ['图片1', '图片2', '图片3'],
              'name|+1': ['商品名1', '商品名2', '商品名3'],
              'no|+1': ['商品编码1', '商品编码2'],
              'unit|+1': ['单位1', '单位2'],
              'price|+1': ['单价1', '单价2'],
              'subtotal|+1': ['小计1', '小计2'],
              'standard|+1': ['规格1', '规格2'],
              'number|+1': ['数量1', '数量2'],
              'outStoreNum|+1': ['出库数1', '出库数2'],
              'awaitOutStoreNum|+1': ['待出库数1', '待出库2'],
              'remark|+1': ['备注1', '备注2'],
            },
          ],
        },
        'subOrders|2-5': [
          {
            'subOrderId|+1': 200,
            'subOrderNo|+1': ['子单号1', '子单号2', '子单号3'],
            'subOrderType|+1': ['订单类型1', '订单类型2', '订单类型3'],
            'goodsList|1-2': [
              {
                'id|+1': 100,
                'img|+1': ['图片1', '图片2', '图片3'],
                'name|+1': ['商品名1', '商品名2', '商品名3'],
                'no|+1': ['商品编码1', '商品编码2'],
                'unit|+1': ['单位1', '单位2'],
                'price|+1': ['单价1', '单价2'],
                'subtotal|+1': ['小计1', '小计2'],
                'standard|+1': ['规格1', '规格2'],
                'number|+1': ['数量1', '数量2'],
                'outStoreNum|+1': ['出库数1', '出库数2'],
                'awaitOutStoreNum|+1': ['待出库数1', '待出库2'],
                'remark|+1': ['备注1', '备注2'],
              },
            ],
          },
        ],
        'collections|1-3': [
          {
            'id|+1': [1, 2, 3],
            'salesman|+1': ['业务员1', '业务员2'],
            'assessor|+1': ['审核员1', '审核员2'],
            'payNo|+1': ['支付流水号1', '支付流水号2'],
            'payTime|+1': ['支付时间1', '支付时间2'],
            'payAmount|+1': ['支付金额1', '支付金额2'],
            'payMethod|+1': ['支付方式1', '支付方式2'],
            'collectAccount|+1': ['收款账户1', '收款账户2'],
            'payStatus|+1': ['支付状态1', '支付状态2'],
            'remark|+1': ['备注1', '备注2'],
            'isReject|+1': [false, true],
          },
        ],
        'operaRecord|1-3': [
          {
            'id|+1': 111,
            'action|+1': ['业务员1', '业务员2'],
            'operaTime|+1': ['操作时间1', '操作时间2'],
            'actionNote|+1': ['操作动作1', '操作动作2'],
          },
        ],
      }),
    },
  },
  'GET /sale/order-group/delete': {
    $desc: '删除总单',
    $params: {
      id: {
        desc: '订单id',
        exp: '123',
      },
    },
    $body: {
      code: 0,
      msg: 'success',
      data: mockjs.mock({
        'totalOrderStatus|1': [0, 1, 2],
      }),
    },
  },
  'GET /sale/order-group/cancel': {
    $desc: '作废总单',
    $params: {
      id: {
        desc: '订单id',
        exp: '123',
      },
    },
    $body: {
      code: 0,
      msg: 'success',
      data: mockjs.mock({
        'totalOrderStatus|1': [0, 1, 2],
      }),
    },
  },
  'GET /sale/order-group/finance-check': {
    $desc: '财务审核总单',
    $params: {
      id: {
        desc: '订单id',
        exp: '123',
      },
      pass: {
        desc: '是否审核通过',
        exp: 'true=>通过, false=>驳回',
      },
    },
    $body: {
      code: 0,
      msg: 'success',
      data: mockjs.mock({
        'totalOrderStatus|1': [0, 1, 2],
      }),
    },
  },
  'GET /sale/order-group/manager-check': {
    $desc: '主管审核总单',
    $params: {
      id: {
        desc: '订单id',
        exp: '123',
      },
      pass: {
        desc: '是否审核通过',
        exp: 'true=>通过, false=>驳回',
      },
    },
    $body: {
      code: 0,
      msg: 'success',
      data: mockjs.mock({
        'totalOrderStatus|1': [0, 1, 2],
      }),
    },
  },
  'POST /finance/financial-common/cancel-sales-bill': {
    $desc: '作废收款信息',
    $params: {
      id: {
        desc: '收款信息id',
        exp: '123',
      },
      type: {
        desc: '收款信息类别',
        exp: 'credit',
      },
    },
    $body: {
      code: 0,
      msg: 'success',
    },
  },
  'POST /finance/financial-common/delete-sales-bill': {
    $desc: '删除收款信息',
    $params: {
      id: {
        desc: '收款信息id',
        exp: '123',
      },
      type: {
        desc: '收款信息类别',
        exp: 'credit',
      },
    },
    $body: {
      code: 0,
      msg: 'success',
    },
  },
};
// 销售管理 --- 销售订单详情 --- 结束

// 销售管理 --- 售后单列表 --- 开始
const afterSaleOrderList = {
  'GET /sale/back-order/config': {
    $desc: '获取售后单配置项',
    $body: {
      code: 0,
      data: mockjs.mock({
        checkStatusMap: {
          0: '待退单审核',
          1: '待收货确认',
          2: '待退款确认',
          3: '未完成',
          4: '已完成',
          5: '已作废',
        },
        orderTypeMap: {
          0: '挂账单',
          1: '退货单',
          2: '退款单',
        },
        refundTypeMap: {
          0: '余额挂账',
          1: '账期回款',
          2: '原路径退回',
        },
      }),
    },
  },
  'GET /sale/back-order/list': {
    $desc: '拉取售后单列表',
    $params: {
      curPage: {
        desc: '页码',
        exp: '1',
      },
      pageSize: {
        desc: '每页条数',
        exp: '10',
      },
      checkStatus: {
        desc: '售后单状态(-1=>全部)',
        exp: '-1',
      },
      orderType: {
        desc: '售后单类型(-1=>全部)',
        exp: '-1',
      },
      startDate: {
        desc: '开始时间',
        exp: '2018-01-19',
      },
      endDate: {
        desc: '结束时间',
        exp: '2018-02-19',
      },
      orderSn: {
        desc: '单号',
        exp: '21343255436',
      },
      customer: {
        desc: '用户、手机号码',
        exp: '金三胖、119',
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'total|1': [100, 200, 300],
        'orderList|1-10': [
          {
            'id|+1': 100,
            'checkStatus|1': [0, 1, 2, 3],
            // 'orderType|1': [0, 1, 2, 3],
            'orderSn|1': [
              '关联单号JDSJ54546545',
              '关联单号SDDdsf545556',
              '关联单号dytr4845445DFS',
            ],
            'backOrderSn|1': ['退单号111', '退单号222'],
            backAmount: '退款金额',
            'amount|1': [111, 222, 333],
            'customer|1': ['客户名1', '客户名2', '客户名3'],
            createTime: '制单时间',
            'isReject|1': [true, false],
            'remark|1': ['备注1', '备注2'],
            'goodsList|1-10': [
              {
                'id|+1': 103,
                goodsThumb: '缩略图',
                goodsName: '商品名称',
                goodsSn: '商品编码',
                'unit|1': ['单位', '单位2'],
                'price|1': ['单价(22)', '单价(25)', '单价(32)', '单价(12)'],
                'number|1': ['数量12', '数量23', '数量42', '数量13'],
                'subTotal|1': ['小计12', '小计34', '小计36', '小计31'],
                'remark|1': ['备注12', '备注34', '备注36', '备注31'],
              },
            ],
            'backOrderSn|1': ['退单号111', '退单号222'],
            'amount|1': [111, 222, 333],
            'customer|1': ['客户名1', '客户名2', '客户名3'],
            createTime: '制单时间',
            'isReject|1': [true, false],
            'remark|1': ['备注1', '备注2'],
            'goodsList|1-10': [
              {
                'id|+1': 103,
                goodsThumb: '缩略图',
                goodsName: '商品名称',
                goodsSn: '商品编码',
                'unit|1': ['单位', '单位2'],
                'price|1': ['单价(22)', '单价(25)', '单价(32)', '单价(12)'],
                'number|1': ['数量12', '数量23', '数量42', '数量13'],
                'subTotal|1': ['小计12', '小计34', '小计36', '小计31'],
                'remark|1': ['备注12', '备注34', '备注36', '备注31'],
              },
            ],
          },
        ],
      }),
    },
  },
  'POST /common/export-back-order-all': {
    $desc: '导出全部售后单列表',
    $params: {
      checkStatus: {
        desc: '售后单状态(-1=>全部)',
        exp: '-1',
      },
      orderType: {
        desc: '售后单类型(-1=>全部)',
        exp: '-1',
      },
      startDate: {
        desc: '开始时间',
        exp: '2018-01-19',
      },
      endDate: {
        desc: '结束时间',
        exp: '2018-02-19',
      },
      orderSn: {
        desc: '单号',
        exp: '21343255436',
      },
      customer: {
        desc: '用户、手机号码',
        exp: '金三胖、119',
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /common/export-back-order': {
    $desc: '导出部分选中售后单列表',
    $params: {
      orderListId: {
        desc: '售后单id数组',
        exp: '[2122,21323,1232,123,1232]',
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
};
// 销售管理 --- 售后单列表 --- 结束

// 销售管理 --- 新建/修改售后单 --- 开始
const afterSaleOrderAdd = {
  'GET /sale/back-order/config': {
    $desc: '拉取新建售后单挂账退款配置项',
    $body: {
      code: 0,
      data: mockjs.mock({
        checkStatusMap: {
          0: '待退单审核',
          1: '待收货确认',
          2: '待退款确认',
          3: '未完成',
          4: '已完成',
          5: '已作废',
        },
        orderTypeMap: {
          0: '挂账单',
          1: '退货单',
          2: '退款单',
        },
        refundTypeMap: {
          0: '余额挂账',
          1: '账期回款',
          2: '原路径退回',
        },
      }),
    },
  },
  'GET /sale/order-group/suggest-by-group-sn': {
    $desc: '总单号suggest',
    $params: {
      keywords: {
        desc: '搜索关键字',
        exp: 'xx火星文xx',
      },
      status: {
        desc: '付款状态',
        exp: '[1，2，3，5]',
      },
    },
    $body: mockjs.mock({
      code: 0,
      data: mockjs.mock({
        'orderList|1-10': [
          {
            'id|+1': 115,
            'orderSn|1': ['总单号', '总单号1', '总单号2'],
            'customer|1': ['客户1', '客户2', '客户3'],
            'userId|+1': 1011,
            'mobile|1': ['手机号1', '手机号12', '手机号2'],
            'saler|1': ['业务员1', '业务员2', '业务员3'],
          },
        ],
      }),
    }),
  },
  'GET /sale/order-group/goods-list': {
    $desc: '获取退货列表',
    $params: {
      orderId: {
        desc: '订单id',
        exp: '1',
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'returnGoodsList|1-10': [
          {
            'orderGoodsId|+1': 121,
            goodsThumb: '主图',
            goodsName: '商品名称',
            goodsSn: '商品条码',
            'unit|1': ['瓶', '罐', '个'],
            'price|1': [12, 23, 21, 212, 21],
            'restNumber|1': ['剩余可退数1', '剩余可退数2', '剩余可退数3'],
            'subtotal|1': [123, 32, 3434, 343],
          },
        ],
      }),
    },
  },
  'GET /sale/user/refund-info': {
    $desc: '拉取退款信息',
    $params: {
      userId: {
        desc: '订单id',
        exp: '1',
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        refundInfo: {
          'id|+1': 118,
          content: '兽人，这就是你想要的契约卷轴',
        },
      }),
    },
  },
  'POST /sale/back-order/create-by-user': {
    $desc: '提交新建售后单',
    $params: {
      orderId: {
        desc: '客户订单id',
        exp: '1',
      },
      isReturn: {
        desc: '是否退货',
        exp: '1|是, 0|否',
      },
      goodsList: {
        desc: '退货商品信息',
        exp: '[{orderGoodsId: 商品ID, backNumber: 退货数量}]',
      },
      specialPrice: {
        desc: '协商退货金额',
        exp: '12231',
      },
      isSpecial: {
        desc: '是否协商退货金额',
        exp: '0|否, 1|是',
      },
      refundType: {
        desc: '退款方式',
        exp: '0|1|2',
      },
      refundInfo: {
        desc: '退款信息',
        exp: 'xxxx我怕是火星文哦xxxx',
      },
      remark: {
        desc: '备注',
        exp: 'xxxxxxxx',
      },
    },
    $body: {
      code: 0,
      data: {
        id: '123',
      },
    },
  },
  'GET /sale/back-order/detail': {
    $desc: '根据售后单id拉取售后单信息',
    $params: {
      backOrderId: {
        desc: '售后单id',
        exp: '12313',
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'id|+1': 115,
        'orderSn|1': ['总单号', '总单号1', '总单号2'],
        'customer|1': ['客户1', '客户2', '客户3'],
        'mobile|1': ['手机号1', '手机号12', '手机号2'],
        'saler|1': ['业务员1', '业务员2', '业务员3'],
        'isReturn|1': [1, 0],
        specialPrice: 10,
        isSpecial: 1,
        refundType: 1,
        refundInfo: 'qwewwee',
        remark: 'xx',
      }),
    },
  },
  'POST /sale/back-order/update-by-user': {
    $desc: '提交修改后的售后单信息',
    $params: {
      backOrderId: {
        desc: '售后单ID',
        exp: '1',
      },
      isReturn: {
        desc: '是否退货',
        exp: '1|0',
      },
      goodsList: {
        desc: '退货商品信息',
        exp: '[{orderGoodsId: 商品ID, backNumber: 退货数量}]',
      },
      specialPrice: {
        desc: '协商退货金额',
        exp: '12231',
      },
      isSpecial: {
        desc: '是否协商退货金额',
        exp: '0|1',
      },
      refundType: {
        desc: '退款方式',
        exp: '0|1|2',
      },
      refundInfo: {
        desc: '退款信息',
        exp: 'xxxx我怕是火星文哦xxxx',
      },
      remark: {
        desc: '备注',
        exp: 'xxxxxxxx',
      },
    },
    $body: {
      code: 0,
      data: {
        id: '123',
      },
    },
  },
};
// 销售管理 --- 新建/修改售后单 --- 结束

// 销售管理 --- 售后单详情 --- 开始
const afterSaleOrderDetail = {
  'GET /sale/refund/get-config': {
    $desc: '拉取配置项',
    $body: {
      code: 0,
      data: {
        // orderStatusMap: {
        //   0: '订单状态1',
        //   1: '订单状态2',
        //   2: '订单状态3',
        //   3: '订单状态4',
        // },
        withholdAccountMap: {
          0: '退款账户1',
          1: '退款账户2',
          2: '退款账户3',
          3: '退款账户4',
        },
        // refundToMap: {
        //   0: '退款到1',
        //   1: '退款到2',
        //   2: '退款到3',
        //   3: '退款到4',
        // },
      },
    },
  },
  'POST /sale/back-order/delete': {
    $desc: '删除售后单',
    $params: {
      id: {
        desc: '退款单id',
        exp: '12',
      },
    },
    $body: {
      code: 0,
    },
  },
  'POST /sale/back-order/cancel': {
    $desc: '作废售后单',
    $params: {
      id: {
        desc: '退款单id',
        exp: '12',
      },
    },
    $body: {
      code: 0,
    },
  },
  'POST /sale/back-order/manage-check': {
    $desc: '主管操作',
    $params: {
      id: {
        desc: '退款单id',
        exp: '12',
      },
      pass: {
        desc: '是驳回还是通过(1=>通过, 0=>驳回)',
        exp: '1',
      },
    },
    $body: {
      code: 0,
    },
  },
  'POST /sale/back-order/depot-check': {
    $desc: '仓库操作',
    $params: {
      id: {
        desc: '退款单id',
        exp: '12',
      },
      pass: {
        desc: '是驳回还是通过(1=>通过, 0=>驳回)',
        exp: '0',
      },
    },
    $body: {
      code: 0,
    },
  },
  'POST /sale/back-order/finance-check': {
    $desc: '财务操作',
    $params: {
      id: {
        desc: '退款单id',
        exp: '12',
      },
      pass: {
        desc: '是驳回还是通过(1=>通过, 0=>驳回)',
        exp: '1',
      },
    },
    $body: {
      code: 0,
    },
  },
  'POST /sale/refund/add': {
    $desc: '添加退款记录',
    $params: {
      backOrderId: {
        desc: '退款id',
        exp: 1,
      },
      withholdAccount: {
        desc: '退款账户',
        exp: 1,
      },
      refundTo: {
        desc: '退款到的地方',
        exp: 2,
      },
      payAmount: {
        desc: '付款金额',
        exp: '1110.11',
      },
      receivableName: {
        desc: '收款姓名',
        exp: '王女士',
      },
      receivableBank: {
        desc: '收款方银行',
        exp: '中国建设银行',
      },
      receivableCard: {
        desc: '收款方卡号',
        exp: '6017728819928837',
      },
      payDate: {
        desc: '付款时间',
        exp: '2017-10-10',
      },
      remark: {
        desc: '备注',
        exp: '13123',
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({}),
    },
  },
  'GET /sale/back-order/info': {
    $desc: '获取售后单详情',
    $params: {
      id: {
        desc: '售后单id',
        exp: '123',
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'canBossCheck|1': [true, false],
        'canFinanceCheck|1': [true, false],
        'canDepotCheck|1': [true, false],
        'canBossReject|1': [false, true],
        'canFinanceReject|1': [false, true],
        'canDepotReject|1': [false, true],
        'canCancel|1': [false, true],
        'canDelete|1': [false, true],
        'canEdit|1': [false, true],
        'checkStatus|1': ['审核状态(待退)', '审核状态(待审核)'],
        'isReturn|1': [1, 0],
        'isReject|1': [false, true],
        backOrderSn: '退单号(123123)',
        orderSn: {
          id: 123,
          sn: '关联销售单(3123123123)',
        },
        customer: '客户(帅哥森)',
        'orderStatus|1': ['订单状态(待退)', '订单状态(待审核)'],
        mobile: '手机号(13712341234)',
        saler: '业务员(某某饭)',
        'goodsList|1-5': [
          {
            'recId|+1': 300,
            goodsThumb: '缩略图(http://xxxxxx)',
            goodsName: '商品名(美迪惠尔)',
            goodsSn: '商品条形码(3221)',
            unit: '单位(罐)',
            price: '单价(123.20)',
            // restNumber: '剩余可退数量(123)',
            subtotal: '1',
            backNumber: '1',
            backSubtotal: '1',
            remark: '备注(123)',
          },
        ],
        'isSpecial|1': [false, true],
        specialPrice: '特批退款金额(321)',
        'refundType|1': [1, 2, 3],
        // refundPrice: '应退总额(312)',
        refundInfoContent:
          '退款信息(退款人：某某饭 手机号码：13712341232 开户名称：某某饭 开户银行：建设银行宝安分行)',
        remark: '备注(hello world)',
        'operationList|1-5': [
          {
            'id|+1': 300,
            user: '操作员(某个人)',
            time: '操作时间(2017-10-10)',
            content: '操作内容(修改了订单)',
          },
        ],
        refundInfo: {
          refundAmount: '退款金额(123)',
          refundedAmount: '已退金额(321)',
          awaitRefundAmount: '待退金额(444)',
        },
        'refundStream|1-1': [
          {
            streamId: 1,
            time: '2017-10-10',
            amount: '金额(333)',
            payeeAccount: '收款方账户(321)',
            payeeName: '收款方名(shuaishuai)',
            financialAccount: '扣款账户(xxxx)',
            remark: '备注(123123)',
            'isCancel|1': [false, true],
          },
        ],
      }),
    },
  },
  'POST /sale/refund/delete': {
    $desc: '删除退款流水',
    $params: {
      backOrderId: {
        desc: '售后单id',
        exp: 12,
      },
      refundType: {
        desc: '退款流水类型',
        exp: 'cash',
      },
      refundId: {
        desc: '退款流水id',
        exp: '12',
      },
    },
    $body: {
      code: 0,
    },
  },
  'POST /sale/refund/cancel': {
    $desc: '作废退款流水',
    $params: {
      backOrderId: {
        desc: '售后单id',
        exp: 12,
      },
      refundType: {
        desc: '退款流水类型',
        exp: 'cash',
      },
      refundId: {
        desc: '退款流水id',
        exp: '12',
      },
    },
    $body: {
      code: 0,
    },
  },
};
// 销售管理 --- 售后单详情 --- 结束

// 销售管理 --- 商品统计列表 --- 开始
const goodsStatisticsList = {
  'GET /sale/goods/config': {
    $desc: '获取配置项',
    $params: {},
    $body: {
      code: 0,
      data: {
        checkStatusMap: {
          0: '审核状态1',
          1: '审核状态2',
          2: '审核状态3',
          3: '审核状态4',
        },
        payStatusMap: {
          0: '支付状态1',
          1: '支付状态2',
          2: '支付状态3',
          3: '支付状态4',
        },
        goodsTypeMap: {
          0: '商品类型1',
          1: '商品类型2',
          2: '商品类型3',
          3: '商品类型4',
        },
      },
    },
  },
  'GET /sale/goods/order-goods-list': {
    $desc: '拉取商品数据',
    $params: {
      curPage: {
        desc: '页码',
        exp: '1',
      },
      pageSize: {
        desc: '每页条数',
        exp: '10',
      },
      selectCheckStatus: {
        desc: '订单审核状态',
        exp: '[5,6]',
      },
      selectPayStatus: {
        desc: '支付状态',
        exp: '[3,4]',
      },
      selectGoodsType: {
        desc: '商品状态',
        exp: '[1,2]',
      },
      startDate: {
        desc: '开始时间',
        exp: '2017-10-10',
      },
      endDate: {
        desc: '结束时间',
        exp: '2017-10-15',
      },
      goods: {
        desc: '商品信息关键字',
        exp: '美迪惠尔',
      },
      mobile: {
        desc: '下单用户手机',
        exp: '13556215779',
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        total: 1000,
        'orderTotalNumber|1': ['订单总数(123)', '订单总数(123)'],
        'goodsTotalNumber|1': ['商品总数(123)', '商品总数(123)'],
        'totalAmount|1': ['总金额(333)', '总金额(444)'],
        'goodsList|1-10': [
          {
            'id|1': 200,
            'orderId|1': 100,
            'checkStatus|1': [1, 2, 3, 4],
            customer: '用户名(帅哥森)',
            orderSn: '订单号(123)',
            goodsSn: '商品条形码(123)',
            goodsName: '商品名称(美迪惠尔)',
            price: '单价(12.12)',
            unit: '单位(罐)',
            goodsNumber: '商品数量(123)',
            subtotal: '小计(222)',
            'isSpecial|1': [true, false],
          },
        ],
      }),
    },
  },
  'GET /goodsStatisticsList/export-goods-statistics-list': {
    $desc: '导出订单列表',
    $params: {
      selectCheckStatus: {
        desc: '订单审核状态',
        exp: '[5,6]',
      },
      selectPayStatus: {
        desc: '支付状态',
        exp: '[3,4]',
      },
      selectGoodsType: {
        desc: '商品状态',
        exp: '[1,2]',
      },
      startDate: {
        desc: '开始时间',
        exp: '2017-10-10',
      },
      endDate: {
        desc: '结束时间',
        exp: '2017-10-15',
      },
      goods: {
        desc: '商品信息关键字',
        exp: '美迪惠尔',
      },
      mobile: {
        desc: '下单用户手机',
        exp: '13556215779',
      },
    },
    $body: {
      code: 0,
    },
  },
};
// 销售管理 --- 商品统计列表 --- 结束

// xxx管理 --- 客户资金管理列表 --- 开始
const customerFundList = {
  'GET /finance/sales-credit-bill/get-all-account-finance': {
    $desc: '拉取总用户资金',
    $body: {
      code: 0,
      data: mockjs.mock({
        balanceCustomerNum: '挂账总人数(222)',
        balanceTotalAmount: '挂账总金额(333)',
        creditCustomerNum: '账期总人数(444)',
        creditTotalAmount: '账期总金额(555)',
      }),
    },
  },
  'GET /sale/user/list': {
    $desc: '获取筛选客户',
    $params: {
      currentPage: {
        desc: '第几页',
        exp: 1,
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
        'users|10': [
          {
            'userId|+1': 103,
            'level|+1': 100,
            'userNo|1': ['user1', 'user12', 'user13'],
            'userName|1': ['金三胖', '金日成', '金正日', '金刚葫芦娃'],
            'mobilePhone|1': ['13277896544', '16457894621', '14635214569'],
            'address|1': ['火星', '金星', '赛亚星球'],
          },
        ],
      }),
    },
  },
  'GET /finance/sales-credit-bill/get-account-finance-list': {
    $desc: '拉取用户资金列表',
    $params: {
      userId: {
        desc: '用户id',
        exp: '1',
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'accountList|1-10': [
          {
            'id|+1': 933,
            'customer|1': ['用户名(帅哥)', '用户名(帅哥2)'],
            'creditAmount|1': ['账期金额(111)', '账期金额(222)'],
            'balanceAmount|1': ['挂账金额(111)', '挂账金额(222)'],
            'amount|1': ['应收金额(222)', '应收金额(33)'],
          },
        ],
      }),
    },
  },
};
// xxx管理 --- 客户资金管理列表 --- 结束

// xxx管理 --- 客户资金详情 --- 开始
const customerFundDetail = {
  'GET /sale/funds-detail/get-config': {
    $desc: '拉取客户资金详情的配置项',
    $body: {
      code: 0,
      data: {
        fundsTypeMap: {
          0: '第一类型',
          1: '第二类型',
          2: '第三类型',
          3: '第四类型',
        },
        receivableAccountMap: {
          0: '第一收账账户',
          1: '第二收账账户',
          2: '第三收账账户',
          3: '第四收账账户',
        },
      },
    },
  },
  'GET /sale/funds-detail/get-customer-info': {
    $desc: '拉取用户资金信息',
    $params: {
      userId: {
        desc: '用户id',
        exp: '1',
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'customer|1': ['用户名(帅哥)', '用户名(帅哥2)'],
        'payableAmount|1': ['11123232323', '2223223'],
        'receivableAmount|1': ['1221322', '33323233'],
      }),
    },
  },
  'GET /sale/funds-detail/get-finance-detail': {
    $desc: '获取资金明细',
    $params: {
      userId: {
        desc: '用户id',
        exp: '1',
      },
      startDate: {
        desc: '开始时间',
        exp: '2017-10-10',
      },
      endDate: {
        desc: '结束时间',
        exp: '2017-10-10',
      },
      fundsType: {
        desc: '类型',
        exp: '1',
      },
    },
    // payAmount,
    $body: {
      code: 0,
      data: mockjs.mock({
        'streamList|1-10': [
          {
            'id|+1': 200,
            'time|1': ['2018-01-08 09:53:57', '2018-01-08 10:10:10'],
            'amount|1': [1000, 2000, 3000],
            'type|1': [0, 1, 2, 3],
            'orderSn|1': ['DH-O-20180108-020725', 'DH-O-20180108-1111'],
            'transactionSn|1': ['流水号(123123231)', '流水号(123123123)'],
            'remark|1': ['备注(123123)', '备注(我爱你,我的家)'],
          },
        ],
      }),
    },
  },
  'POST /sale/funds-detail/add-received-record': {
    $desc: '添加收款记录',
    $params: {
      userId: {
        desc: '用户id',
        exp: '1',
      },
      amount: {
        desc: '付款金额',
        exp: '123.33',
      },
      receivableAccount: {
        desc: '收款账户',
        exp: '1',
      },
      remark: {
        desc: '订单备注',
        exp: 'xxxxx',
      },
    },
    $body: {
      code: 0,
    },
  },
  'POST /sale/funds-detail/add-pay-record': {
    $desc: '添加付款记录',
    $params: {
      userId: {
        desc: '用户id',
        exp: '1',
      },
      amount: {
        desc: '付款金额',
        exp: '123.33',
      },
      receivableAccount: {
        desc: '收款账户',
        exp: '1',
      },
      remark: {
        desc: '订单备注',
        exp: 'xxxxx',
      },
    },
    $body: {
      code: 0,
    },
  },
};
// xxx管理 --- 客户资金详情 --- 结束
export {
  saleAwaitOutStoreOrderList,
  salePushOrderList,
  outStoreAdd,
  saleOrderAdd,
  saleOrderList,
  saleOrderDetail,
  afterSaleOrderList,
  afterSaleOrderAdd,
  afterSaleOrderDetail,
  goodsStatisticsList,
  customerFundList,
  customerFundDetail,
};
