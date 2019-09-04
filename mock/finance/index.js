import mockjs from 'mockjs';

// 销售订单应收
const saleOrderReceive = {
  // 'GET /saleOrderReceive/orderList': {
  //   $desc: '销售订单应收 -- 获取订单列表',
  //   $params: {
  //     keywords: {
  //       desc: '订单号/用户名/手机号',
  //       exp: '132272771827',
  //     },
  //     startDate: {
  //       desc: '开始时间',
  //       exp: '2017-10-10',
  //     },
  //     endDate: {
  //       desc: '结束时间',
  //       exp: '2017-12-12',
  //     },
  //     curPage: {
  //       desc: '当前页',
  //       exp: 10,
  //     },
  //     pageSize: {
  //       desc: '每页树',
  //       exp: 10,
  //     },
  //   },
  //   $body: {
  //     code: 0,
  //     data: mockjs.mock({
  //       total: 100,
  //       'saleOrderList|2-10': [{
  //         'id|+1': 200,
  //         sn: '订单号',
  //         username: '用户名',
  //         totalAmount: '订单总额',
  //         realAmount: '实付总额',
  //         time: '创建时间',
  //         remark: '备注',
  //         'goodsList|2-10': [{
  //           'id|+1': 100,
  //           img: 'xxx',
  //           name: '商品名称',
  //           sn: '商品条码',
  //           unit: '单位',
  //           price: '单价',
  //           num: '数量',
  //           subtotal: '小计',
  //           remark: '备注',
  //         }],
  //       }],
  //     }),
  //   },
  // },
};

// 销售售后应付
const afterSaleOrderPay = {
  // 'GET /afterSaleOrderPay/config': {
  //   $desc: '销售售后单应付 --- 获取配置项',
  //   $body: {
  //     code: 0,
  //     data: {
  //       afterSaleOrderTypeMap: {
  //         0: '退款',
  //         1: '退款退货',
  //       },
  //     },
  //   },
  // },
  // 'GET /afterSaleOrderPay/orderList': {
  //   $desc: '销售售后单应付 --- 获取列表',
  //   $params: {
  //     keywords: {
  //       desc: '订单号/用户名/手机号',
  //       exp: '132272771827',
  //     },
  //     startDate: {
  //       desc: '开始时间',
  //       exp: '2017-10-10',
  //     },
  //     endDate: {
  //       desc: '结束时间',
  //       exp: '2017-12-12',
  //     },
  //     afterSaleType: {
  //       desc: '售后单类型',
  //       exp: 1,
  //     },
  //     curPage: {
  //       desc: '当前页',
  //       exp: 10,
  //     },
  //     pageSize: {
  //       desc: '每页树',
  //       exp: 10,
  //     },
  //   },
  //   $body: {
  //     code: 0,
  //     data: mockjs.mock({
  //       total: 100,
  //       'afterSaleOrderList|2-10': [{
  //         'id|+1': 200,
  //         type: '售后类型',
  //         sn: '退单号',
  //         relatedOrderSn: '关联订单号',
  //         username: '用户名',
  //         refundAmount: '退款金额',
  //         time: '创建时间',
  //         remark: '备注',
  //         'goodsList|2-10': [{
  //           'id|+1': 100,
  //           img: 'xxx',
  //           name: '商品名称',
  //           sn: '商品条码',
  //           unit: '单位',
  //           price: '单价',
  //           num: '数量',
  //           subtotal: '小计',
  //         }],
  //       }],
  //     }),
  //   },
  // },
};

// 账期记录
const paymentRecord = {
  'GET /paymentRecord/orderList': {
    $desc: '账期审核 -- 获取订单列表',
    $params: {
      keywords: {
        desc: '订单号/用户名/手机号',
        exp: '132272771827',
      },
      startDate: {
        desc: '开始时间',
        exp: '2017-10-10',
      },
      endDate: {
        desc: '结束时间',
        exp: '2017-12-12',
      },
      curPage: {
        desc: '当前页',
        exp: 10,
      },
      pageSize: {
        desc: '每页树',
        exp: 10,
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        total: 100,
        'paymentOrderList|2-10': [{
          'id|+1': 200,
          orderId: '销售订单id',
          sn: '订单号',
          username: '用户名',
          realAmount: '应收总额',
          time: '下单时间',
          remark: '备注',
          'goodsList|2-10': [{
            'id|+1': 100,
            img: 'xxx',
            name: '商品名称',
            sn: '商品条码',
            unit: '单位',
            price: '单价',
            num: '数量',
            remark: '备注',
            subtotal: '小计',
          }],
        }],
      }),
    },
  },
};

// 采购应付
const purchaseOrderPay = {
  'GET /finance/purchase-outcome-application/list': {
    $desc: '采购应付 -- 获取订单列表',
    $params: {
      keywords: {
        desc: '采购单号/供应商',
        exp: '132272771827',
      },
      startDate: {
        desc: '开始时间',
        exp: '2017-10-10',
      },
      endDate: {
        desc: '结束时间',
        exp: '2017-12-12',
      },
      curPage: {
        desc: '当前页',
        exp: 10,
      },
      pageSize: {
        desc: '每页数',
        exp: 10,
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        total: 100,
        'purchaseOrderPayList|5-11': [
          {
            'id|+1': 100,
            supplier: '供应商',
            'payTotalAmount|1': [
              '应付总额1',
              '应付总额2',
              '应付总额3',
            ],
            time: '2018-03-09 12:23:45',
            remark: '备注',
            'orderList|1-5': [
              {
                'id|+1': 500,
                sn: 2018030859795,
              },
            ],
          },
        ],
      }),
    },
  },
};

// 采购售后应收
const purchaseAfterSaleOrderReceive = {
  'GET /purchase/purchase-back-order/config': {
    $desc: '采购售后应收 --- 获取配置项',
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
  // 'GET /purchase/purchase-back-order/list': {
  //   $desc: '采购售后应收 -- 获取订单列表',
  //   $params: {
  //     keywords: {
  //       desc: '采购单号/供应商',
  //       exp: '132272771827',
  //     },
  //     supplierID: {
  //       desc: '供应商id',
  //       exp: '1',
  //     },
  //     startDate: {
  //       desc: '开始时间',
  //       exp: '2017-10-10',
  //     },
  //     endDate: {
  //       desc: '结束时间',
  //       exp: '2017-12-12',
  //     },
  //     curPage: {
  //       desc: '当前页',
  //       exp: 10,
  //     },
  //     pageSize: {
  //       desc: '每页数',
  //       exp: 10,
  //     },
  //     orderType: {
  //       desc: '订单类型',
  //       exp: '0|1|2',
  //     },
  //   },
  //   $body: {
  //     code: 0,
  //     data: mockjs.mock({
  //       total: 100,
  //       'purchaseOrderList|2-10': [{
  //         'id|+1': 200,
  //         sn: '退单号',
  //         relatedOrderSn: '关联采购单号',
  //         supplier: '供应商',
  //         refundTotalAmount: '退款总额',
  //         receivableAmount: '应收总额',
  //         time: '创建时间',
  //         remark: '备注',
  //         'goodsList|2-10': [{
  //           'id|+1': 100,
  //           img: 'xxx',
  //           name: '商品名称',
  //           sn: '商品条码',
  //           unit: '单位',
  //           price: '单价',
  //           num: '数量',
  //           subtotal: '小计',
  //         }],
  //       }],
  //     }),
  //   },
  // },
};

// 采购应付详情
const purchaseOrderPayDetail = {
  'GET /finance/purchase-outcome-application/detail': {
    $desc: '获取采购应付订单详情',
    $params: {
      id: {
        desc: '采购应付订单id',
        exp: '1',
      },
    },
    $body: {
      code: 0,
      data: mockjs.mock({
        id: '采购应付订单id',
        'status|1': [
          '待主管审核',
          '待财务审核',
        ],
        purchaseSn: '采购单号001',
        supplier: '供应商007',
        purchaser: '采购员002',
        date: '2018-03-02  14:10:05',
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
  // 'POST /finance/sales-cash-bill/insert-from-order-group': {
  //   $desc: '生成现付支付流水',
  //   $params: {
  //     totalOrderId: {
  //       desc: '总单id',
  //       exp: '123',
  //     },
  //     amount: {
  //       desc: '支付金额',
  //       exp: '123.321',
  //     },
  //     payId: {
  //       desc: '支付渠道',
  //       exp: '0|1|2|3',
  //     },
  //     transactionSn: {
  //       desc: '银行流水',
  //       exp: '32321132',
  //     },
  //     payTime: {
  //       desc: '支付时间',
  //       exp: '2017-10-10 19:12:12',
  //     },
  //     collectAccount: {
  //       desc: '收款账户',
  //       exp: '0|1|2|3',
  //     },
  //     remark: {
  //       desc: '备注',
  //       exp: '备注备注备注',
  //     },
  //   },
  //   $body: {
  //     code: 0,
  //     msg: 'success',
  //     data: mockjs.mock({
  //       'id|+1': [1, 2, 3],
  //       'salesman|+1': ['业务员1', '业务员2'],
  //       'assessor|+1': ['审核员1', '审核员2'],
  //       'payNo|+1': ['支付流水号1', '支付流水号2'],
  //       'payTime|+1': ['支付时间1', '支付时间2'],
  //       'payAmount|+1': ['支付金额1', '支付金额2'],
  //       'payMethod|+1': ['支付方式1', '支付方式2'],
  //       'collectAccount|+1': ['收款账户1', '收款账户2'],
  //       'payStatus|+1': ['支付状态1', '支付状态2'],
  //       'remark|+1': ['备注1', '备注2'],
  //     }),
  //   },
  // },
  // 'POST /finance/sales-balance-bill/insert-from-order-group': {
  //   $desc: '生成挂账对冲流水',
  //   $params: {
  //     totalOrderId: {
  //       desc: '总单id',
  //       exp: '123',
  //     },
  //     amount: {
  //       desc: '支付金额',
  //       exp: '123.321',
  //     },
  //     remark: {
  //       desc: '备注',
  //       exp: '备注备注备注',
  //     },
  //   },
  //   $body: {
  //     code: 0,
  //     msg: 'success',
  //     data: mockjs.mock({
  //       'id|+1': [1, 2, 3],
  //       'salesman|+1': ['业务员1', '业务员2'],
  //       'assessor|+1': ['审核员1', '审核员2'],
  //       'payNo|+1': ['支付流水号1', '支付流水号2'],
  //       'payTime|+1': ['支付时间1', '支付时间2'],
  //       'payAmount|+1': ['支付金额1', '支付金额2'],
  //       'payMethod|+1': ['支付方式1', '支付方式2'],
  //       'collectAccount|+1': ['收款账户1', '收款账户2'],
  //       'payStatus|+1': ['支付状态1', '支付状态2'],
  //       'remark|+1': ['备注1', '备注2'],
  //     }),
  //   },
  // },
  // 'POST /finance/sales-credit-bill/insert-from-order-group': {
  //   $desc: '生成账期支付流水',
  //   $params: {
  //     totalOrderId: {
  //       desc: '总单id',
  //       exp: '123',
  //     },
  //     amount: {
  //       desc: '支付金额',
  //       exp: '123.321',
  //     },
  //     payTime: {
  //       desc: '支付时间',
  //       exp: '2017-10-10 19:12:12',
  //     },
  //     backTime: {
  //       desc: '预期回款时间',
  //       exp: '2017-10-10 10:10:10',
  //     },
  //     remark: {
  //       desc: '备注',
  //       exp: '备注备注备注',
  //     },
  //   },
  //   $body: {
  //     code: 0,
  //     msg: 'success',
  //     data: mockjs.mock({
  //       'id|+1': [1, 2, 3],
  //       'salesman|+1': ['业务员1', '业务员2'],
  //       'assessor|+1': ['审核员1', '审核员2'],
  //       'payNo|+1': ['支付流水号1', '支付流水号2'],
  //       'payTime|+1': ['支付时间1', '支付时间2'],
  //       'payAmount|+1': ['支付金额1', '支付金额2'],
  //       'payMethod|+1': ['支付方式1', '支付方式2'],
  //       'collectAccount|+1': ['收款账户1', '收款账户2'],
  //       'payStatus|+1': ['支付状态1', '支付状态2'],
  //       'remark|+1': ['备注1', '备注2'],
  //     }),
  //   },
  // },
};

export {
  saleOrderReceive,
  afterSaleOrderPay,
  paymentRecord,
  purchaseOrderPay,
  purchaseAfterSaleOrderReceive,
  purchaseOrderPayDetail,
};

