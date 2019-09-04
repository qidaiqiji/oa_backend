import React, { PureComponent } from 'react';
import globalStyles from '../../assets/style/global.less';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  Modal,
  Card,
  Row,
  Col,
  Select,
  Input,
  Table,
  Button,
  Tabs,
  DatePicker,
  Form,
} from 'antd';
import { Link } from 'dva/router';
// import styles from './SalePurchaseFollowList.less';
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
    salePurchaseFollowList: state.salePurchaseFollowList,
}))
export default class salePurchaseFollowList extends PureComponent{
   render() {
       return(
        <PageHeaderLayout title="销售采购跟进表">
            <Card  bordered={false}>
            <Tabs 
            defaultActiveKey="2"
            >
                <TabPane tab={<Link to="/purchase/common-purchase-follow-list" style={{color:'#000'}}>{"库存采购"}</Link>} key="1"></TabPane>
                <TabPane tab="代发采购" key="2">
                    <Row>
                        <Select
                        placeholder="请选择跟进状态"
                        className={globalStyles['select-sift']}
                        >
                            <Option value="1">已签收</Option>
                            <Option value="2">待跟进</Option>
                        </Select>
                        <Select
                        placeholder="请选择采购员"
                        className={globalStyles['select-sift']}
                        onChange={this.handleChangeSeller}
                        >
                            <Option value="3">EE</Option>
                            <Option value="4">Lucy</Option>
                        </Select>
                        <Search 
                        placeholder="商品名称/条码"
                        className={globalStyles['input-sift']}
                        />
                        <Search 
                        placeholder="采购单号"
                        className={globalStyles['input-sift']}
                        />
                        <Search 
                        placeholder="供应商"
                        className={globalStyles['input-sift']}
                        />
                        <RangePicker 
                        />
                    </Row>
                </TabPane>                
            </Tabs>
            </Card>
        </PageHeaderLayout>
       )
   }
}
