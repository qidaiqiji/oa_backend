import { stringify } from 'qs';
import request from '../utils/request';
// import { API } from '../dev-config';

export async function reqGetOrderInfo(params) {
  return request(`/sale/order-group/detail?${stringify(params)}`);
}
export async function reqGetSuppliers() {
  return request('/api/getSaleSuppliers');
}
export async function reqGetGoods(params) {
  return request(`/sale/goods/list?${stringify(params)}`);
}

export async function reqGetinvoiceInfo(params) {
  return request(`/sale/invoice/list?${stringify(params)}`);
}

export async function reqGetUsers(params) {
  return request(`/sale/user/list?${stringify(params)}`);
}

export async function reqGetReceiving(params) {
  return request(`/sale/user-address/list?${stringify(params)}`);
}

export async function reqGetOrderConfig() {
  return request('/sale/order-group/config');
}

export async function reqChangeDefaultReceiving(params) {
  return request(`/sale/user-address/default?${stringify(params)}`);
}

export async function reqDeleteReceiving(params) {
  return request(`/sale/user-address/delete?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function reqDeleteInvoice(params) {
  return request(`/sale/invoice/delete?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function reqChangeDefaultInvoice(params) {
  return request('/sale/sale-order/change-invoice-default', {
    method: 'POST',
    body: {
      data: {
        userId: params.userId,
        invoiceId: params.invoiceId,
        isDefault: params.isDefault,
      },
    },
  });
}

export async function reqEditOrder(params) {
  return request('/sale/sale-order/edit', {
    method: 'POST',
    body: {
      data: {
        goodsList: params.goodsInfos,
        fullAddress: params.detailAddress,
        purchaseOrderId: params.orderId,
        remark: params.remark,
      },
    },
  });
}

export async function reqAddReceivingInfo(params) {
  return request('/sale/user-address/create', {
    method: 'POST',
    body: {
      data: {
        userId: params.userId,
        userName: params.userName,
        mobilePhone: params.mobilePhone,
        province: params.province,
        city: params.city,
        district: params.district,
        address: params.address,
      },
    },
  });
}

export async function reqUpdateReceivingInfo(params) {
  return request(`/sale/user-address/update?${stringify({ addressId: params.addressId })}`, {
    method: 'POST',
    body: {
      data: {
        userId: params.userId,
        userName: params.userName,
        mobilePhone: params.mobilePhone,
        province: params.province,
        city: params.city,
        district: params.district,
        address: params.address,
      },
    },
  });
}

export async function reqAddInvoice(params) {
  return request('/sale/invoice/create', {
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

export async function reqSaveOrder(params) {
  return request('/sale/order-group/create', {
    method: 'POST',
    body: {
      data: {
        userId: params.userId,
        fareInfo: params.fareInfo,
        receiving: params.receiving,
        date: params.date,
        payInfo: params.payInfo,
        invoiceInfo: params.invoiceInfo,
        invoiceType: params.invoiceType,
        goodsInfos: params.goodsInfos,
        specialPrice: params.specialPrice,
        remark: params.remark,
        payCondition: params.payCondition,
      },
    },
  });
}

export async function reqSaveModifyOrder(params) {
  return request(`/sale/order-group/update?${stringify({ id: params.id })}`, {
    method: 'POST',
    body: {
      data: {
        userId: params.userId,
        receiving: params.receiving,
        date: params.date,
        payInfo: params.payInfo,
        invoiceInfo: params.invoiceInfo,
        invoiceType: params.invoiceType,
        goodsInfos: params.goodsInfos,
        specialPrice: params.specialPrice,
        remark: params.remark,
        payCondition: params.payCondition,
      },
    },
  });
}
export async function reqGetAddressOptions() {
  return request('/api/getAddressOptionsSale');
}
export async function reqDeleteGoods(params) {
  return request('/sale/sale-order/delete-goods', {
    method: 'POST',
    body: {
      data: {
        ...params,
      },
    },
  });
}
