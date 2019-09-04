import request from '../utils/request';
import { stringify } from 'qs';

export async function reqGetList(params) {
    return request(`/purchase/purchase-supplier-info/list?${stringify(params)}`);
}

export async function reqConfig(params) {
  return request(`/purchase/purchase-supplier-info/config?${stringify(params)}`);
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
