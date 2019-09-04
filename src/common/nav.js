import dynamic from 'dva/dynamic';

// wrapper of dynamic
// @params models 必须引入了才能在 component 的 connect 中获取
const dynamicWrapper = (app, models, component) =>
  dynamic({
    app,
    models: () => models.map(m => import(`../models/${m}.js`)),
    component,
  });

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['user', 'login'], () =>
      import('../layouts/BasicLayout')
    ),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '工作台',
        icon: 'dashboard',
        path: 'dashboard',
        component: dynamicWrapper(app, ['dashboard'], () =>
          import('../routes/Dashboard')
        ),
        children: [
          // {
          //   name: '分析页',
          //   path: 'analysis',
          // component: dynamicWrapper(
          //   app, ['chart'], () => import('../routes/Dashboard/Analysis')
          // ),
          // },
          // {
          //   name: '监控页',
          //   path: 'monitor',
          // component: dynamicWrapper(
          //   app, ['monitor'], () => import('../routes/Dashboard/Monitor')
          // ),
          // },
          // {
          //   name: '工作台',
          //   path: 'workplace',
          // component: dynamicWrapper(
          // app,
          // ['project', 'activities', 'chart'],
          // () => import('../routes/Dashboard/Workplace')
          // ),
          // },
        ],
      },
      {
        name: '信息管理',
        icon: 'message',
        path: 'message',
        children: [
          {
            name: '信息列表',
            path: 'message-list',
            component: dynamicWrapper(app, ['messageList'], () =>
              import('../routes/Message/MessageList')
            ),
          },
          {
            name: '信息列表',
            path: 'message-list/:type?',
            hide: true,
            component: dynamicWrapper(app, ['messageList'], () =>
              import('../routes/Message/MessageList')
            ),
          },
          {
            name: '信息列表',
            path: 'message-list',
            hide: true,
            children: [
              {
                name: '信息详情',
                path: 'message-detail',
                children: [
                  {
                    name: '',
                    path: ':id',
                    component: dynamicWrapper(app, ['messageDetail'], () =>
                      import('../routes/Message/MessageDetail')
                    ),
                  },
                ],
              },
            ]
          },
          {
            name: '新增信息',
            path: 'create-message',
            hide: true,
            component: dynamicWrapper(app, ['createMessage'], () =>
              import('../routes/Message/CreateMessage')
            ),
          },
        ]
      },
      {
        name: '人事管理',
        icon: 'table',
        path: 'staff',
        children: [
          {
            name: '员工管理',
            path: 'staff-list',
            component: dynamicWrapper(app, ['staffList'], () =>
              import('../routes/Staff/StaffList')
            ),
          },
          {
            name: '员工管理',
            path: 'staff-list',
            hide: true,
            children: [
              {
                name: '信息详情',
                path: 'staff-detail',
                children: [
                  {
                    name: '',
                    path: ':id',
                    component: dynamicWrapper(app, ['staffDetail'], () =>
                      import('../routes/Staff/StaffDetail')
                    ),
                  },
                ],
              },
            ]
          },
          {
            name: '新增信息',
            path: 'create-message',
            hide: true,
            component: dynamicWrapper(app, ['createMessage'], () =>
              import('../routes/Message/CreateMessage')
            ),
          },
        ]
      },
      {
        name: '仓库管理',
        icon: 'inbox',
        path: 'warehouse',
        children: [
          {
            name: '商品库存',
            path: 'goods-stock-list',
            component: dynamicWrapper(app, ['goodsStockList'], () =>
              import('../routes/Warehouse/GoodsStockList')
            ),
          },
          {
            hide: true,
            name: '商品库存',
            path: 'goods-stock-list',
            children: [
              {
                name: '导入盘点单',
                path: 'import-inventory-list',
                component: dynamicWrapper(app, ['importInventoryList'], () =>
                  import('../routes/Warehouse/ImportInventoryList')
                ),
              },
            ],
          },
          {
            name: '入库单',
            path: 'in-store-order-list',
            component: dynamicWrapper(app, ['inStoreOrderList'], () =>
              import('../routes/Warehouse/InStoreOrderList')
            ),
          },
          {
            hide: true,
            name: '入库单',
            path: 'in-store-order-list',
            children: [
              {
                name: '新建入库单',
                path: 'in-store-order-add',
                component: dynamicWrapper(app, ['inStoreOrderAdd'], () =>
                  import('../routes/Warehouse/InStoreOrderAdd')
                ),
              },
            ],
          },
          {
            hide: true,
            name: '出库单',
            path: 'await-push-list',
            children: [
              {
                name: '新建出库单',
                path: 'out-store-add',
                component: dynamicWrapper(app, ['outStoreListAdd'], () =>
                  import('../routes/Warehouse/OutStoreListAdd')
                ),
              },
            ],
          },
          {
            name: '出库单',
            path: 'await-push-list',
            component: dynamicWrapper(app, ['awaitPushList'], () =>
              import('../routes/Sale/AwaitPushList')
            ),
          },
          {
            name: '占用库存跟踪',
            path: 'goods-stock',
            children: [
              {
                name: '占用库存跟踪列表',
                path: 'goods-stock-follow-list',
                component: dynamicWrapper(app, ['goodsStockFollowList'], () =>
                  import('../routes/Warehouse/GoodsStockFollowList')
                ),
              },
              {
                hide: true,
                name: '占用库存跟踪列表',
                path: 'goods-stock-follow-list',
                children: [
                  {
                    name: '商品库存变更流水',
                    path: 'goods-stock-detail',
                    children: [
                      {
                        name: '',
                        path: ':id',
                        component: dynamicWrapper(app, ['goodsStockDetail'], () =>
                          import('../routes/Warehouse/GoodsStockDetail')
                        ),
                      },
                    ],
                  },
                ]
              },

            ],
          },
        ],
      },
      {
        name: '采购管理',
        icon: 'shopping-cart',
        path: 'purchase',
        children: [
          

          {
            name: '供应商管理',
            path: 'supplier-management',
            children: [
              {
                name: '供应商管理列表',
                path: 'supplier-management-list',
                component: dynamicWrapper(app, ['supplierManagementList'], () =>
                  import('../routes/Purchase/SupplierManagementList')
                )
              },
              {
                hide: true,
                name: '供应商管理列表',
                path: 'supplier-management-list',
                children: [
                  {
                    name: '编辑供应商',
                    path: 'supplier-add',
                    component: dynamicWrapper(app, ['supplierAdd'], () =>
                      import('../routes/Purchase/SupplierAdd')
                    ),
                  },
                  {
                    name: '编辑供应商',
                    path: 'supplier-add',
                    children: [
                      {
                        name: '编辑供应商',
                        path: ':id/:key?',
                        component: dynamicWrapper(app, ['supplierAdd'], () =>
                          import('../routes/Purchase/SupplierAdd')
                        ),
                      },
                    ],
                  },
                ]
              },
              {
                name: '供应商审核列表',
                path: 'supplier-check-list',
                component: dynamicWrapper(app, ['supplierCheckList'], () =>
                  import('../routes/Purchase/SupplierCheckList')
                )
              },
              {
                name: '供应商审核列表',
                path: 'supplier-check-list',
                hide:true,
                children: [
                  {
                    name: '供应商详情页',
                    path: 'supplier-check-detail',
                    children: [
                      {
                        name: '',
                        path: ':id',
                        component: dynamicWrapper(app, ['supplierCheckDetail'], () =>
                          import('../routes/Purchase/SupplierCheckDetail')
                        ),
                      },
                    ],
                  },
                ],
                
              },
              {
                name: '商品采购价管理',
                path: 'purchase-price-management',
                component: dynamicWrapper(app, ['purchasePriceManagement'], () =>
                  import('../routes/Purchase/PurchasePriceManagement')
                ),
              },
              {
                name: '商品采购价管理',
                hide:true,
                path: 'purchase-price-management',
                children: [
                  {
                    name: '商品价格变动明细',
                    path: 'price-detail',
                    children: [
                      {
                        name: '',
                        path: ':id',
                        component: dynamicWrapper(app, ['priceDetail'], () =>
                          import('../routes/Purchase/PriceDetail')
                        ),
                      },
                    ],
                  },
                ],
              },
              {
                name: '统计报表',
                path: 'statistics-report',
                component: dynamicWrapper(app, ['statisticsReport'], () =>
                  import('../routes/Purchase/StatisticsReport')
                ),

              },
              {
                name: '返利政策',
                path: 'rebate-policy',
                component: dynamicWrapper(app, ['rebatePolicy'], () =>
                  import('../routes/Purchase/RebatePolicy')
                ),
              },
            ],
          },
          {
            name: '智能采购',
            path: 'smart-purchase-list',
            component: dynamicWrapper(app, ['smartPurchaseList'], () =>
              import('../routes/Purchase/SmartPurchaseList')
            ),
          },
          {
            name: '采购管理',
            path: 'purchase-order-management',
            children: [
              {
                name: '库存采购',
                path: 'common-purchase-list',
                component: dynamicWrapper(app, ['commonPurchaseList'], () =>
                  import('../routes/Purchase/CommonPurchaseList')
                ),
              },
              {
                hide: true,
                name: '库存采购',
                path: 'common-purchase-list',
                children: [
                  {
                    name: '采购订单详情',
                    path: 'common-purchase-detail',
                    children: [
                      {
                        name: '',
                        path: ':id',
                        component: dynamicWrapper(
                          app,
                          ['commonPurchaseDetail'],
                          () => import('../routes/Purchase/CommonPurchaseDetail')
                        ),
                      },
                    ],
                  },
                  {
                    name: '编辑采购订单',
                    path: 'common-purchase-add',
                    component: dynamicWrapper(
                      app,
                      ['commonPurchaseAdd', 'user'],
                      () => import('../routes/Purchase/CommonPurchaseAdd')
                    ),
                  },
                  {
                    name: '编辑采购订单',
                    path: 'common-purchase-add',
                    children: [
                      {
                        path: ':id',
                        component: dynamicWrapper(
                          app,
                          ['commonPurchaseAdd', 'user'],
                          () => import('../routes/Purchase/CommonPurchaseAdd')
                        ),
                      },
                    ],
                  },
                ],
              },
              {
                name: '代发采购',
                path: 'sale-purchase',
                children: [
                  {
                    name: '待制单',
                    path: 'await-sale-purchase-order-list',
                    component: dynamicWrapper(app, ['awaitSalePurchaseOrderList'], () =>
                      import('../routes/Purchase/AwaitSalePurchaseOrderList')
                    ),
                  },
                  {
                    name: '代发单',
                    path: 'sale-purchase-order-list',
                    component: dynamicWrapper(app, ['salePurchaseOrderList'], () =>
                      import('../routes/Purchase/SalePurchaseOrderList')
                    ),
                  },
                  {
                    hide: true,
                    name: '代发单',
                    path: 'sale-purchase-order-list',
                    children: [
                      {
                        name: '代发单详情',
                        path: 'sale-purchase-order-detail/:id',
                        component: dynamicWrapper(app, ['salePurchaseOrderDetail'], () =>
                          import('../routes/Purchase/SalePurchaseOrderDetail')
                        ),
                      },
                    ],
                  },
                ],
              },
              {
                name: '采购跟单表',
                path: 'common-purchase-follow-list',
                component: dynamicWrapper(app, ['commonPurchaseFollowList'], () =>
                  import('../routes/Purchase/CommonPurchaseFollowList')
                ),
              },
              {
                name: '货款申请表',
                path: 'purchase-apply-for-payment-list',
                component: dynamicWrapper(app, ['purchaseApplyForPaymentList'], () =>
                  import('../routes/Purchase/PurchaseApplyForPaymentList')
                ),
              },
              {
                hide: true,
                name: '货款申请表',
                path: 'purchase-apply-for-payment-list',
                children: [
                  {
                    name: '采购申请货款详情',
                    path: 'purchase-apply-for-payment-detail/:id',
                    component: dynamicWrapper(app, ['purchaseApplyForPaymentDetail'], () =>
                      import('../routes/Purchase/PurchaseApplyForPaymentDetail')
                    ),
                  },
                ],
              },
              {
                name: '采购售后',
                path: 'purchase-after-sale-order-list',
                component: dynamicWrapper(app, ['purchaseAfterSaleOrderList'], () =>
                  import('../routes/Purchase/PurchaseAfterSaleOrderList')
                ),
              },
              {
                hide: true,
                name: '采购售后',
                path: 'purchase-after-sale-order-list',
                children: [
                  {
                    name: '采购售后单详情',
                    path: 'purchase-after-sale-order-detail/:id/:type?',
                    component: dynamicWrapper(app, ['purchaseAfterSaleOrderDetail'], () =>
                      import('../routes/Purchase/PurchaseAfterSaleOrderDetail')
                    ),
                  }, {
                    name: '新建采购售后单',
                    path: 'purchase-after-sale-order-edit',
                    component: dynamicWrapper(app, ['purchaseAfterSaleOrderEdit'], () =>
                      import('../routes/Purchase/PurchaseAfterSaleOrderEdit')
                    ),
                  }, {
                    name: '新建采购售后单',
                    path: 'purchase-after-sale-order-edit',
                    children: [
                      {
                        path: ':type/:id?',
                        component: dynamicWrapper(app, ['purchaseAfterSaleOrderEdit'], () =>
                          import('../routes/Purchase/PurchaseAfterSaleOrderEdit')
                        ),
                      },
                    ],
                  },
                ],
              },
              {
                name: '代发售后审核列表',
                path: 'common-purchase-after-sale-list',
                component: dynamicWrapper(app, ['commonPurchaseAfterSaleList'], () =>
                  import('../routes/Purchase/CommonPurchaseAfterSaleList')
                ),
              },
            ]
          },
          {
            name: '票据管理',
            path: 'invoice-management',
            children: [
              {
                name: '待开票列表',
                path: 'purchase-await-invoice-goods-list',
                component: dynamicWrapper(app, ['purchaseAwaitInvoiceGoodsList'], () =>
                  import('../routes/Purchase/PurchaseAwaitInvoiceGoodsList')
                ),
              },
              {
                name: '来票跟进表',
                path: 'purchase-in-inv-follow-list',
                component: dynamicWrapper(app, ['purchaseInInvFollowList'], () =>
                  import('../routes/Purchase/PurchaseInInvFollowList')
                ),
              },
              {
                hide: true,
                name: '来票跟进表',
                path: 'purchase-in-inv-follow-list',
                children: [
                  {
                    name: '来票跟进表详情',
                    path: 'purchase-in-inv-follow-detail/:id',
                    component: dynamicWrapper(
                      app,
                      ['financePurchaseInInvDetail', 'purchaseInInvFollowDetail'],
                      () => import('../routes/Finance/FinancePurchaseInInvDetail')
                    ),
                  },
                ],
              },
              {
                name: '未开票金额列表',
                path: 'purchase-in-inv-follow-list-n',
                component: dynamicWrapper(app, ['purchaseInInvFollowList'], () =>
                  import('../routes/Purchase/PurchaseInInvFollowList')
                ),
              },
              {
                hide: true,
                name: '未开票金额列表',
                path: 'purchase-in-inv-follow-list-n',
                children: [
                  {
                    name: '未开票金额列表详情',
                    path: 'purchase-in-inv-follow-detail-n/:id',
                    component: dynamicWrapper(app, ['financePurchaseInInvDetail', 'purchaseInInvFollowDetail'], () =>
                      import('../routes/Finance/FinancePurchaseInInvDetail')
                    ),
                  },
                ],
              },
            ]

          },
          {
            name: '采购账期',
            path: 'purchase-account-period',
            component: dynamicWrapper(app, ['purchaseAccountPeriod'], () =>
              import('../routes/Purchase/PurchaseAccountPeriod')
            ),
          },
          {
            hide: true,
            name: '采购账期',
            path: 'purchase-account-period',
            children: [
              {
                name: '待对账列表',
                path: 'deal-account-list',
                children: [
                  {
                    name: '',
                    path: ':id',
                    component: dynamicWrapper(
                      app,
                      ['dealAccountList'],
                      () => import('../routes/Purchase/DealAccountList')
                    ),
                  },
                ],
              }
            ]
          },
          {
            name: '货值管理',
            path: 'value-onway',
            component: dynamicWrapper(app, ['valueOnway'], () =>
              import('../routes/Purchase/ValueOnway')
            ),
          },
          {
            name: '运费中心',
            path:'freight',
            children:[
              {
                name:'运费管理中心',
                path: 'freight-center',
                component: dynamicWrapper(app, ['freightCenter','manualUpload'], () =>
                  import('../routes/Purchase/FreightCenter')
                ),
              },
              {
                name:'应付运费列表',
                path: 'freight-list',
                component: dynamicWrapper(app, ['freightList','manualUpload'], () =>
                  import('../routes/Purchase/FreightList')
                ),
              },
              {
                name:'应付运费列表',
                path: 'freight-list',
                hide:true,
                children:[
                  {
                    name:'应付运费详情',
                    path: 'freight-detail/:id',
                    component: dynamicWrapper(app, ['freightDetail'], () =>
                      import('../routes/Purchase/FreightDetail')
                    ),
                  },

                ]
              }
            ]
            
          },
        ],
      },
      {
        name: '财务管理',
        icon: 'pay-circle-o',
        path: 'finance',
        children: [
          {
            name: '订单核款',
            path: 'order-check',
            children: [
              {
                name: '销售订单应收',
                path: 'sale-order-receive',
                component: dynamicWrapper(app, ['saleOrderReceive'], () =>
                  import('../routes/Finance/SaleOrderReceive')
                ),
              },
              {
                name: '销售售后应付',
                path: 'after-sale-order-pay',
                component: dynamicWrapper(app, ['afterSaleOrderPay'], () =>
                  import('../routes/Finance/AfterSaleOrderPay')
                ),
              },
              {
                name: '账期记录',
                path: 'payment-record',
                component: dynamicWrapper(app, ['paymentRecord'], () =>
                  import('../routes/Finance/PaymentRecord')
                ),
              },
            ],
          },
          {
            name: '采购核款',
            path: 'purchase-check',
            children: [
              {
                name: '采购应付',
                path: 'purchase-order-pay',
                component: dynamicWrapper(app, ['purchaseOrderPay'], () =>
                  import('../routes/Finance/PurchaseOrderPay')
                ),
              },
              {
                name: '采购账期审核',
                path: 'purchase-account-checklist',
                component: dynamicWrapper(app, ['purchaseAccountChecklist'], () =>
                  import('../routes/Purchase/PurchaseAccountChecklist')
                ),
              },
              {
                name:'应付运费列表',
                path: 'freight-list',
                component: dynamicWrapper(app, ['freightList','manualUpload'], () =>
                  import('../routes/Purchase/FreightList')
                ),
              },
              {
                name: '采购售后应收',
                path: 'purchase-after-sale-order-receive',
                component: dynamicWrapper(app, ['purchaseAfterSaleOrderReceive'], () =>
                  import('../routes/Finance/PurchaseAfterSaleOrderReceive')
                ),
              },
            ],
          },
          {
            name: '账期管理',
            path: 'bill-management',
            children: [
              {
                name: '销售账期应收',
                path: 'sale-payment-list',
                component: dynamicWrapper(app, ['salePaymentList'], () =>
                  import('../routes/Purchase/SalePaymentList')
                ),
              },
              {
                hide: true,
                name: '销售账期应收',
                path: 'sale-payment-list',
                children: [
                  {
                    name: '销售账期应收详情',
                    path: 'sale-payment-message/:id',
                    component: dynamicWrapper(
                      app,
                      ['salePaymentMessage', 'user'],
                      () => import('../routes/Purchase/SalePaymentMessage')
                    ),
                  },

                ],
              },
              {
                name: '已销账列表', // ../routes/Purchase/DestroySalePaymentList
                path: 'destroy-sale-payment-list',
                component: dynamicWrapper(
                  app,
                  ['salePaymentList', 'user'],
                  () => import('../routes/Purchase/SalePaymentList')
                ),
              },
              {
                hide: true,
                name: '已销账列表',
                path: 'destroy-sale-payment-list',
                children: [
                  {
                    name: '已销账列表详情',
                    path: 'destroy-sale-payment-message/:id',
                    component: dynamicWrapper(
                      app,
                      ['salePaymentMessage', 'user'],
                      () => import('../routes/Purchase/SalePaymentMessage')
                    ),
                  },

                ],
              },

            ]

          },
          {
            name: '资金管理',
            path: 'funds-management',
            children: [
              {
                hide: true,
                name: '客户资金管理',
                path: 'customer-funds-list',
                children: [
                  {
                    name: '资金明细',
                    path: 'customer-funds-detail/:id',
                    component: dynamicWrapper(
                      app,
                      ['customerFundsDetail', 'user'],
                      () => import('../routes/Sale/CustomerFundsDetail')
                    ),
                  },
                ],
              },
              {
                name: '客户资金管理',
                path: 'customer-funds-list',
                component: dynamicWrapper(app, ['customerFundsList'], () =>
                  import('../routes/Sale/CustomerFundsList')
                ),
              },
              {
                name: '供应商资金管理',
                path: 'supplier-funds-list',
                component: dynamicWrapper(app, ['supplierFundsList'], () =>
                  import('../routes/Purchase/SupplierFundsList')
                ),
              },
              {
                hide: true,
                name: '供应商资金管理',
                path: 'supplier-funds-list',
                children: [
                  {
                    name: '资金明细',
                    path: 'supplier-funds-detail/:id',
                    component: dynamicWrapper(
                      app,
                      ['supplierFundsDetail', 'user'],
                      () => import('../routes/Purchase/SupplierFundsDetail')
                    ),
                  },
                ],
              },
            ]
          },
          {
            name: '票据管理',
            path: 'finance-invoice',
            children: [
              {
                name: '采购来票单', // 共用来票跟进表
                path: 'finance-purchase-in-inv-list',
                component: dynamicWrapper(app, ['purchaseInInvFollowList'],
                  () => import('../routes/Purchase/PurchaseInInvFollowList')
                ),
              },
              {
                hide: true,
                name: '采购来票单',
                path: 'finance-purchase-in-inv-list',
                children: [
                  {
                    name: '采购来票单详情',
                    path: 'finance-purchase-in-inv-detail/:id',
                    component: dynamicWrapper(
                      app,
                      ['financePurchaseInInvDetail', 'purchaseInInvFollowDetail'],
                      () => import('../routes/Finance/FinancePurchaseInInvDetail')
                    ),
                  },

                ],
              },
              {
                name: '待开票列表',
                path: 'await-invoice-list',
                component: dynamicWrapper(app, ['awaitInvoiceList'], () =>
                  import('../routes/Finance/AwaitInvoiceList')
                ),
              },
              {
                hide: true,
                name: '待开票列表',
                path: 'await-invoice-list',
                children: [
                  {
                    path: 'await-invoice-detail/:id',
                    name: '待开票详情',
                    component: dynamicWrapper(app, ['awaitInvoiceDetail'],
                      () => import('../routes/Finance/AwaitInvoiceDetail')
                    ),
                  },
                ],
              },
              {
                name: '发票进出明细总表',
                path: 'invoice-in-out-list',
                component: dynamicWrapper(app, ['invoiceInOutList'], () =>
                  import('../routes/Finance/InvoiceInOutList')
                ),
              },
              {
                name: '发票售后列表',
                path: 'invoice-after-sale-list',
                component: dynamicWrapper(app, ['invoiceAfterSaleList'], () =>
                  import('../routes/Finance/InvoiceAfterSaleList')
                ),

              },
              {
                hide: true,
                name: '发票售后列表',
                path: 'invoice-after-sale-list',
                children: [
                  {
                    // name: '手动来票',
                    path: 'manual-in-invoice',
                    component: dynamicWrapper(app, ['manualInInvoice'], () =>
                      import('../routes/Finance/ManualInInvoice')
                    ),
                  },
                  {
                    // name: '手动来票',
                    path: 'manual-in-invoice',
                    children: [
                      {
                        // name: '手动来票',
                        path: ':id/:type?',
                        component: dynamicWrapper(app, ['manualInInvoice'], () =>
                          import('../routes/Finance/ManualInInvoice')
                        ),
                      },
                    ],
                  },
                  {
                    name: '新建售后',
                    path: 'after-sale-add',
                    component: dynamicWrapper(app, ['afterSaleAdd'], () =>
                      import('../routes/Finance/AfterSaleAdd')
                    ),
                  },
                  {
                    name: '新建售后',
                    path: 'after-sale-add',
                    children: [
                      {
                        name: '新建售后',
                        path: ':id',
                        component: dynamicWrapper(app, ['afterSaleAdd'], () =>
                          import('../routes/Finance/AfterSaleAdd')
                        ),
                      },
                    ],
                  },
                ]
              },
              {
                name: '发票库存表',
                path: 'invoice-store-list',
                component: dynamicWrapper(app, ['invoiceStoreList'], () =>
                  import('../routes/Finance/InvoiceStoreList')
                ),
              },
              {
                hide: true,
                name: '发票库存表',
                path: 'invoice-store-list',
                children: [
                  {
                    path: ':detail/:id',
                    name: '发票进出明细',
                    component: dynamicWrapper(
                      app,
                      ['invoiceStoreList'],
                      () => import('../routes/Finance/InvoiceStoreList')
                    ),
                  },
                  {
                    path: 'add-invoice',
                    name: '新增发票明细',
                    component: dynamicWrapper(
                      app,
                      ['addInvoice'],
                      () => import('../routes/Finance/AddInvoice')
                    ),
                  },
                ],
              },
            ]
          },
          {
            name: '毛利管理',
            path: 'gross-profit',
            children: [
              {
                name: '按商品',
                path: 'gross-profit-by-product',
                component: dynamicWrapper(app, ['grossProfitByProduct'], () =>
                  import('../routes/Finance/GrossProfitByProduct')
                ),
              },
              {
                name: '按品类',
                path: 'gross-profit-by-sort',
                component: dynamicWrapper(app, ['grossProfitBySort'], () =>
                  import('../routes/Finance/GrossProfitBySort')
                ),
              },
              {
                name: '按客户',
                path: 'gross-profit-by-customer',
                component: dynamicWrapper(app, ['grossProfitByCustomer'], () =>
                  import('../routes/Finance/GrossProfitByCustomer')
                ),
              },
              {
                name: '按销售员',
                path: 'gross-profit-by-saler',
                component: dynamicWrapper(app, ['grossProfitBySaler'], () =>
                  import('../routes/Finance/GrossProfitBySaler')
                ),
              },
              {
                name: '加权平均价',
                path: 'average-price',
                component: dynamicWrapper(app, ['averageprice'], () =>
                  import('../routes/Finance/Averageprice')
                ),
              },
            ],
          },
          {
            name: '营业外收入',
            path: 'nonbusiness-income',
            component: dynamicWrapper(app, ['nonbusinessIncome','manualUpload'], () =>
              import('../routes/Finance/NonbusinessIncome')
            ),
          },
        ],
      },
      {
        name: '销售管理',
        icon: 'message',
        path: 'sale',
        children: [
          {
            name: '销售订单管理',
            path: 'sale-order',
            children: [
              {
                hide: true,
                name: '总单管理',
                path: 'sale-order-list',
                children: [
                  {
                    name: '新建销售订单',
                    path: 'sale-order-add',
                    component: dynamicWrapper(app, ['saleOrderAdd', 'user'], () =>
                      import('../routes/Sale/SaleOrderAdd')
                    ),
                  },
                  {
                    name: '销售订单详情',
                    path: 'sale-order-detail/:id',
                    component: dynamicWrapper(app, ['saleOrderDetail'], () =>
                      import('../routes/Sale/SaleOrderDetail')
                    ),
                  },
                  {
                    name: '新建销售订单',
                    path: 'sale-order-add',
                    children: [
                      {
                        path: ':id',
                        component: dynamicWrapper(
                          app,
                          ['saleOrderAdd', 'user'],
                          () => import('../routes/Sale/SaleOrderAdd')
                        ),
                      },
                    ],
                  },
                ],
              },
              {
                name: '总单管理',
                path: 'sale-order-list',
                component: dynamicWrapper(app, ['saleOrderList'], () =>
                  import('../routes/Sale/SaleOrderList')
                ),
              },
              {
                name: '一件代发',
                path: 'sale-agent',
                children: [
                  {
                    name: '销售订单',
                    path: 'sale-order-agent',
                    component: dynamicWrapper(app, ['saleOrderList'], () =>
                      import('../routes/Sale/SaleAgent')
                    ),
                  },
                  {
                    name: '销售售后单',
                    path: 'after-sale-order-agent',
                    component: dynamicWrapper(app, ['afterSaleOrderList'], () =>
                      import('../routes/Sale/AfterSaleAgent')
                    ),
                  },
                ]
              },
              {
                name: '子单管理',
                path: 'children-order',
                children: [
                  {
                    name: '直发订单',
                    path: 'await-out-store-list',
                    component: dynamicWrapper(app, ['awaitOutStoreList'], () =>
                      import('../routes/Sale/AwaitOutStoreList')
                    ),
                  },
                  {
                    name: '非直发订单',
                    path: 'no-direct-send-order-list',
                    component: dynamicWrapper(app, ['noDirectSendOrderList'], () =>
                      import('../routes/Sale/NoDirectSendOrderList')
                    ),
                  },
                ],
              },
              {
                name: '人工占用库存列表',
                path: 'manual-occupy',
                component: dynamicWrapper(app, ['manualOccupy'], () =>
                  import('../routes/Sale/ManualOccupy')
                ),
              },
              {
                hide: true,
                name: '售后单',
                path: 'after-sale-order-list',
                children: [
                  {
                    name: '销售订单详情',
                    path: 'after-sale-order-detail/:id/:type?',
                    component: dynamicWrapper(app, ['afterSaleOrderDetail'], () =>
                      import('../routes/Sale/AfterSaleOrderDetail')
                    ),
                  },
                  {
                    name: '新建售后单',
                    path: 'after-sale-order-add',
                    component: dynamicWrapper(
                      app,
                      ['afterSaleOrderAdd', 'user'],
                      () => import('../routes/Sale/AfterSaleOrderAdd')
                    ),
                  },
                  {
                    name: '新建售后单',
                    path: 'after-sale-order-add',
                    children: [
                      {
                        // path: ':type/:id?',
                        component: dynamicWrapper(
                          app,
                          ['afterSaleOrderAdd', 'user'],
                          () => import('../routes/Sale/AfterSaleOrderAdd')
                        ),
                      },
                    ],
                  },
                ],
              },
              {
                name: '售后单',
                path: 'after-sale-order-list',
                component: dynamicWrapper(app, ['afterSaleOrderList'], () =>
                  import('../routes/Sale/AfterSaleOrderList')
                ),
              },
              {
                name: '订单商品统计',
                path: 'goods-statistics-list',
                component: dynamicWrapper(app, ['goodsStatisticsList'], () =>
                  import('../routes/Sale/GoodsStatisticsList')
                ),
              },

            ]
          },
          {
            name: '销售账期管理',
            path: 'sale-bill',
            children: [
              {
                name: '销售账期对账总表',
                path: 'credit-list',
                component: dynamicWrapper(app, ['creditList'], () =>
                  import('../routes/Sale/CreditList')
                ),
              },
              {
                hide: true,
                name: '销售账期对账总表',
                path: 'credit-list',
                children: [
                  {
                    name: '销售账期分表',
                    path: 'bill-detail/:id',
                    component: dynamicWrapper(app, ['billDetail', 'user'], () =>
                      import('../routes/Sale/BillDetail')
                    ),
                  },
                ],
              },
            ]
          },
          {
            name: '票据管理',
            path: 'sale-invoice',
            children: [
              {
                name: '待申请开票表',
                path: 'sales-invoice-form',
                component: dynamicWrapper(app, ['salesInvoiceForm'], () =>
                  import('../routes/Sale/SalesInvoiceForm')
                ),
              },
              {
                name: '待开票跟进表',
                path: 'pending-follow-form',
                component: dynamicWrapper(app, ['pendingFollowUpForm'], () =>
                  import('../routes/Sale/PendingFollowUpForm')
                ),
              },
              {
                hide: true,
                name: '待开票跟进表',
                path: 'pending-follow-form',
                children: [
                  {
                    path: ':detail/:id',
                    name: '待开票详情',
                    component: dynamicWrapper(
                      app,
                      ['awaitInvoiceDetail'],
                      () => import('../routes/Finance/AwaitInvoiceDetail')
                    ),
                  },
                ],
              },
            ]
          },
        ],
      },
      {
        name: '运营管理',
        icon: 'appstore-o',
        path: 'operation',
        children: [
          {
            name: '商品管理',
            path: 'goods-manage',
            component: dynamicWrapper(app, ['goodsManage'], () =>
              import('../routes/Operation/GoodsManage')
            ),
          },
          {
            name: '媒体中心',
            path: 'media',
            children: [
              {
                name: '动态管理',
                path: 'content-manage',
                component: dynamicWrapper(app, ['contentManage'], () =>
                  import('../routes/Operation/ContentManage')
                ),
              },
              {
                name: '动态管理',
                path: 'content-manage',
                hide: true,
                children: [
                  {
                    name: '发图文/视频',
                    path: 'publish-content/:type/:id?',
                    component: dynamicWrapper(app, ['publishContent', 'resourcePool'], () =>
                      import('../routes/Operation/PublishContent')
                    ),
                  },
                 
                ]
              },
              // {
              //   name: '发图文/视频',
              //   path: 'post-content',
              //   component: dynamicWrapper(app, ['publishContent'], () =>
              //     import('../routes/Operation/PublishContent')
              //   ),
              // },



              {
                name: '发布方管理',
                path: 'poster-manage',
                component: dynamicWrapper(app, ['posterManage'], () =>
                  import('../routes/Operation/PosterManage')
                ),
              },
              // {
              //   name: '内容编辑',
              //   hide: true,
              //   path: 'content-Editer',
              //   component: dynamicWrapper(app, ['contentEditer'], () =>
              //     import('../routes/Operation/ContentEditer')
              //   ),
              // },
              {
                name: '素材管理',
                path: 'source-manage',
                component: dynamicWrapper(app, ['sourceManage'], () =>
                  import('../routes/Operation/SourceManage')
                ),
              },
              {
                name: '素材管理',
                path: 'source-manage',
                hide: true,
                children: [
                  {
                    path: ':id',
                    component: dynamicWrapper(
                      app,
                      ['sourceManage'],
                      () => import('../routes/Operation/SourceManage')
                    ),
                  },
                ],

              },
              // {
              //   name: '直播管理',
              //   path: 'broadcast-manage',
              //   component: dynamicWrapper(app, ['sourceManage'], () =>
              //       import('../routes/Operation/SourceManage')
              //   ),
              // },
              {
                name: '直播管理',
                path: 'broadcast-manage',
                // hide:true,
                children: [
                  {
                    name: '直播间列表',
                    path: 'broadcast-list',
                    component: dynamicWrapper(app, ['broadcastList'], () =>
                      import('../routes/Operation/BroadcastList')
                    ),
                  }, 

                  {
                    name: '直播活动列表',
                    path: 'broadcast-activity-list',
                    component: dynamicWrapper(app, ['broadcastActivityList'], () =>
                      import('../routes/Operation/BroadcastActivityList')
                    ),
                  },
                 
                  {
                    name: '直播活动列表',
                    path: 'broadcast-activity-list',
                    hide:true,
                    children: [
                      {
                        name: '新增直播活动',               
                        path: 'broadcast-detail/:op?/:id?',
                        component: dynamicWrapper(app, ['broadcastDetail','resourcePool'], () =>
                        import('../routes/Operation/BroadcastDetail')
                      ),
                      }, 
                     
                    ]
                  },
                  {
                    name: '录播文件管理',
                    path: 'broadcast-record-list',
                    component: dynamicWrapper(app, ['broadcastRecordList'], () =>
                      import('../routes/Operation/BroadcastRecordList')
                    ),
                  },                 
                  {
                    name: '录播文件管理',
                    path: 'broadcast-record-list',
                    hide: true,
                    children: [
                      {
                        name: '新增录播文件',               
                        path: 'broadcast-record-detail/:op?/:id?',
                        component: dynamicWrapper(app, ['broadcastRecordDetail','resourcePool'], () =>
                          import('../routes/Operation/BroadcastRecordDetail')
                        ),
                      }, 
                     
                    ]
                  },
                  // {
                  //   name: '新增录播文件',
                  //   hide:true,
                  //   path: 'broadcast-record-detail/:op?/:id?',
                  //   component: dynamicWrapper(app, ['broadcastRecordDetail','resourcePool'], () =>
                  //     import('../routes/Operation/BroadcastRecordDetail')
                  //   ),
                  // }, 
                ],

              },
            ]
          },

        ],
      },
      {
        name: '客户管理',
        icon: 'solution',
        path: 'customer',
        children: [
          {
            name: '客户列表',
            path: 'customer-list',
            component: dynamicWrapper(app, ['customerList'], () =>
              import('../routes/Customer/CustomerList')
            ),
          },
          {
            path: 'customer-list',
            name: '客户列表',
            hide: true,
            children: [
              {
                name: '客户详情',
                path: 'customer-detail/:id',
                component: dynamicWrapper(app, ['customerDetail'], () =>
                  import('../routes/Customer/CustomerDetail')
                ),
              },
              {
                name: '新增客户',
                path: 'add-customer',
                component: dynamicWrapper(app, ['addCustomer'], () =>
                  import('../routes/Customer/AddCustomer')
                ),
              },
              {
                name: '修改客户',
                path: 'add-customer',
                children: [
                  {
                    path: ':id/:isCheck',
                    component: dynamicWrapper(
                      app,
                      ['addCustomer'],
                      () => import('../routes/Customer/AddCustomer')
                    ),
                  },
                ],
              },
            ],
          },
          {
            name: '客户审核',
            path: 'customer-certification',
            component: dynamicWrapper(app, ['customerCertification'], () =>
              import('../routes/Customer/CustomerCertification')
            ),
          },
          {
            name: '客勤管理',
            path: 'customer-service-manage',
            component: dynamicWrapper(app, ['customerServiceManage'], () =>
              import('../routes/Customer/CustomerServiceManage')
            ),
          },
          {
            name: '销售员管理',
            path: 'seller-list',
            component: dynamicWrapper(app, ['sellerList'], () =>
              import('../routes/Customer/SellerList')
            ),
          },
          {
            hide: true,
            name: '销售员管理',
            path: 'seller-list',
            children: [
              {
                name: '销售员详情',
                path: 'seller-detail/:id',
                component: dynamicWrapper(app, ['sellerDetail'], () =>
                  import('../routes/Customer/SellerDetail')
                ),
              },
              {
                name: '新增销售员',
                path: 'seller-add',
                component: dynamicWrapper(app, ['sellerAdd', 'user'], () =>
                  import('../routes/Customer/SellerAdd')
                ),
              },
              {
                name: '新增销售员',
                path: 'seller-add',
                children: [
                  {
                    path: ':id',
                    component: dynamicWrapper(
                      app,
                      ['sellerAdd', 'user'],
                      () => import('../routes/Customer/SellerAdd')
                    ),
                  },
                ],
              },
            ],
          },
          {
            name: '经销商管理',
            path: 'agent-list',
            component: dynamicWrapper(app, ['agentList'], () =>
              import('../routes/Customer/AgentList')
            ),
          },
          {
            hide: true,
            name: '经销商管理',
            path: 'agent-list',
            children: [
              {
                name: '新增经销商',
                path: 'agent-add',
                component: dynamicWrapper(app, ['agentAdd'], () =>
                  import('../routes/Customer/AgentAdd')
                ),
              },
              {
                name: '新增经销商',
                path: 'agent-add',
                children: [
                  {
                    path: ':id',
                    component: dynamicWrapper(
                      app,
                      ['agentAdd'],
                      () => import('../routes/Customer/AgentAdd')
                    ),
                  },
                ],
              },
            ],
          },
          {
            name: '销售区域划分',
            path: 'sale-area',
            component: dynamicWrapper(app, ['saleArea'], () =>
              import('../routes/Customer/SaleArea')
            ),
          },
          {
            name: '分组管理',
            path: 'seller-team',
            component: dynamicWrapper(app, ['sellerTeam'], () =>
              import('../routes/Customer/SellerTeam')
            ),
          },
        ],
      },
      {
        name: '帮助中心',
        icon: 'question',
        path: 'help',
        children: [
          {
            name: '采购手册',
            path: 'purchase-guide',
            component: dynamicWrapper(app, [], () =>
              import('../routes/Help/PurchaseGuide')
            ),
          },
        ],
      },
      {
        name: '开发帮助',
        path: 'dev',
        icon: 'book',
        children: [
          {
            name: '表单页',
            path: 'form',
            icon: 'form',
            children: [
              {
                name: '基础表单',
                path: 'basic-form',
                component: dynamicWrapper(app, ['form'], () =>
                  import('../routes/Forms/BasicForm')
                ),
              },
              {
                name: '分步表单',
                path: 'step-form',
                component: dynamicWrapper(app, ['form'], () =>
                  import('../routes/Forms/StepForm')
                ),
                children: [
                  {
                    path: 'confirm',
                    component: dynamicWrapper(app, ['form'], () =>
                      import('../routes/Forms/StepForm/Step2')
                    ),
                  },
                  {
                    path: 'result',
                    component: dynamicWrapper(app, ['form'], () =>
                      import('../routes/Forms/StepForm/Step3')
                    ),
                  },
                ],
              },
              {
                name: '高级表单',
                path: 'advanced-form',
                component: dynamicWrapper(app, ['form'], () =>
                  import('../routes/Forms/AdvancedForm')
                ),
              },
            ],
          },
          {
            name: '列表页',
            path: 'list',
            icon: 'table',
            children: [
              {
                name: '查询表格',
                path: 'table-list',
                component: dynamicWrapper(app, ['rule'], () =>
                  import('../routes/List/TableList')
                ),
              },
              {
                name: '标准列表',
                path: 'basic-list',
                component: dynamicWrapper(app, ['list'], () =>
                  import('../routes/List/BasicList')
                ),
              },
              {
                name: '卡片列表',
                path: 'card-list',
                component: dynamicWrapper(app, ['list'], () =>
                  import('../routes/List/CardList')
                ),
              },
              {
                name: '搜索列表（项目）',
                path: 'cover-card-list',
                component: dynamicWrapper(app, ['list'], () =>
                  import('../routes/List/CoverCardList')
                ),
              },
              {
                name: '搜索列表（应用）',
                path: 'filter-card-list',
                component: dynamicWrapper(app, ['list'], () =>
                  import('../routes/List/FilterCardList')
                ),
              },
              {
                name: '搜索列表（文章）',
                path: 'search',
                component: dynamicWrapper(app, ['list'], () =>
                  import('../routes/List/SearchList')
                ),
              },
            ],
          },
          {
            name: '详情页',
            path: 'profile',
            icon: 'profile',
            children: [
              {
                name: '基础详情页',
                path: 'basic',
                component: dynamicWrapper(app, ['profile'], () =>
                  import('../routes/Profile/BasicProfile')
                ),
              },
              {
                name: '高级详情页',
                path: 'advanced',
                component: dynamicWrapper(app, ['profile'], () =>
                  import('../routes/Profile/AdvancedProfile')
                ),
              },
            ],
          },
          {
            name: '结果',
            path: 'result',
            icon: 'check-circle-o',
            children: [
              {
                name: '成功',
                path: 'success',
                component: dynamicWrapper(app, [], () =>
                  import('../routes/Result/Success')
                ),
              },
              {
                name: '失败',
                path: 'fail',
                component: dynamicWrapper(app, [], () =>
                  import('../routes/Result/Error')
                ),
              },
            ],
          },
          {
            name: '异常',
            path: 'exception',
            icon: 'warning',
            children: [
              {
                name: '403',
                path: '403',
                component: dynamicWrapper(app, [], () =>
                  import('../routes/Exception/403')
                ),
              },
              {
                name: '404',
                path: '404',
                component: dynamicWrapper(app, [], () =>
                  import('../routes/Exception/404')
                ),
              },
              {
                name: '500',
                path: '500',
                component: dynamicWrapper(app, [], () =>
                  import('../routes/Exception/500')
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    path: '/user',
    layout: 'UserLayout',
    children: [
      {
        name: '帐户',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['login', 'user'], () =>
              import('../routes/User/Login')
            ),
          },
          // {
          //   name: '注册',
          //   path: 'register',
          // component: dynamicWrapper(
          //   app, ['register'], () => import('../routes/User/Register')
          // ),
          // },
          // {
          //   name: '注册结果',
          //   path: 'register-result',
          //   component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
          // },
        ],
      },
    ],
  },
  // {
  //   component: dynamicWrapper(app, [], () => import('../layouts/BlankLayout')),
  //   layout: 'BlankLayout',
  //   children: {
  //     name: '使用文档',
  //     path: 'http://pro.ant.design/docs/getting-started',
  //     target: '_blank',
  //     icon: 'book',
  //   },
  // },
];
