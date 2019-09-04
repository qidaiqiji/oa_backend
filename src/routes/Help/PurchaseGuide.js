import React, { PureComponent } from 'react';
import { Card,Table, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Link } from 'dva/router';
export default class addInvoice extends PureComponent {
  render() {
      const data = [
        {
          name:'采购流程操作手册',
          size:'9.41MB',
          data:'2019-3-15'
        }
      ]
      const columns= [
        {
            title: '文件名称',
            key: 'name',
            dataIndex: 'name',
            align:'center',
        },
        {
            title: '文件大小',
            key: 'size',
            dataIndex: 'size',
            align:'center',
        },
        {
            title: '上传日期',
            key: 'data',
            dataIndex: 'data',
            align:'center',
        },
        {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            align:'center',
            render:()=>{
                return <a href="http://erp.xiaomei360.com/downloads/%E5%B0%8F%E7%BE%8E%E8%AF%9A%E5%93%81OA%E7%B3%BB%E7%BB%9F%E9%87%87%E8%B4%AD%E6%B5%81%E7%A8%8B%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.doc"><Button type="primary">下载</Button></a>
            }
        },
      ]
    return (
      <PageHeaderLayout title="采购手册">
        <Card bordered={false} >
          <Table
            bordered
            dataSource={data}
            columns={columns}
            // size="small"
            // rowKey={record => record.id}
            // pagination={false}
          />
        </Card>
      </PageHeaderLayout>
    );
  } 
}
