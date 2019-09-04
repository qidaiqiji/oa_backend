import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Tree, Icon, Form, Modal, Row, Col, Select } from 'antd';
const { TreeNode } = Tree;
import styles from './SaleArea.less'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
@connect(state => ({
    saleArea: state.saleArea,
}))
@Form.create()
export default class SaleArea extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'saleArea/getAreaInfo',
            payload:{
                loading:true,
            }
        });
        dispatch({
            type: 'saleArea/getConfig',
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'saleArea/unmountReducer',
        });
    }
    handleSelectTreeNode=(selectRecord)=>{
        this.props.form.resetFields()
        const { dispatch } = this.props;
        dispatch({
            type: 'saleArea/updatePageReducer',
            payload:{
                selectRecord,
                showEditModal:true,
            }
        });
    }
    handleSubmit = (e) => {
        const { dispatch } = this.props;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            dispatch({
              type: 'saleArea/submitEdit',
              payload: {
                values,
              }
            });
          }
        });
    }
    handleCloseModal=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'saleArea/updatePageReducer',
            payload:{
                showEditModal:false,
                assistantTitle:''
            }
        });
    }
    handleChangeManagerId=(e)=>{
        this.props.form.resetFields()
        const { dispatch, saleArea } = this.props;
        const { selectRecord } = saleArea;
        selectRecord.managerId = e;
        dispatch({
            type: 'saleArea/updatePageReducer',
            payload:{
                selectRecord,
            }
        });
    }
  render() {
    const { 
        form,
        saleArea: { 
            list,
            showEditModal,
            name,
            sellerPhoneMap,
            loading,
            selectRecord,
        } 
    } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
    };
    return (
      <PageHeaderLayout title="销售区域划分">
        <Card bordered={false} loading={loading}>
        <Tree showLine className={styles.tree} defaultExpandedKeys={['1']}>
            {
                list.map(item=>{
                    return <TreeNode title={item.name} key={item.id}> 
                        {
                            item.areaList.map(area=>{
                                return <TreeNode 
                                title={<div 
                                    dangerouslySetInnerHTML={{__html: `${area.name}【${area.managerTitle}：<span style='color:red'>${area.manager}-${area.managerMobile}</span>】`}} 
                                    onClick={this.handleSelectTreeNode.bind(this,area)}
                                    />}
                                key={area.id}
                                >
                                    {
                                        area.provinceList.map(province=>{
                                            return <TreeNode
                                            title={<div 
                                                dangerouslySetInnerHTML={{__html: 
                                                `${province.name}【${province.managerTitle}：<span style='color:red'>${province.manager}-${province.managerMobile}</span>】
                                                【${province.assistantTitle}：<span style='color:red'>${province.assistant}-${province.assistantMobile}</span>】
                                                `}} 
                                                onClick={this.handleSelectTreeNode.bind(this,province)}
                                                />}
                                            key={province.id}
                                            >
                                                {
                                                    province.stateList.map(state=>{
                                                        return <TreeNode
                                                        title={<div 
                                                            dangerouslySetInnerHTML={{__html: `${state.name}【${state.managerTitle}：<span style='color:red'>${state.manager}-${state.managerMobile}</span>】`}} 
                                                            onClick={this.handleSelectTreeNode.bind(this,state)}
                                                            />}
                                                        key={state.id}
                                                        >
                                                            {
                                                                state.cityList.map(city=>{
                                                                    return <TreeNode title={city.name} key={city.id}>
                                                                    </TreeNode>
                                                                })
                                                            }
                                                        </TreeNode>
                                                    })
                                                }
                                            </TreeNode>
                                        })
                                    }
                                </TreeNode>
                            })
                        }
                    </TreeNode>
                })
            }
        </Tree>
        </Card>
        <Modal
        visible={showEditModal}
        onOk={this.handleSubmit}
        onCancel={this.handleCloseModal}
        title="编辑"
        >
            <Form onSubmit={this.handleSubmit}>
                <Form.Item {...formItemLayout} label="当前区域">
                    {selectRecord.name}
                </Form.Item>
                <Form.Item {...formItemLayout} label={selectRecord.managerTitle}>
                    {
                        getFieldDecorator('managerId',{
                            initialValue: selectRecord.managerId?''+selectRecord.managerId:'',
                            rules:[
                                {
                                    required: true, message:`请输入${selectRecord.managerTitle}`,
                                }
                            ]
                        })(
                            <Select
                            showSearch
                            allowClear
                            onChange={this.handleChangeManagerId}
                            dropdownMatchSelectWidth={false}
                            filterOption={(input, option) => {
                                return option.props.children.indexOf(input) >= 0;
                            }}
                            > 
                                {
                                    Object.keys(sellerPhoneMap).map((managerId) => {
                                        return (
                                            <Select.Option value={managerId}>{sellerPhoneMap[managerId]}</Select.Option>
                                        );
                                    })
                                }
                            </Select>
                        )
                    }
                </Form.Item>
                {
                    selectRecord.assistantTitle?<Form.Item {...formItemLayout} label={selectRecord.assistantTitle}>
                        {
                            getFieldDecorator('assistantId',{
                                initialValue: selectRecord.assistantId?''+selectRecord.assistantId:"",
                                rules:[
                                    {
                                        required: true, message: `请输入${selectRecord.managerTitle}`,
                                    }
                                ]
                            })(
                                <Select
                                showSearch
                                allowClear
                                dropdownMatchSelectWidth={false}
                                filterOption={(input, option) => {
                                    return option.props.children.indexOf(input) >= 0;
                                }}
                                > 
                                    {
                                        Object.keys(sellerPhoneMap).map((assistantId) => {
                                            return (
                                                <Select.Option value={assistantId}>{sellerPhoneMap[assistantId]}</Select.Option>
                                            );
                                        })
                                    }
                                </Select>
                            )
                        }
                    </Form.Item>:''
                }
               
            </Form>
            

        </Modal>
      </PageHeaderLayout>
    );
  }
}
