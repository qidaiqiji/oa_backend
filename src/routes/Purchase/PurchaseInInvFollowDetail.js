import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Row, Col, message, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../assets/style/global.less';
import InInvHeader from '../../components/Invoice/inInvHeader';

@connect(state => ({
  purchaseInInvFollowDetail: state.purchaseInInvFollowDetail,
}))
export default class PurchaseInInvFollowDetail extends React.Component {
     state={
       id: '',
     }
     componentWillMount = () => {
       const { match, dispatch } = this.props;
       const { params } = match;
       this.state.id = params.id;
       const { location } = this.props;
       if (location.pathname === '/purchase/invoice-management/purchase-in-inv-follow-list/purchase-in-inv-follow-detail') {
         dispatch({
           type: 'purchaseInInvFollowDetail/getDiferentPage',
           payload: {
             diferentPage: '1',
           },
         });
       } else if (location.pathname === '/purchase/invoice-management/purchase-in-inv-follow-list-n/purchase-in-inv-follow-detail-n') {
         dispatch({
           type: 'purchaseInInvFollowDetail/getDiferentPage',
           payload: {
             diferentPage: '2',
           },
         });
       }
     }

     componentDidMount() {
       const { match, dispatch } = this.props;
       const { params } = match;
       dispatch({
         type: 'purchaseInInvFollowDetail/mount',
         payload: {
           incomeInvOrderId: params.id,
         },
       });
     }
     componentWillReceiveProps(nextProps) {

     }
     componentWillUnmount() {
       const { dispatch } = this.props;
       dispatch({
         type: 'purchaseInInvFollowDetail/unmount',
       });
     }
     render() {
       const { isAllLoading, diferentPage } = this.props.purchaseInInvFollowDetail;
       return (
         <PageHeaderLayout title={diferentPage === '1' ? '来票跟进表详情' : '未开票金额列表详情'}>
           <Card bordered={false} loading={isAllLoading}>
             <div>
               <InInvHeader id={this.state.id} />
             </div>
           </Card>
         </PageHeaderLayout>
       );
     }
}
