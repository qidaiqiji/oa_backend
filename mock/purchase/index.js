import mockjs from 'mockjs';
// 订单列表 --- 开始
const purchaseOrderList = {
  'GET /purchase/purchase-order/list': {
    $desc: '获取采购订单列表',
    $params: {
      page: {
        desc: '分页',
        exp: 2,
      },
      size: {
        desc: '数目',
        exp: 10,
      },
      // supplierId: {
      //   desc: '供应商id',
      //   exp: 1
      // },
      type: {
        desc: '搜索采购订单类别, 0|全部, 1|常规采购单, 2|销售采购单',
        exp: '0',
      },
      status: {
        desc:
          '搜索的采购订单状态, 0|全部 1|待提交审核, 2|待审核, 3|待申请货款, 4|待审核货款申请, 5|待供应商发货, 6|待收货, 7|全部入库, 8|已完成, 9|主管驳回, 10|财务驳回',
        exp: '0',
      },
    },
    $body: {
      code: 0,
      msg: '请求有问题',
      data: mockjs.mock({
        'total|1': [100, 200, 300, 400],
        'table|5-10': [
          {
            'id|123.10': 1.123,
            'no|1': ['cexu022881', 'cexxajj1989283', '0202987991002'],
            'supplier|+1': [
              '丽得姿供应商',
              '美迪惠尔供应商',
              '帅气供应商',
              '霸道供应商',
            ],
            saleMarketPrice: 100,
            salePrice: 200,
            saleDiscount: 5,
            purchasePrice: 200,
            purchaseDiscount: 3,
            'money|1000-999999.1-2': 1,
            'type|+1': ['sell', 'common'],
            'author|+1': ['CICI', 'EE', 'Amy', '销售'],
            'purchaser|+1': ['CICI', 'EE', 'Amy'],
            time: '2017-10-10 11:12',
            'status|+1': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            'remark|1-20': '★',
          },
        ],
      }),
    },
  },
  'GET /purchase/purchase-supplier-info/suggest': {
    $desc: '搜索供应商',
    $params: {
      text: {
        desc: '搜索文案',
        exp: '丽得姿',
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'supplierSuggest|1-10': [
          {
            'id|+1': 1000,
            'text|1': ['陈冠希', '吴彦祖', '梁朝伟', '陈奕迅', '张学友'],
          },
        ],
      }),
    },
  },
  'POST /purchase/purchase-order/cancel': {
    $desc: '删除订单',
    $params: {
      id: {
        desc: '要删除的订单id',
        exp: 123,
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /purchase/purchase-order/verify': {
    $desc: '审核订单(通过/驳回)',
    $params: {
      id: {
        desc: '要审核的订单id',
        exp: 123,
      },
      status: {
        desc: '要达到的订单状态, 3|通过, 11|驳回',
        exp: 3,
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  /*
  'GET /api/getMoney': {
    $desc: '获取申请货款的钱',
    $params: {
      ids: {
        desc: '要申请货款的订单id',
        exp: '[1,2,3,4,5]'
      }
    },
    $body: {
      code: 0,
      data: {
        money: '120,500.01'
      }
    }
  },
  'POST /api/applyMoney': {
    $desc: '申请货款',
    $params: {
      ids: {
        desc: '要申请货款的订单id',
        exp: '[1,2,3,4,5]'
      }
    },
    $body: {
      code: 0,
      data: {}
    }
  },
  */
};
// 采购订单列表 --- 结束

// 新增/修改普通采购订单 --- 开始
const commonPurchaseOrderAdd = {
  'GET /purchase/purchase-order/detail ': {
    $desc: '获取已创建的订单信息',
    $params: {
      purchaseOrderId: {
        desc: '订单id',
        exp: 123,
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        // 'supplierId': 10.21,
        // 'suppliers|1-10': [
        //   {
        //     'id|+1': 10.21,
        //     'name|+1': [
        //       '华北',
        //       '华南',
        //       '华东',
        //       '华中'
        //     ]
        //   }
        // ],
        province: 123,
        city: 123,
        region: 321,
        detailAddress: '某地',
        date: '2017-10-10 11:11',
        'orderNo|1': ['xxxxx', 'zzzzz', 'aaaaa'],
        'remark|1': ['备注1', '备注2', '备注3'],
        'purchaser|1': ['采购员1', '采购员2', '采购员3'],
        'author|1': ['制单员1', '制单员2', '制单员3'],
        'otherMoney|1': [123, 321, 444.23],
        'goodsInfos|1-5': [
          {
            'id|+1': 200,
            'inWayNum|+1': 100,
            'imNum|+1': 100,
            'canUseNum|+1': 100,
            'goodsId|+1': 123.123,
            'purchaseNum|+1': 10,
            'purchasePrice|+1': 12.5,
            'goodsNo|1': ['ces1', 'ces12', 'ces13'],
            'goodsName|1': ['面膜1', '面膜2', '香水1', '香水2'],
            'unit|1': ['个', '瓶', '罐'],
          },
        ],
      }),
    },
  },
  'GET /api/getAddressOptions': {
    $desc: '获取地址配置项',
    $params: {},
    $body: {
      code: 0,
      data: mockjs.mock({
        'addressOptions|1-3': [
          {
            'value|+1': 123,
            'label|+1': ['广东省', '江西省', '广西省'],
            'children|1-3': [
              {
                'value|+1': 1234,
                'label|+1': ['惠州市', '深圳市', '赣州市', '桂林市'],
                'children|1-3': [
                  {
                    'value|+1': 1235,
                    'label|+1': ['宝安区', '罗湖区', '大亚湾区'],
                  },
                ],
              },
            ],
          },
        ],
      }),
      msg: 'xxx',
    },
  },
  'GET /purchase/purchase-order/goods-list': {
    // $desc: "根据供应商获取商品",
    $desc: '获取全部商品',
    $params: {
      // supplierId: {
      //   desc: '供应商id',
      //   exp: 100
      // }
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'goods|1-20': [
          {
            'inWayNum|+1': 100,
            'imNum|+1': 100,
            'canUseNum|+1': 100,
            'goodsId|+1': 123.123,
            'goodsNo|1': ['ces1', 'ces12', 'ces13'],
            'goodsName|1': ['面膜1', '面膜2', '香水1', '香水2'],
            'unit|1': ['个', '瓶', '罐'],
          },
        ],
      }),
    },
  },
  'POST /purchase/purchase-order/create-by-buyer': {
    $desc: '保存订单',
    $params: {
      orderId: {
        desc: '订单id(如果是修改订单才会有这个值)|可选',
        exp: 321,
      },
      // supplierId: {
      //   desc: '供应商id',
      //   exp: 123
      // },
      orderNo: {
        desc: '订单号',
        exp: 'cessdad1',
      },
      remark: {
        desc: '备注',
        exp: '这是大单!!!速批',
      },
      purchaser: {
        desc: '采购员',
        exp: 'dd',
      },
      author: {
        desc: '制单员',
        exp: 'aa',
      },
      otherMoney: {
        desc: '其他金额',
        exp: 123.11,
      },
      goodsInfos: {
        desc: '订单货物信息表, 对象数组',
        exp: '[{id:1, goodsId: 1,purchaseNum: 1,purchasePrice: 321.22,}]',
      },
      detailAddress: {
        desc: '收货地址',
        exp: '广东省深圳市宝安xxxxxx',
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /purchase/purchase-order/delete-goods': {
    $desc: '修改订单时, 删除商品',
    $params: {
      id: {
        desc: '要删除的行id',
        exp: 123,
      },
    },
    $body: {
      code: 0,
      msg: '删除成功',
    },
  },
};
// 新增/修改普通采购订单 --- 结束

// 普通采购订单详情 --- 开始
const commonPurchaseOrderDetail = {
  'POST /purchase/purchase-order/import-depot-order-list': {
    $desc: '获取入库单信息',
    $params: {
      data: {
        exp: '{purchaseOrderId: 1}',
      },
    },
    $body: {
      code: 0,
      msg: '获取成功',
      data: [],
    },
  },
  'POST /depot/purchase-import-depot-order/add': {
    $desc: '生成入库单',
    $params: {
      orderId: {
        desc: '所属订单id',
        exp: 123,
      },
      genInfo: {
        desc: '生成入库单的信息',
        exp:
          '{remark:"备注", handler:"经办人", date:"2017-10-10 11:11", storeNo:"入库单号", goods:[{goodsId:1,nowStoreNum:12}]}',
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /depot/purchase-import-depot-order/push-to-depot': {
    $desc: '推送待入库单',
    $params: {
      orderId: {
        desc: '订单id',
        exp: 123,
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /depot/purchase-import-depot-order/cancel': {
    $desc: '作废待入库单',
    $params: {
      orderId: {
        desc: '订单id',
        exp: 321,
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
};
// 普通采购订单详情 --- 结束

// 待销售采购订单列表 --- 开始
const awaitSalePurchaseOrderList = {
  'GET /sale/user/purchaser-list': {
    $desc: '拉取待销售采购订单列表的配置项',
    $params: {
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        purchaserMap: {
          0: 'aa',
          1: 'bb',
        },
      }),
    },
  },
  'GET /sale/order-info/daifa-order': {
    $desc: '拉取销售采购订单列表',
    $params: {
      keywords: {
        desc: '输入值',
        exp: '订单号/用户名/手机号/商品名',
      },
      startDate: {
        desc: '开始时间',
        exp: '2018-01-01',
      },
      endDate: {
        desc: '结束时间',
        exp: '2018-01-06',
      },
      supplierId: {
        desc: '供应商',
        exp: '供应商ID',
      },
      purchaser: {
        desc: '采购员',
        exp: '采购员Id',
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'awaitSalePurchaseOrderList|5-10': [
          {
            'id|+1': 100,
            'consignee|1': [
              '收件人1',
              '收件人B',
              '收件人C',
            ],
            'orderSn|1': [
              '订单号1',
              '订单号B',
              '订单号C',
            ],
            'goodsList|3-5': [
              {
                'id|+1': 500,
                'supplierList|+1': [
                  [],
                  [
                    {
                      id: 1,
                      name: '供应商1',
                    },
                  ],
                  [
                    {
                      id: 3,
                      name: '供应商5',
                      isSelect: 0,
                    },
                    {
                      id: 5,
                      name: '供应商9',
                      isSelect: 1,
                    },
                  ],
                ],
                'name|1': [
                  '商品1',
                  '商品2',
                ],
                'sn|1': [
                  '条码1',
                  '条码2',
                ],
                'shippingDesc|1': ['包邮', '到付'],
                'isTax|1': [0, 1],
                purchaser: 'EE(2018/05/12 15:09)',
                purchasePrice: 11256.32,
                purchaseAmount: 562333.33,
                num: 30,
                time: '2018/03/01 15:09',
                remark: '备注',
              },
            ],
          },
        ],
      }),
    },
  },
  'GET /awaitSalePurchaseOrderList/export-awaitSalePurchaseOrderList': {
    $desc: '导出销售采购订单列表',
    $params: {
      keywords: {
        desc: '输入值',
        exp: '订单号/用户名/手机号/商品名',
      },
      startDate: {
        desc: '开始时间',
        exp: '2018-01-01',
      },
      endDate: {
        desc: '结束时间',
        exp: '2018-01-06',
      },
      supplierId: {
        desc: '供应商',
        exp: '供应商ID',
      },
    },
    $body: {
      code: 0,
    },
  },
  'POST /sale/order-info/assign-supplier': {
    $desc: '分配供应商',
    $params: {
      supplierId: {
        desc: '供应商id',
        exp: '供应商ID',
      },
      goodsId: {
        desc: '商品ID',
        exp: '商品ID',
      },
    },
    $body: {
      code: 0,
    },
  },
  'POST /sale/order-info/assign-purchaser': {
    $desc: '分配采购员',
    $params: {
      purchaserId: {
        desc: '采购员ID',
        exp: '采购员ID',
      },
      goodsIdList: {
        desc: '商品Id数组',
        exp: '[1,2,3,6,8]',
      },
    },
    $body: {
      code: 0,
    },
  },
  'POST /sale/order-info/generate-purchase-order': {
    $desc: '生成采购单',
    $params: {
      purchaserId: {
        desc: '采购员ID',
        exp: '采购员ID',
      },
      goodsIdList: {
        desc: '商品Id数组',
        exp: '[1,2,3,6,8]',
      },
    },
    $body: {
      code: 0,
    },
  },
};
// 待销售采购订单列表 --- 结束

// 销售采购订单列表 --- 开始
const salePurchaseOrderList = {
  'GET /purchase/purchase-order/config': {
    $desc: '拉取销售采购订单列表的配置项',
    $params: {
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        payTypeMap: {
          0: '采购单状态',
          1: '待主管审核',
          2: '待财务审核',
        },
      }),
    },
  },
  'POST /purchase/purchase-order/merge-pay': {
    $desc: '合并付款',
    $params: {
      ids: {
        desc: '销售采购订单Id数组',
        exp: '[1,2,3,6,8]',
      },
    },
    $body: {
      code: 0,
    },
  },
};
// 销售采购订单列表 --- 结束

// 销售采购订单详情 --- 开始
const salePurchaseOrderDetail = {
  'GET /purchase/purchase-order/sale-detail': {
    $desc: '获取销售采购订单详情',
    $params: {
      id: {
        desc: '销售采购订单id',
        exp: '1',
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        id: '销售采购订单id',
        actionList: [
          {
            name: '驳回',
            url: 'xxxx',
          },
          {
            name: '修改',
            url: 'xxxx',
          },
          {
            name: '审核',
            url: 'xxxx',
          },
        ],
        'status|1': [
          '待主管审核',
          '待财务审核',
        ],
        purchaseSn: '采购单号001',
        supplier: '供应商007',
        purchaser: '采购员002',
        date: '2018-03-02  14:10:05',
        'totalOrderGoodsList|3-7': [
          {
            'id|+1': 100,
            'goodsName|1': [
              '商品1',
              '商品2',
            ],
            'goodsSn|1': [
              '商品条码1',
              '商品条码2',
            ],
            unit: '单位/瓶',
            purchaseNum: '30',
            awaitSendNum: '21',
            alreadySendNum: '32',
            purchasePrice: '21',
            Subtotal: '323',
          },
        ],
        'subOrderList|2': [
          {
            'id|+1': 300,
            status: '未付款',
            subOrderSn: '子单号200321122',
            receiver: '收货人008',
            mobile: '12903923929',
            address: '收货地址/广东省深圳市南山科技园',
            'goodsList|2-4': [
              {
                'id|+1': 400,
                goodsName: '商品名称1',
                goodsSn: '商品条码23',
                unit: '单位/盒',
                orderNum: '43',
                outNum: '23',
                awaitOutNum: '20',
                remark: '备注',
              },
            ],
            'logisticsInfoList|1-3': [
              {
                'id|+1': 900,
                logisticsCompany: '物流公司11',
                logisticsSn: '物流单号23232',
                goodsList: [
                  {
                    id: 400,
                    outNum: '23',
                  },
                ],
              },
            ],
          },
        ],
        purchaseAmount: '344',
        alreadyPay: '23',
        awaitConfirm: '323',
        awaitPay: '545',
        'payList|1-4': [
          {
            'id|+1': 5000,
            paySn: '支付流水单号/3232',
            time: '2018-03-12 13:43:23',
            payAmount: '付款金额/233',
            payMethod: '付款方式/挂账对冲',
            receivableAccount: '收款账户/某某某',
            type: '状态',
            remark: '备注',
            purchaser: '采购员/Amy',
            auditor: '审核员/系统自动',
          },
        ],
      }),
    },
  },
  'POST /purchase/purchase-order/add-shipping-info': {
    $desc: '添加物流信息',
    $params: {
      subOrderId: {
        desc: '子单id',
        exp: '3',
      },
      logisticsCompany: {
        desc: '物流公司',
        exp: '顺丰',
      },
      logisticsSn: {
        desc: '物流单号',
        exp: '3234245342',
      },
      goodsList: {
        desc: '商品信息',
        exp: '[{id: \'商品id\', outNum: \'本次出库数\'},...]',
      },
    },
    $body: {
      code: 0,
    },
  },
  'POST /purchase/purchase-order/update-shipping-info': {
    $desc: '修改物流信息',
    $params: {
      logisticsId: {
        desc: '物流id',
        exp: '3',
      },
      logisticsCompany: {
        desc: '物流公司',
        exp: '顺丰',
      },
      logisticsSn: {
        desc: '物流单号',
        exp: '3234245342',
      },
      goodsList: {
        desc: '商品信息',
        exp: '[{id: \'商品id\', outNum: \'本次出库数\'},...]',
      },
    },
    $body: {
      code: 0,
    },
  },
  'POST /salePurchaseOrderDetail/export': {
    $desc: '销售采购订单详情---导出',
    $params: {
      id: {
        desc: '订单id',
        exp: '3',
      },
    },
    $body: {
      code: 0,
    },
  },
};
// 销售采购订单详情 --- 结束

// 采购售后单列表 --- 开始
const purchaseAfterSaleOrderList = {
  'GET /purchase/purchase-back-order/config': {
    $desc: '拉取配置项',
    $params: {},
    $body: {
      code: 0,
      data: mockjs.mock({
        orderStatusMap: {
          0: '待收货确认',
          1: '待收款确认',
        },
        orderTypeMap: {
          0: '挂账单',
          1: '退货单',
        },
        payTypeMap: {
          0: '挂账',
          1: '现款收入',
          2: '账期回款',
        },
      }),
    },
  },
  'POST /purchase/purchase-back-order/list': {
    $desc: '获取采购售后单列表信息',
    $params: {
      curPage: {
        desc: '页码',
        exp: 10,
      },
      pageSize: {
        desc: '页数',
        exp: 20,
      },
      orderStatus: {
        desc: '订单状态',
        exp: 1,
      },
      orderType: {
        desc: '订单类型',
        exp: 2,
      },
      startDate: {
        desc: '订单创建时间 -- 起始时间',
        exp: '2017-10-10',
      },
      endDate: {
        desc: '订单创建时间 -- 结束时间',
        exp: '2018-01-10',
      },
      keywords: {
        desc: '退货单号/关联单号/用户',
        exp: '帅哥',
      },
      supplierId: {
        desc: '供应商id',
        exp: 12,
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'total|1': [100, 200, 300],
        'orderList|5-10': [
          {
            'id|+1': 10,
            status: '订单状态',
            sn: '退单号',
            relatedPurchaseOrderSn: '关联采购单号',
            supplier: '供应商',
            'realMoney|1': [10, 20],
            time: '2017-10-10 10:10:10',
            'goodsList|4-10': [
              {
                'id|+1': 20,
                img: '商品主图',
                name: '商品名称',
                sn: '商品条码',
                unit: '单位',
                price: '单价',
                num: '数量',
                subtotal: '小计',
                remark: '备注',
              },
            ],
          },
        ],
      }),
    },
  },
  'GET /purchaseAfterSaleOrderList/export-all-order': {
    $desc: '导出筛选中的所有订单',
    $params: {
      orderStatus: {
        desc: '订单状态',
        exp: 1,
      },
      orderType: {
        desc: '订单类型',
        exp: 2,
      },
      startDate: {
        desc: '订单创建时间 -- 起始时间',
        exp: '2017-10-10',
      },
      endDate: {
        desc: '订单创建时间 -- 结束时间',
        exp: '2018-01-10',
      },
      keywords: {
        desc: '退货单号/关联单号/用户',
        exp: '帅哥',
      },
      supplierId: {
        desc: '供应商id',
        exp: 12,
      },
    },
  },
  'GET /purchaseAfterSaleOrderList/export-selected-order': {
    $desc: '导出选中的所有订单',
    $params: {
      orderIds: {
        desc: '订单id数组',
        exp: '[1,2,3,4]',
      },
    },
  },

};
// 采购售后单列表 --- 结束

// 新建采购售后单 --- 开始
const purchaseAfterSaleOrderEdit = {
  'GET /purchase/purchase-back-order/config': {
    $desc: '拉取采购售后单配置项',
    $body: {
      code: 0,
      data: {
        orderStatusMap: {
          0: '待收货确认',
          1: '待收款确认',
        },
        orderTypeMap: {
          0: '挂账单',
          1: '退货单',
        },
        payTypeMap: {
          0: '挂账',
          1: '现款收入',
          2: '账期回款',
        },
      },
    },
  },
  'GET /purchaseAfterSaleOrderEdit/purchase-order-suggest': {
    $desc: '获取采购单提示',
    $params: {
      keywords: {
        desc: '采购单关键字',
        exp: '19299391',
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'purchaseOrderList|2-10': [
          {
            'id|+1': 10,
            'value|1': ['采购单号1', '采购单号2', '采购单号3'],
          },
        ],
      }),
    },
  },
  'GET /purchase/purchase-order/purchase-goods-list': {
    $desc: '获取采购单下的信息',
    $params: {
      purchaseOrderId: {
        desc: '采购单id',
        exp: 10,
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        supplier: '供应商1',
        purchaser: '采购员1',
        'goodsList|1-10': [
          {
            'id|+1': 100,
            img: 'xxx',
            name: '商品名称',
            sn: '商品条码',
            unit: '单位',
            price: 10,
            restReturnNum: '剩余可退数(120)',
            subtotal: 100,
            remark: '备注',
          },
        ],
      }),
    },
  },
  'POST /purchase/purchase-back-order/add': {
    $desc: '生成采购售后单',
    $params: {
      purchaseOrderId: {
        desc: '关联采购单id',
        exp: 10,
      },
      isReturnGoods: {
        desc: '是否退货',
        exp: 'true',
      },
      goodsList: {
        desc: '商品列表',
        exp: '[{id: xxx, returnNum: 111}]',
      },
      isSpecial: {
        desc: '是否协商价',
        exp: 'true',
      },
      specialPrice: {
        desc: '协商价',
        exp: 1230,
      },
      payType: {
        desc: '收款方式',
        exp: '1',
      },
      remark: {
        desc: '制单备注',
        exp: '备注备注, 这是备注',
      },
      address: {
        desc: '地址(退货退款)',
        exp: '{province: "234", city: "247", district: "250"}',
      },
      addressDetail: {
        desc: '详细地址(退货退款)',
        exp: '西乡街道麻布新村',
      },
      mobile: {
        desc: '手机号(退货退款)',
        exp: '13662718227',
      },
      consigneeName: {
        desc: '收货人姓名(退货退款)',
        exp: '陈泽森',
      },
    },
    $body: {
      code: 0,
    },
  },
};
// 新建采购售后单 --- 结束

// 采购售后单详情 --- 开始
const purchaseAfterSaleOrderDetail = {
  'GET /purchase/purchase-back-order/detail': {
    $desc: '获取采购售后单详情',
    $params: {
      purchaseAfterSaleOrderId: {
        desc: '采购售后单id',
        exp: 12,
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        status: '订单状态',
        sn: '退单号',
        relatedPurchaseOrderSn: '关联采购单号',
        relatedPurchaseOrderStatus: '关联采购单状态',
        supplierName: '供应商名',
        purchaserName: '采购员名',
        isReturnGoods: '是否退货',
        isSpecial: '是否协商价',
        specialPrice: '协商价',
        payType: '收款方式',
        totalMoney: '总单金额',
        receiptedMoney: '已收款金额',
        awaitReceiptMoney: '待收款金额',
        remark: '制单备注',
        address: '收货地址',
        consigneeName: '收货人姓名',
        mobile: '手机号',
        actionList: [
          {
            text: '驳回',
            url: 'xxxx',
            color: '#f36',
            isNeedRemark: 1,
          },
          {
            text: '通过',
            url: 'xxxxx',
            color: '#f88',
            isNeedRemark: 0,
          },
        ],
        operaRecordList: [
          {
            'id|+1': 300,
            user: '操作员(某个人)',
            time: '操作时间(2017-10-10)',
            content: '操作内容(修改了订单)',
          },
        ],
        'goodsList|2-10': [
          {
            'id|+1': 200,
            img: 'xxx',
            name: '商品名称',
            sn: '商品条码',
            unit: '单位',
            price: '单价',
            restReturnNum: '剩余可退数',
            subtotal: '小计',
            returnNum: '退货数',
            returnMoney: '退货金额',
            remark: '备注',
          },
        ],
        'refundOrderList|1-2': [
          {
            'id|+1': 100,
            sn: '收款流水单号',
            time: '收款时间',
            money: '收款金额',
            receiptName: '收款方名称',
            receiptAccount: '收款账户',
            withholdAccount: '扣款账户',
            remark: '备注',
          },
        ],
      }),
    },
  },
  'GET /purchaseAfterSaleOrderDetail/addRefund': {
    $desc: '采购售后单详情 --- 添加支付流水',
    $params: {
      collectAccount: {
        desc: '收款账户',
        exp: '1|2|3',
      },
      collectDate: {
        desc: '收款时间',
        exp: '2017-10-10',
      },
      collectMoney: {
        desc: '收款金额',
        exp: '1000',
      },
      payAccount: {
        desc: '付款账号',
        exp: '123123123123',
      },
      purchaseBackOrderId: {
        desc: '订单id',
        exp: '4',
      },
    },
    $body: {
      code: 0,
      message: '添加成功',
    },
  },
};
// 采购售后单详情 --- 结束

// 采购管理 --- 供应商品列表 --- 开始
const supplyGoodsList = {
  'GET /purchase/purchase-supplier-goods/list': {
    $desc: '模糊搜索-供应商品列表',
    $params: {
      id: {
        desc: '供应商Id',
        exp: 123,
      },
      keywords: {
        desc: '关键字',
        exp: 123,
      },
      goodsId: {
        desc: '商品ID',
        exp: 123,
      },
      curPage: {
        desc: '第几页',
        exp: 1,
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'total|1': [100, 200, 300, 400],
        'table|5-10': [
          {
            'id|+1': 124,
            'img|1': ['商品图片1', '商品图片2'],
            'goodsName|+1': ['丽得姿', '美迪惠尔'],
            'no|1': [
              '条码/dsfxxdsssefr21123',
              '条码/dsgytthr556334324',
              '条码/455467fhgdgyjr455',
            ],
            'platformPrice|1': ['平台售价/55.33', '平台售价/23.44'],
            purchaseDiscount: 5,
            marketPrice: 1200.05,
            'supplyPrice|1': ['供应价/5.39', '供应价/3.84'],
            'unit|+1': ['单位/瓶', '单位/盒'],
            'stock|+1': ['库存/12', '库存/566', '库存/3434'],
            'remark|1-20': '★',
          },
        ],
      }),
    },
  },
  'POST /common/export-supplier-goods-list': {
    $desc: '导出-供应商品列表',
    $params: {
      id: {
        desc: '供应商ID',
        exp: 123,
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /purchase/purchase-supplier-goods/add': {
    $desc: '新增-供应商品列表',
    $params: {
      id: {
        desc: '供应商ID',
        exp: 123,
      },
      goodsInfos: {
        desc: '需要保存的商品数组',
        exp: "[{goodsId: 2,supplyPrice: '供应价'}]",
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /purchase/purchase-supplier-goods/edit': {
    $desc: '修改-供应商品列表',
    $params: {
      id: {
        desc: '供应商ID',
        exp: 123,
      },
      goodsInfos: {
        desc: '需要保存的商品数组',
        exp:
          "[{goodsId: 2,supplyPrice: '供应价',goodsRemark: '让兽人臣服我的王座'}]",
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
  'POST /purchase/purchase-supplier-goods/delete-by-user': {
    $desc: '删除-供应商品列表',
    $params: {
      id: {
        desc: '供应商ID',
        exp: 123,
      },
      goodsId: {
        desc: '要删除的商品id数组',
        exp: [123, 213, 123, 455],
      },
    },
    $body: {
      code: 0,
      data: {},
    },
  },
};
// 采购管理 --- 供应商管理列表 --- 结束

// 采购管理 --- 供应商新增/修改 --- 开始
const supplierEditList = {
  'POST /purchase/purchase-supplier-info/add': {
    $desc: '添加新供应商',
    $params: {
      supplierName: {
        desc: '供应商名',
        exp: '帅哥供应商',
      },
      address: {
        desc: '地址',
        exp: '[province, city ,district]',
      },
      sn: {
        desc: '检索简码',
        exp: '123',
      },
      contractExpire: {
        desc: '合同到期时间',
        exp: '2017-10-10',
      },
      supplierLevel: {
        desc: '供应商星级',
        exp: '1=>1星, 以此类推到5星',
      },
      status: {
        desc: '是否启用',
        exp: '1=>启用, 0=>禁用',
      },
      linkmanQQ: {
        desc: '联系人qq',
        exp: '46271662781',
      },
      linkmanName: {
        desc: '联系人姓名',
        exp: '帅哥',
      },
      linkmanEmail: {
        desc: '联系邮箱',
        exp: '4137281998@qq.com',
      },
      linkmanJob: {
        desc: '联系职位',
        exp: '总监',
      },
      depositBank: {
        desc: '开户银行',
        exp: '建设银行',
      },
      depositName: {
        desc: '开户名称',
        exp: '刘某',
      },
      bankNum: {
        desc: '银行号码',
        exp: '28873517726388842',
      },
      invoiceTitle: {
        desc: '银行抬头',
        exp: '某某地某某地区302',
      },
      remark: {
        desc: '备注',
        exp: '备注123213123',
      },
    },
    $body: {
      code: 0,
    },
  },
  'GET /purchase/purchase-supplier-info/info': {
    $desc: '获取供应商信息',
    $params: {
      id: {
        desc: '供应商id',
        exp: 123,
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        id: 10,
        supplierName: '帅哥供应商',
        address: ['20', '22'],
        sn: '检索简码',
        contractExpire: '2017-10-10',
        supplierLevel: 2,
        status: 0,
        linkmanQQ: '联系人qq',
        linkmanName: '联系人名称',
        linkmanMobile: '联系人电话',
        linkmanEmail: '联系人邮件',
        linkmanJob: '联系人职位',
        depositBank: '开户银行',
        depositName: '开户名称',
        bankNum: '银行号码',
        invoiceTitle: '发票抬头',
        remark: '备注',
      }),
    },
  },
  'POST /purchase/purchase-supplier-info/edit': {
    $desc: '修改供应商',
    $params: {
      id: {
        desc: '供应商id',
        exp: 123,
      },
      supplierName: {
        desc: '供应商名',
        exp: '帅哥供应商',
      },
      address: {
        desc: '地址',
        exp: '[province, city ,district]',
      },
      sn: {
        desc: '检索简码',
        exp: '123',
      },
      contractExpire: {
        desc: '合同到期时间',
        exp: '2017-10-10',
      },
      supplierLevel: {
        desc: '供应商星级',
        exp: '1=>1星, 以此类推到5星',
      },
      status: {
        desc: '是否启用',
        exp: '1=>启用, 0=>禁用',
      },
      linkmanQQ: {
        desc: '联系人qq',
        exp: '46271662781',
      },
      linkmanName: {
        desc: '联系人姓名',
        exp: '帅哥',
      },
      linkmanEmail: {
        desc: '联系邮箱',
        exp: '4137281998@qq.com',
      },
      linkmanJob: {
        desc: '联系职位',
        exp: '总监',
      },
      depositBank: {
        desc: '开户银行',
        exp: '建设银行',
      },
      depositName: {
        desc: '开户名称',
        exp: '刘某',
      },
      bankNum: {
        desc: '银行号码',
        exp: '28873517726388842',
      },
      invoiceTitle: {
        desc: '银行抬头',
        exp: '某某地某某地区302',
      },
      remark: {
        desc: '备注',
        exp: '备注123213123',
      },
    },
    $body: {
      code: 0,
      message: '成功',
    },
  },
};
// 采购管理 --- 供应商新增/修改 --- 结束

// 采购管理 --- 供应商列表 --- 开始
const supplierList = {
  'POST /purchase/purchase-supplier-info/enable': {
    $desc: '启用供应商',
    $params: {
      id: {
        desc: '供应商id',
        exp: '123',
      },
    },
    $body: {
      code: 0,
    },
  },
  'POST /purchase/purchase-supplier-info/disable': {
    $desc: '禁用供应商',
    $params: {
      id: {
        desc: '供应商id',
        exp: '123',
      },
    },
    $body: {
      code: 0,
    },
  },
  'GET /supplierList/export-suppliers': {
    $desc: '导出供应商',
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
    },
    $body: {
      code: 0,
    },
  },
};
// 采购管理 --- 供应商列表 --- 结束


// 采购账期 供应商资金管理列表 --- 开始
const supplierFundList = {
  'GET /purchase/purchase-balance/get-all-account-finance': {
    $desc: '拉取总账期信息',
    $body: {
      code: 0,
      data: mockjs.mock({
        balanceSupplierNum: '挂账供应商数(222)',
        balanceReceiveTotalAmount: '挂账应收总额(333)',
        creditSupplierNum: '账期供应商数(444)',
        creditPayTotalAmount: '账期应付总额(555)',
      }),
    },
  },
  'GET /purchase/purchase-balance/get-suppliert-finance-list': {
    $desc: '拉取供应商账期列表',
    $params: {
      keywords: {
        desc: '供应商/简码-模糊',
        exp: '1',
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'accountList|1-10': [
          {
            'id|+1': 933,
            'supplier|1': ['供应商(小美)', '供应商(诚品)'],
            'contacts|1': ['联系人1(手机号1)', '联系人2(手机号2)'],
            'creditPay|1': ['账期应付(111)', '账期应付(222)'],
            'balanceReceive|1': ['挂账应收(10)', '挂账应收(22)'],
            'receiveAmount|1': ['应收金额(10)', '应收金额(22)'],
            'remark|1': ['备注(备注信息)', '备注(备注信息)'],
          },
        ],
      }),
    },
  },
};
// 采购账期 --- 供应商资金管理列表 --- 结束

// 采购账期管理 --- 供应商资金详情 --- 开始
const supplierFundDetail = {
  'GET /purchase/funds-detail/get-config': {
    $desc: '拉取供应商资金详情的配置项',
    $body: {
      code: 0,
      data: {
        fundsTypeMap: {
          0: '挂账应收',
          1: '账期应付',
          2: '账期付款',
          3: '挂账抵扣',
        },
        receivableAccountMap: {
          0: '中国招商银行',
          1: '中国建设银行',
          2: '支付宝',
          3: '微信',
        },
      },
    },
  },
  'GET /purchase/funds-detail/get-supplier-info': {
    $desc: '拉取供应商账期明细',
    $params: {
      supplierId: {
        desc: '供应商id',
        exp: '1',
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        'supplierCompany|1': ['供应商公司名称(小美)', '供应商公司名称(诚品)'],
        'contacts|1': ['联系人(张三)', '联系人(李四)'],
        'payableTotalAmount|1': ['1000', '账期应付总金额(1000)'],
        'receivableTotalAmount|1': ['11000', '挂账应收总金额(1100)'],
        'receivableTotal|1': ['-1200', '总应收金额(1200)'],
      }),
    },
  },
  'GET /purchase/funds-detail/get-finance-detail': {
    $desc: '获取资金明细',
    $params: {
      supplierId: {
        desc: '供应商id',
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
        desc: '类型(挂账应收/账期应付/挂账抵扣/账期付款)',
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
            'type|1': ['应付', '应收'],
            'orderSn|1': ['DH-O-20180108-020725', 'DH-O-20180108-1111'],
            'transactionSn|1': ['流水号(123123231)', '流水号(123123123)'],
            'remark|1': ['备注(123123)', '备注(我爱你,我的家)'],
          },
        ],
      }),
    },
  },
  'POST /purchase/funds-detail/add-received-record': {
    $desc: '添加收款记录',
    $params: {
      supplierId: {
        desc: '供应商id',
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
        desc: '结算备注',
        exp: '客户支付类型，特殊申请信息，账期政策等，协商处理结果写到这里，方便财务对其审核相关业务事项。',
      },
    },
    $body: {
      code: 0,
    },
  },
  'POST /purchase/funds-detail/add-pay-record': {
    $desc: '添加付款记录',
    $params: {
      supplierId: {
        desc: '供应商id',
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
        exp: '客户支付类型，特殊申请信息，账期政策等，协商处理结果写到这里，方便财务对其审核相关业务事项。',
      },
    },
    $body: {
      code: 0,
    },
  },
};

export {
  supplierList,
  supplierEditList,
  purchaseOrderList,
  commonPurchaseOrderAdd,
  commonPurchaseOrderDetail,
  supplyGoodsList,
  awaitSalePurchaseOrderList,
  salePurchaseOrderList,
  salePurchaseOrderDetail,
  purchaseAfterSaleOrderList,
  purchaseAfterSaleOrderEdit,
  purchaseAfterSaleOrderDetail,
  supplierFundList,
  supplierFundDetail,
};
