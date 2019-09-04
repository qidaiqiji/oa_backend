import { stringify } from 'qs';
import request from '../utils/request';

// export async function reqGetOrderList(params) {
//   return request(`/sale/order-group/list?${stringify(params)}`);
// }
// export async function reqGenOrder(params) {
//   return request('path-to-API', {
//     method: 'POST',
//     body: {
//       ...params,
//     },
//   });
// }
export async function salesInvoiceForm(params) {
  return request(`/sale/order-goods/outcome-inv-list?${stringify(params)}`);
}
export async function salesInvoiceInvoiceConfig(params) {
  return request(`/finance/invoice-bill/config?${stringify(params)}`);
}

export async function reqUpdateInvoice(params) {
  return request(`/sale/invoice/update?${stringify({ invoiceId: params.invoiceId })}`, {
    method: 'POST',
    body: {
      data: {
        companyName: params.companyName,
        address: params.address,
        phoneNumber: params.phoneNumber,
        companyTaxID: params.companyTaxID,
        bank: params.bank,
        bankAccount: params.bankAccount,
      },
    },
  });
}
export async function reqDeleteInvoice(params) {
  return request(`/sale/invoice/delete?${stringify(params)}`, {
    method: 'POST',
  });
}
export async function reqGetinvoiceInfo(params) {
  return request(`/sale/invoice/list?${stringify(params)}`);
}

export async function reqAddInvoice(params) {
  return request(`/sale/invoice/create?${stringify(params)}`, {
    method: 'POST',
    body: {
      data: {
        userId: params.userId,
        companyName: params.companyName,
        address: params.address,
        phoneNumber: params.phoneNumber,
        companyTaxID: params.companyTaxID,
        bank: params.bank,
        bankAccount: params.bankAccount,
      },
    },
  });
}
export async function reqInvGoodsNameList(params) {
  return request(`/finance/invoice-item/invoice-goods-list?${stringify(params)}`);
}
export async function createInvoiceGoodsName(params) {
  return request('/finance/inv-goods/create', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}



export async function reqSaleOutInvCreate(params) {
  return request(`/sale/out-inv-follow/create?${stringify(params)}`, {
    method: 'POST',
    body: {
      data: {
        suitGoodsList: params.suitGoodsList,
        noSuitGoodsList: params.noSuitGoodsList,
        sellerRemark: params.sellerRemark,
        confirmCheck: params.confirmCheck,
        invInfoId: params.invInfoId,
        invType: params.invType,
      },
    },
  });
}
