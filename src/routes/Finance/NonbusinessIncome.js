import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Table, Select, Input, DatePicker, Button, Modal, Form, Col, Upload, Icon, message, Dropdown, Menu,AutoComplete, Tooltip } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './NonbusinessIncome.less';
import globalStyles from '../../assets/style/global.less';
import TextArea from 'antd/lib/input/TextArea';
import ManualUpload from '../../components/ManualUpload';
import ClearIcon from '../../components/ClearIcon';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
const { Option } = Select;

@connect(state => ({
    nonbusinessIncome: state.nonbusinessIncome,
    manualUpload:state.manualUpload,
}))
@Form.create()
export default class NonbusinessIncome extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'nonbusinessIncome/getList',
    });
    dispatch({
        type: 'nonbusinessIncome/getConfig',
      });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'nonbusinessIncome/unmountReducer',
    });
  }
  handleChangeItems=(type,e)=>{
    const { dispatch } = this.props;
    dispatch({
        type:'nonbusinessIncome/updatePageReducer',
        payload:{
            [type]:e.target.value,
        }
    })
  }
  handleSearchItems=(type,e)=>{
    const { dispatch } = this.props;
    switch(type) {
        case 'currentPage':
            dispatch({
                type:'nonbusinessIncome/getList',
                payload:{
                    [type]:e,
                }
            })
        break;
        default:
            dispatch({
                type:'nonbusinessIncome/getList',
                payload:{
                    [type]:e,
                    currentPage:1,
                }
            })
        break;
    }
  }
  handleChangeDate=(date,dateString)=>{
    const { dispatch } = this.props;
    dispatch({
        type:'nonbusinessIncome/getList',
        payload:{
            createTimeStart:dateString[0],
            createTimeEnd:dateString[1],
            currentPage:1,
        }
    })
  }
  handleChangePageSize=(_, pageSize)=>{
    const { dispatch } = this.props;
    dispatch({
        type: 'nonbusinessIncome/getList',
        payload: {
            pageSize,
            currentPage: 1,
        },
    });
  }
  handleShowModal=(type)=>{
    const { dispatch } = this.props;
    dispatch({
        type: 'nonbusinessIncome/updatePageReducer',
        payload: {
            [type]:true,
        },
    });
  }
  handleCloseModal=(type)=>{
    const { dispatch } = this.props;
    dispatch({
        type: 'nonbusinessIncome/updatePageReducer',
        payload: {
            [type]:false,
            isEidt:false,
        },
    });
  }
  handleShowConfirmModal=(recordId,actionName,actionUrl)=>{
    const { dispatch } = this.props;
    dispatch({
        type: 'nonbusinessIncome/updatePageReducer',
        payload: {
            showConfirmModal:true,
            actionName,
            recordId,
            actionUrl,
        },
    });
  }
  handleConfirmCheck=()=>{
    const { dispatch } = this.props;
    dispatch({
        type: 'nonbusinessIncome/handleConfirm',
    });
  }
  handleAddCertificate=(record)=>{
    const { dispatch } = this.props;
    dispatch({
        type: 'nonbusinessIncome/updatePageReducer',
        payload:{
            recordId:record.id,
            showCertificateModal:true,
            record,
        }
    });
  }
  handleShowDetailModal=(record)=>{
    const { dispatch } = this.props;
    dispatch({
        type: 'nonbusinessIncome/updatePageReducer',
        payload:{
            recordId:record.id,
            showDetailModal:true,
            record,
        }
    });
  }
  handleShowEditModal=(record)=>{
    const { dispatch } = this.props;
    dispatch({
        type: 'nonbusinessIncome/updatePageReducer',
        payload:{
            record,
            showAddNew:true,
            isEidt:true,
            recordId:record.id
        }
    });
  }
  @Debounce(200)
  handleChangeSupplier=(type,text)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'nonbusinessIncome/changeSupplier',
      payload: {
        searchType:[type],
        supplierSearchText: text,
      },
    });
  }
  handleSelectSupplier(type,supplierId) {
    const { dispatch, nonbusinessIncome } = this.props;
    const { newRecord,isEdit, record } = nonbusinessIncome;
    switch(type){
        case 'search':
        dispatch({
            type: 'nonbusinessIncome/getList',
            payload: {
                currentPage: 1,
                supplierId,
            },
        });
        break;
        default:
            if(isEdit) {
                record.supplierId = supplierId;
                dispatch({
                    type: 'nonbusinessIncome/updatePageReducer',
                    payload: {
                        record,
                    },
                });
            }else{
                newRecord.supplierId = supplierId;
                dispatch({
                    type: 'nonbusinessIncome/updatePageReducer',
                    payload: {
                        newRecord,
                    },
                });
            }
            
        break;
    }
  }
  handleClear=(type)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'nonbusinessIncome/getList',
      payload: {
        [type]: '',
        currentPage:1,
      },
    });
  }
  handleChangeModalItems=(type,e)=>{
    const { dispatch, nonbusinessIncome } = this.props;
    const { newRecord, isEidt, record } = nonbusinessIncome;
    switch(type) {
        case 'incomeType':
        case 'incomeMethod':
        if(isEidt) {
            record[type]=e;
            dispatch({
                type: 'nonbusinessIncome/updatePageReducer',
                payload: {
                    record
                },
            }); 
        }else{
            newRecord[type]=e;
            dispatch({
                type: 'nonbusinessIncome/updatePageReducer',
                payload: {
                    newRecord
                },
            });
        }
        // newRecord[type] = e;
        break;
        default:
            if(isEidt) {
                record[type] = e.target.value;
                dispatch({
                    type: 'nonbusinessIncome/updatePageReducer',
                    payload: {
                        record,
                    },
                }); 
            }else{
                newRecord[type] = e.target.value;
                dispatch({
                    type: 'nonbusinessIncome/updatePageReducer',
                    payload: {
                        newRecord,
                    },
                }); 
            }
        break;
    }
  }
  handleSubmit=(e)=>{
    const { dispatch, manualUpload, nonbusinessIncome } = this.props;
    const { fileList } = manualUpload;
    const { recordId, record } = nonbusinessIncome;
    e.preventDefault();
    const formData = new FormData();
    fileList.forEach((file) => {
        formData.append('file', file);
    });
    this.props.form.validateFields((err, values) => {
        if (!err) {
            Object.keys(values).map(item=>{
                formData.append(item,values[item]);
            })
            formData.append('incomeId', recordId);
            formData.append('supplierInfoId', record.supplierId);
            dispatch({
                type:'nonbusinessIncome/submitAddCertificate',
                payload:{
                    formData,
                    buttonLoading:true,
                }
            })
        }
    });
}
    handleConfirmAdd=(e)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'nonbusinessIncome/handleCommit',
            payload:{
                submitLoading:true,
            }
        })
    }
    handleShowAddNewModal=()=>{
        const { dispatch } = this.props;
        dispatch({
            type:'nonbusinessIncome/updatePageReducer',
            payload:{
                showAddNew:true,
                record:{}
            }
        })
    }
    handleShowRecordDetailModal=(detailRecord)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'nonbusinessIncome/updatePageReducer',
            payload:{
                detailRecord,
                isShowPayInfoConfirm:true,
            }
        })
    }
    @Debounce(200)
    handleSearchKeyWords=(keyWords)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'nonbusinessIncome/searchKeywords',
            payload: {
                keyWords,
            }
        });
    }
    handleChangePayMethod=(e)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'nonbusinessIncome/updatePageReducer',
            payload: {
                payMethod:e,
            }
        });
    }
    handleShowCertificateModal=()=>{
        const { dispatch } = this.props;
        this.props.form.resetFields();
        dispatch({
            type: 'nonbusinessIncome/updatePageReducer',
            payload: {
                showCertificateModal:true,
            }
        });
        dispatch({
            type:'manualUpload/updatePageReducer',
            payload:{
                fileList:[],
                files:[],
            }
        })
    }
    handleShowDeleteModal=(record)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'nonbusinessIncome/updatePageReducer',
            payload: {
                deleteRecord:record,
                showDeleteModal:true,
            }
        });
    }
    handleDeleteRecord=()=>{
        const { dispatch, nonbusinessIncome } = this.props;
        const { deleteRecord } = nonbusinessIncome;
        dispatch({
            type: 'nonbusinessIncome/deleteRecord',
            payload: {
                id:deleteRecord.id,
                payType:deleteRecord.payType,
                showDeleteModal:false,
            }
        });
    }
    handlePreview=(payProof)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'nonbusinessIncome/updatePageReducer',
            payload: {
                showPreviewModal:true,
                payProof,
            }
        });
    }
  render() {
    const { 
        form,
        dispatch,
        nonbusinessIncome: {
        showAddNew,
        showCertificateModal,
        buttonLoading,
        submitLoading,
        showDetailModal,
        incomeList,
        allBussinessAmount,
        shopServiceAmount,
        returnGoodsAmount,
        policyRebateAmount,
        total,
        currentPage,
        pageSize,
        isTableLoading,
        remark,
        showConfirmModal,
        actionName,
        record,
        
        payMethod,
        receiveAccountId,
        transactionSn,
        isEidt,
        supplierSuggest,
        incomeMethodMap,
        statusMap,
        incomeTypeMap,
        purchaseOrder,
        amount,
        collectAccountMap,
        newRecord,
        supplierSearchText,
        isShowPayInfoConfirm,
        detailRecord,
        userList,
        partIncomeMethodMap,
        showDeleteModal,
        waitCheckAmount,
        showPreviewModal,
        payProof,
        followPersonMap,
        otherAmount,
    },
    manualUpload:{
        fileList,
    }
    } = this.props;
    // const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    const remarkItemLayout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 18 },
    }
    const columns = [
        {
            title: '审核状态',
            dataIndex: 'status',
            key: 'status',
            width:150,
            render:(status,record)=>{
                return <div>
                    <span>{statusMap[status]}</span>
                    <div>
                        {
                            record.tag.map(item=>{
                                return <Tooltip title={item.remark}><span className={globalStyles.tag} style={{background:item.color}}>{item.name}</span></Tooltip>
                            })
                        }
                    </div>
                </div>
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width:90,
        },
        {
            title: '收入类型',
            dataIndex: 'incomeType',
            key: 'incomeType',
            width:120,
            render:(incomeType)=>{
                return <span>{incomeTypeMap[incomeType]}</span>
            }
        },
        {
            title: '收入方式',
            dataIndex: 'incomeMethod',
            key: 'incomeMethod',
            width:100,
            render:(incomeMethod)=>{
                return <span>{incomeMethodMap[incomeMethod]}</span>
            }
        },
        {
            title: '供应商',
            dataIndex: 'supplierName',
            key: 'supplierName',
            width:200
        },
        {
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            width:100,
            render:(amount,record)=>{
                return <Tooltip title={<div>
                    <p>原金额:{record.allAmount}</p>
                    <p>售后金额:{record.backAmount}</p>
                </div>}>
                    {amount}
                </Tooltip>
            }
        },
        {
            title: '跟进人',
            dataIndex: 'followPerson',
            key: 'followPerson',
            width:100,
        },
        {
            title: '关联信息',
            dataIndex: 'purchaseOrderId',
            key: 'purchaseOrderId',
            width:150,
            render:(purchaseOrderId,record)=>{
                return <div>
                    {
                        purchaseOrderId?<span>{"采购单号:"}<Link to={`/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${purchaseOrderId}`}>{purchaseOrderId}</Link></span>
                        :''
                    }
                    {
                        record.incomeMethod==1&&record.status==3?"财务已收款":record.incomeMethod==2?"财务已挂账":""
                    }
                </div>
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width:120,
        },
        {
            title: '操作',
            dataIndex: '',
            key: '',
            width:300,
            render:(_,record)=>{
                return record.incomeType!=3&&<div className={styles.actionBtn}>
                    {
                        record.actionList&&record.actionList.map(item=>{
                            return <Button onClick={this.handleShowConfirmModal.bind(this,record.id,item.name,item.url)} size="small" ghost type="primary">{item.name}</Button>
                        })
                    }
                    {
                        record.status==2?<Button onClick={this.handleShowDetailModal.bind(this,record)} size="small" ghost type="primary">上传凭证</Button>:
                        record.status==3?<Button onClick={this.handleShowDetailModal.bind(this,record)} size="small" ghost type="primary">查看凭证</Button>:""
                    }
                    {
                        record.status==4?<Button onClick={this.handleShowEditModal.bind(this,record)} size="small" ghost type="primary">编辑</Button>:""
                    }
                </div>
            }
        },
    ];
    const recordColumns = [
        {
            title: '收款日期',
            dataIndex: 'receiveTime',
            key: 'receiveTime',
        },
        {
            title: '银行流水',
            dataIndex: 'sn',
            key: 'sn',
        },
        {
            title: '收款金额',
            dataIndex: 'money',
            key: 'money',
        },
        {
            title: '收款账户',
            dataIndex: 'receiptAccount',
            key: 'receiptAccount',
            render:(receiptAccount)=>{
                return <div>
                    {collectAccountMap.map(item=>{
                        if(item.id == receiptAccount) {
                            return <span>{item.accountInfo}</span>
                        }
                    })}
                </div>
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '付款凭证',
            dataIndex: 'payProof',
            key: 'payProof',
            render:(payProof)=>{
                return payProof?<img src={payProof} style={{width:40,height:40}} onClick={this.handlePreview.bind(this,payProof)}/>:''
            }
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render:(_, record)=>{
                return <Dropdown
                placement="bottomCenter"
                overlay={(
                  <Menu>
                    <Menu.Item>
                        <div onClick={this.handleShowDeleteModal.bind(this,record)}>
                            <Icon type="delete"/>作废
                        </div>
                    </Menu.Item>
                    <Menu.Item>
                        <div onClick={this.handleShowRecordDetailModal.bind(this,record)}>
                            <Icon type="bars"/>详情
                        </div>
                    </Menu.Item>
                  </Menu>
                )}
              >
                <Icon type="ellipsis" />
              </Dropdown>
            }
        },
    ]
    return (
      <PageHeaderLayout title="营业外收入">
        <Card bordered={false} >
            <Row>
                <Select
                placeholder="审核状态"
                style={{width:200,marginRight:10}} 
                onChange={this.handleSearchItems.bind(this,'checkStatus')}
                dropdownMatchSelectWidth={false}
                allowClear
                >
                    <Option value="">{"全部"}</Option>
                    {
                        Object.keys(statusMap).map(key => (
                            <Option value={key}>{statusMap[key]}</Option>
                        ))
                    }
                </Select>
                <Select
                placeholder="收入类型"
                style={{width:200,marginRight:10}} 
                onChange={this.handleSearchItems.bind(this,'incomeType')}
                dropdownMatchSelectWidth={false}
                allowClear
                >
                    <Option value="">{"全部"}</Option>
                    {
                        Object.keys(incomeTypeMap).map(key => (
                            <Option value={key}>{incomeTypeMap[key]}</Option>
                        ))
                    }
                </Select>
                <Select
                placeholder="收入方式"
                style={{width:200,marginRight:10}} 
                onChange={this.handleSearchItems.bind(this,'incomeMethod')}
                dropdownMatchSelectWidth={false}
                allowClear
                >
                    <Option value="">{"全部"}</Option>
                    {
                        Object.keys(incomeMethodMap).map(key => (
                            <Option value={key}>{incomeMethodMap[key]}</Option>
                        ))
                    }
                </Select>
                <Select
                placeholder="请选择跟进人"
                style={{width:200,marginRight:10}} 
                onChange={this.handleSearchItems.bind(this,'followPersonId')}
                dropdownMatchSelectWidth={false}
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                allowClear
                >
                    <Option value="">{"全部"}</Option>
                    {
                        Object.keys(followPersonMap).map(key => (
                            <Option value={key}>{followPersonMap[key]}</Option>
                        ))
                    }
                </Select>
                {/* <AutoComplete
                dataSource={Object.keys(userList).map((item) => {
                    return (
                    <Select.Option value={item}>{userList[item]}</Select.Option>
                    );
                })}
                style={{width:200,marginRight:10}} 
                onSearch={this.handleSearchKeyWords}
                onSelect={this.handleSearchItems.bind(this,'followPersonId')}
                allowClear
                dropdownMatchSelectWidth={false}
                placeholder="请选择跟进人"
                /> */}
                <AutoComplete
                    dataSource={supplierSuggest && supplierSuggest.map((suggest) => {
                        return (
                        <Select.Option value={suggest.id.toString()}>{suggest.name}</Select.Option>
                        );
                    })}
                    onSelect={this.handleSelectSupplier.bind(this,'search')}
                    onSearch={this.handleChangeSupplier.bind(this,'search')}
                    className={globalStyles['input-sift']}
                    allowClear
                    dropdownMatchSelectWidth={false}
                    placeholder="请输入供应商"
                    >
                </AutoComplete>
                <Input.Search 
                placeholder="请输入采购单号"
                className={globalStyles['input-sift']}     
                onChange={this.handleChangeItems.bind(this,'purchaseOrder')}    
                onSearch={this.handleSearchItems.bind(this,'purchaseOrder')} 
                value={purchaseOrder} 
                suffix={purchaseOrder?<ClearIcon 
                    handleClear={this.handleClear.bind(this,"purchaseOrder")}
                />:""} 
                />
            </Row>
            <Row type="flex">
                <Col span={6}>
                    创建时间：
                    <DatePicker.RangePicker   
                    style={{width:250,marginRight:10}}
                    // value={[contractExpireDateStart ? moment(contractExpireDateStart, 'YYYY-MM-DD') : '',contractExpireDateEnd ? moment(contractExpireDateEnd, 'YYYY-MM-DD') : '']}
                    onChange={this.handleChangeDate}                  
                    />
                </Col>
                <Col span={2} push={16}>
                    <Button type="primary" onClick={this.handleShowAddNewModal}>新增收入</Button>
                </Col>
            </Row>
            <Row className={styles.inline}>
                <div>总营业外收入：<span>{allBussinessAmount}</span></div>
                <div>平台服务费总额：<span>{shopServiceAmount}</span></div>
                <div>订单货返总额：<span>{returnGoodsAmount}</span></div>
                <div>政策返利总额：<span>{policyRebateAmount}</span></div>
                <div>其他总额：<span>{otherAmount}</span></div>
                <div>待审核总额：<span style={{color:'green'}}>{waitCheckAmount}</span></div>
            </Row>
            <Table
                loading={isTableLoading}
                bordered
                dataSource={incomeList}
                rowKey={record => record.id}
                className={globalStyles.tablestyle}
                columns={columns}
                pagination={{
                  current: currentPage,
                  showTotal:total => `共 ${total} 个结果`,
                  pageSize,
                  pageSizeOptions:["20","30","40","50","100"],
                  onChange: this.handleSearchItems.bind(this,'currentPage'),
                  onShowSizeChange: this.handleChangePageSize,
                  showSizeChanger: true,
                  showQuickJumper: false,
                  total,
                }}
            />
        </Card>
        <Modal
        visible={showAddNew}
        title={isEidt?"编辑营业外收入":"新增营业外收入"}
        onCancel={this.handleCloseModal.bind(this,'showAddNew')}
        // footer={null}
        okText="提交主管审核"
        maskClosable={false}
        onOk={this.handleConfirmAdd}
        >
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Form.Item {...formItemLayout} label="收入类型" className={styles.labelStar}>
                        {
                          
                            <Select
                            placeholder="请选择收入类型"
                            style={{width:250}}
                            onChange={this.handleChangeModalItems.bind(this,'incomeType')}
                            value={record.incomeType?incomeTypeMap[record.incomeType]:incomeTypeMap[newRecord.incomeType]}
                            >
                                {
                                    Object.keys(incomeTypeMap).map(item=>{
                                        return <Option key={item} value={item}>{incomeTypeMap[item]}</Option>
                                    })
                                }
                            </Select>
                        }
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item {...formItemLayout} label="收入方式"  className={styles.labelStar}>
                        {
                            <Select
                            placeholder="请选择收入方式"
                            style={{width:250}}
                            onChange={this.handleChangeModalItems.bind(this,'incomeMethod')}
                            value={record.incomeMethod?partIncomeMethodMap[record.incomeMethod]:partIncomeMethodMap[newRecord.incomeMethod]}
                            >
                                {
                                    Object.keys(partIncomeMethodMap).map(item=>{
                                        return <Option key={item} value={item}>{partIncomeMethodMap[item]}</Option>
                                    })
                                }
                            </Select>
                        }
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item label="供应商" {...formItemLayout}  className={styles.labelStar}>
                        <AutoComplete
                        dataSource={supplierSuggest && supplierSuggest.map((suggest) => {
                            return (
                            <Select.Option value={suggest.id.toString()}>{suggest.name}</Select.Option>
                            );
                        })}
                        onSearch={this.handleChangeSupplier.bind(this,'addNew')}
                        onSelect={this.handleSelectSupplier.bind(this,'addNew')}            
                        style={{width:250}}
                        allowClear
                        dropdownMatchSelectWidth={false}
                        defaultValue={supplierSearchText?supplierSearchText:record.supplierName}
                        >
                            {/* <Input value={isEidt?record.supplierName:supplierSearchText}/> */}
                        </AutoComplete>  
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item {...formItemLayout} label="金额"  className={styles.labelStar}>
                    {
                        
                        <Input 
                        style={{width:200}}
                        onChange={this.handleChangeModalItems.bind(this,'amount')}
                        value={record.amount?record.amount:newRecord.amount}
                        />
                    }
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item {...formItemLayout} label="备注">
                    {
                        <TextArea 
                        value={record.remark?record.remark:newRecord.remark}
                        onChange={this.handleChangeModalItems.bind(this,'remark')}
                        rows={4} style={{width:250}}/>
                    }
                    </Form.Item>
                </Row>
            </Form>
        </Modal>
        <Modal
        title="添加收款凭证"
        visible={showCertificateModal}
        footer={null}
        onCancel={this.handleCloseModal.bind(this,'showCertificateModal')}
        width={700}
        maskClosable={false}
        >
            <Row className={styles.topLine}>
                <div>
                    应收金额: <span>{record.amount}</span>
                </div>
                <div>
                    待收金额: <span style={{color:'red'}}>{record.waitPayAmount}</span>
                </div>
                <div>
                    已收款金额: <span>{record.paidAmount}</span>
                </div>
            </Row>
             <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={12}>
                        <Form.Item {...formItemLayout} label="支付方式">
                            {
                                getFieldDecorator('payMethod',{
                                    initialValue:payMethod,
                                    rules:[
                                        {
                                            required: true, message: '请选择支付方式',
                                        }
                                    ]
                                })(
                                    <Select
                                    placeholder="请选择支付方式"
                                    style={{width:200}}
                                    allowClear
                                    dropdownMatchSelectWidth={false}
                                    onChange={this.handleChangePayMethod}
                                    >
                                        {
                                            Object.keys(partIncomeMethodMap).map(item=>{
                                                return <Option key={item} value={item}>{partIncomeMethodMap[item]}</Option>
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                    {
                        payMethod==1&&<Col span={12}>
                        <Form.Item {...formItemLayout} label="收款账户">
                            {
                                getFieldDecorator('receiveAccountId',{
                                    initialValue:receiveAccountId,
                                    rules:[
                                        {
                                            required: true, message: '请选择收款账户',
                                        }
                                    ]
                                })(
                                    <Select
                                    placeholder="请选择收款账户"
                                    style={{width:200}}
                                    allowClear
                                    dropdownMatchSelectWidth={false}
                                    >
                                        {
                                            collectAccountMap.map(item=>{
                                                return <Option key={item.id} value={item.id}>{item.accountInfo}</Option>
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                    }
                    {/* <Col span={12}>
                        <Form.Item {...formItemLayout} label="收款账户">
                            {
                                getFieldDecorator('receiveAccountId',{
                                    initialValue:receiveAccountId,
                                    rules:[
                                        {
                                            required: true, message: '请选择收款账户',
                                        }
                                    ]
                                })(
                                    <Select
                                    placeholder="请选择收款账户"
                                    style={{width:200}}
                                    allowClear
                                    dropdownMatchSelectWidth={false}
                                    >
                                        {
                                            collectAccountMap.map(item=>{
                                                return <Option key={item.id} value={item.id}>{item.accountInfo}</Option>
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Form.Item>
                    </Col> */}
                </Row>
                <Row>
                    {
                        payMethod==1&&<Col span={12}>
                        <Form.Item {...formItemLayout} label="银行流水">
                        {
                            getFieldDecorator('transactionSn',{
                                initialValue:transactionSn,
                                rules:[
                                    {
                                        required: true, message: '请输入银行流水',
                                    },
                                ]
                            })(
                                <Input style={{width:200}}/>
                            )
                        }
                        </Form.Item>
                    </Col>
                    }
                    <Col span={12}>
                        <Form.Item {...formItemLayout} label="收款金额">
                        {
                            getFieldDecorator('amount',{
                                initialValue:amount,
                                rules:[
                                    {
                                        required: true, message: '请输入金额',
                                    },
                                ]
                            })(
                                <Input style={{width:200}}/>
                            )
                        }
                        </Form.Item>
                    </Col>
                </Row>
               {
                   payMethod==1&& <Row>
                        <Form.Item {...remarkItemLayout} label="上传凭证">
                        {
                            <ManualUpload
                            multiple={false}
                            disabled={true}
                            />
                        }
                        </Form.Item>
                    </Row>
               }
                <Row>
                    <Form.Item {...remarkItemLayout} label="备注">
                    {
                        getFieldDecorator('remark',{
                            initialValue:remark, 
                        })(
                            <TextArea rows={4} style={{width:500}}/>
                        )
                    }
                    </Form.Item>
                </Row>
                <Form.Item>
                    <Row type="flex" justify="center">
                        <Button type="primary" htmlType="submit" style={{marginRight:20}} loading={buttonLoading}>
                            确定
                        </Button>
                        <Button onClick={this.handleCloseModal.bind(this,'showCertificateModal')}>取消</Button>
                    </Row>
                </Form.Item>   
            </Form>
        </Modal>
        {/* 收款信息的弹窗 */}
        <Modal
        visible={showDetailModal}
        footer={null}
        width={1200}
        onCancel={this.handleCloseModal.bind(this,'showDetailModal')}
        >
            <div style={{background:"#f2f2f2",padding:10,marginBottom:20}}>
                <Row><h2>收款信息</h2></Row>
                <Row className={styles.inline} type="flex" align="middle">
                    <Col span={18}>
                        <div>应收金额：<span>{record.amount}</span></div>
                        <div>待收金额：<span  style={{color:"red"}}>{record.waitPayAmount}</span></div>
                        <div>供应商名称：<span>{record.supplierName}</span></div>
                    </Col>
                    <Col span={5}>
                        <Button onClick={this.handleShowCertificateModal} type="primary">添加收款凭证</Button>
                    </Col>
                </Row>
            </div>
            <Table
            bordered
            columns={recordColumns}
            dataSource={record.recordList}
            rowKey={record => record.id}
            pagination={false}
            />
        </Modal>
        <Modal
        visible={showConfirmModal}
        title="确认"
        onOk={this.handleConfirmCheck}
        onCancel={this.handleCloseModal.bind(this,'showConfirmModal')}
        >
            <p>请确认是否{actionName}</p>
            {
                actionName == "驳回"?<TextArea
                 roes={3}
                 placeholder="请填写驳回意见"
                 onChange={this.handleChangeItems.bind(this,'rejectRemark')}
                />:''
            }
        </Modal>
        <Modal
            width={1000}
            visible={isShowPayInfoConfirm}
            onCancel={this.handleCloseModal.bind(this,'isShowPayInfoConfirm')}
            footer={null}
          >
            <div style={{ height: '60px', lineHeight: '60px', backgroundColor: '#E5E5E5' }}>
              <span style={{ fontSize: '20px', fontWeight: '600', marginLeft: '25px' }}>采购订单付款详情</span>
            </div>
            <Row className={styles.detail}>
                <span>供应商名称: {record.supplierName}</span>
            </Row>
            <Row className={styles.detail}>
                <span>收款日期: {detailRecord.receiveTime}</span>
            </Row>
            <Row className={styles.detail}>
                <span>银行流水: {detailRecord.sn}</span>
            </Row>
            <Row className={styles.detail}>
                <span>收款金额: {detailRecord.money}</span>
            </Row>
            <Row className={styles.detail}>
                <span>收款账户: 
                {collectAccountMap.map(item=>(
                    item.id == detailRecord.receiptAccount?item.accountInfo:""
                ))}</span>
            </Row>
          </Modal>
          <Modal 
          title="确认"
          visible={showDeleteModal}
          onOk={this.handleDeleteRecord}
          onCancel={this.handleCloseModal.bind(this,'showDeleteModal')}
          >
              请确认是否作废？
          </Modal>
          <Modal visible={showPreviewModal} footer={null} onCancel={this.handleCloseModal.bind(this,'showPreviewModal')}>
            <img style={{ width: '100%' }} src={payProof} />
         </Modal>
      </PageHeaderLayout>
    );
  }
}
