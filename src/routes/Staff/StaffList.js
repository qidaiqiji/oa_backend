import React, { PureComponent } from 'react';
import moment from 'moment';
import { stringify } from 'qs';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Modal, Table, Button,DatePicker, Radio, Upload, message, notification  } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../assets/style/global.less';

const { RangePicker } = DatePicker;
const { Option } = Select;
const RadioGroup = Radio.Group;

@connect(state => ({
    staffList: state.staffList,
}))
@Form.create()
export default class StaffList extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type:'staffList/getConfig',
        })
        dispatch({
            type:'staffList/getList',
        })
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        this.props.dispatch({
            type:'staffList/unmountReducer',
        });
    }
    handleChange=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'staffList/updatePageReducer',
            payload:{
                [type]:e.target.value,
            }
        })
    }
    handleSearch=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'staffList/getList',
            payload:{
                [type]:e,
                currentPage: 1,
            }
        })
    }
    handleChangeBirthday=(data,dataString)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'staffList/getList',
            payload:{
                birthdayStart: dataString[0],
                birthdayEnd: dataString[1],
                currentPage: 1,
            }
        })
    }
    handleChangeJoinTime=(data,dataString)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'staffList/getList',
            payload:{
                entryTimeStart: dataString[0],
                entryTimeEnd: dataString[1],
                currentPage: 1,
            }
        })
    }
    handleShowEditModal=()=>{
        const { dispatch } = this.props;
        dispatch({
            type:'staffList/updatePageReducer',
            payload:{
                showEditModal:true,
            }
        })
        this.props.form.resetFields();
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            const { dispatch } = this.props;
            dispatch({
                type:'staffList/handleCommit',
                payload:{
                    values,
                    entryTime:moment(values.entryTime).format('YYYY-MM-DD'),
                    buttonLoading:true,
                }
            })
          }
        });
    }
    handleCloseModal=()=>{
        const { dispatch } = this.props;
        dispatch({
            type:'staffList/updatePageReducer',
            payload:{
                showEditModal:false,
            }
        })
    }
    handleChangeDepartment=(value)=>{
        const { dispatch } = this.props;
        dispatch({
          type:'staffList/getPosition',
          payload:{
            id:value,
            position:'',
          }
        })
    }
    // 改变页码
    handleChangeCurPage(curPage) {
        const { dispatch } = this.props;
        dispatch({
            type: 'staffList/getList',
            payload: {
                currentPage:curPage,
            },
        });
    }
    // 改变每页数据
    handleChangePageSize(curPage, pageSize) {
        const { dispatch } = this.props;
        dispatch({
            type: 'staffList/getList',
            payload: {
                currentPage: 1,
                pageSize,
            },
        });
    }
    beforeUpload(file) {
        const isPermit = file.type === 'application/vnd.ms-excel';
        if (!isPermit) {
          message.error('只能上传excel');
        }
        return isPermit;
    }
    handleChangeUpload=(info)=>{
        const { dispatch } = this.props;
        if (info.file.status === 'uploading') {
          dispatch({
            type: 'staffList/updatePageReducer',
            payload:{
                isLoading:true,
            }
          });
        }
        if (info.file.status === 'error') {
          notification.error({
            message: '提示',
            description: '上传失败, 请稍后重试!',
          });
          dispatch({
            type: 'staffList/updatePageReducer',
            payload: {
                isLoading:false,
            },
          });
        }
        if (info.file.status === 'done') {
          dispatch({
            type: 'staffList/getList',
            payload: {
                isLoading:false,
            },
          });
        }
      }
      handleSearchByPhone=(e)=>{
        const { dispatch } = this.props;
          dispatch({
            type: 'staffList/searchByPhone',
            payload: {
                mobilePhone:e.target.value,
            },
          });

      }
      
    render() {
        const {
            form,
            staffList: {
                showEditModal,
                employeeList,
                total,
                buttonLoading,
                positionMap,
                statusMap,
                departmentMap,
                tableLoading,
                currentPage,
                pageSize,
                position,
                actionList,
                isLoading,
                name,
                status,
                searchPositionMap,
                mobilePhone,
                values,
            },
        } = this.props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 12 },
        };

        const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render:(id)=>{
                return <Link to={`/staff/staff-list/staff-detail/${id}`}>{id}</Link>

            }
            
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            
        },
        {
            title: '工号',
            dataIndex: 'jobNumber',
            key: 'jobNumber',
            
        },
        {
            title: '手机号',
            dataIndex: 'mobilePhone',
            key: 'mobilePhone',
            
        },
        {
            title: '职位',
            dataIndex: 'position',
            key: 'position',
            render:(position)=>{
                return <span>{positionMap[position]}</span>
            }
            
        },
        {
            title: '生日时间',
            dataIndex: 'birthday',
            key: 'birthday',
            
        },
        {
            title: '入职时间',
            dataIndex: 'entryTime',
            key: 'entryTime',
            
        },
        {
            title: '账号状态',
            dataIndex: 'status',
            key: 'status',
            render:(status)=>{
                return <span>{statusMap[status]}</span>
            }
        },
        ];

        return (
        <PageHeaderLayout title="员工管理">
            <Card bordered={false}>
                <Row type="flex" style={{paddingTop:10}}>
                    <Input.Search
                    className={globalStyles['input-sift']}
                    onChange={this.handleChange.bind(this, 'id')}
                    onSearch = {this.handleSearch.bind(this, 'id')}
                    placeholder="请输入员工ID"
                    />
                    <Input.Search
                    className={globalStyles['input-sift']}
                    onChange={this.handleChange.bind(this, 'jobNumber')}
                    onSearch = {this.handleSearch.bind(this, 'jobNumber')}
                    placeholder="请输入工号"
                    />
                    <Input.Search
                    className={globalStyles['input-sift']}
                    onChange={this.handleChange.bind(this, 'mobilePhone')}
                    onSearch = {this.handleSearch.bind(this, 'mobilePhone')}
                    placeholder="请输入手机号"
                    />
                    <Input.Search
                    className={globalStyles['input-sift']}
                    onChange={this.handleChange.bind(this, 'name')}
                    onSearch = {this.handleSearch.bind(this, 'name')}
                    placeholder="请输入姓名"
                    />
                    职位：
                    <Select
                    className={globalStyles['select-sift']}
                    placeholder="请选择"
                    onSelect={this.handleSearch.bind(this, 'position')}
                    >
                    <Option key={""} value={""}>全部</Option>
                    {
                        Object.keys(positionMap).map(item => (
                          <Option key={item} value={item}>{positionMap[item]}</Option>
                        ))
                    }
                    </Select>
                </Row>
                <Row style={{marginBottom:20}}>
                    <Col span={18}>
                        生日时间：
                        <RangePicker
                        onChange={this.handleChangeBirthday}
                        className={globalStyles['rangePicker-sift']}
                        />
                        入职时间：
                        <RangePicker
                        onChange={this.handleChangeJoinTime}
                        className={globalStyles['rangePicker-sift']}
                        />
                        账号状态：
                        <Select
                        className={globalStyles['select-sift']}
                        placeholder="请选择"
                        onSelect={this.handleSearch.bind(this, 'status')}
                        >
                        <Option value={""}>全部</Option>
                        {
                            Object.keys(statusMap).map(item => (
                              <Option key={item} value={item}>{statusMap[item]}</Option>
                            ))
                        }
                        </Select>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" onClick={this.handleShowEditModal} style={{marginRight:10}}>新增</Button>
                    </Col>
                    {
                        actionList.map(item=>(
                            item.type&&+item.type === 5?<Col span={2}>
                                <Upload
                                action={item.url}
                                onChange={this.handleChangeUpload}
                                headers={{
                                    authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                                }}
                                beforeUpload = {this.beforeUpload}
                                >
                                    <Button type="primary" loading={isLoading} style={{marginRight:10}}>{item.name}</Button>
                                </Upload>
                            </Col>:<Button type="primary" href={item.url} style={{marginRight:10}}>{item.name}</Button>
                            ) 
                        )
                    }
                </Row>
                <Table
                dataSource={employeeList}
                columns={columns}
                bordered
                loading={tableLoading}
                rowKey={record=>record.id}
                pagination={{
                    current: currentPage,
                    pageSize,
                    total,
                    showSizeChanger: true,
                    onShowSizeChange: this.handleChangePageSize.bind(this),
                    onChange: this.handleChangeCurPage.bind(this),
                    showTotal:total => `共 ${total} 个结果`,
                  }}
                
                />
            </Card>
            <Modal
            visible={showEditModal}
            title="新增员工信息"
            footer={null}
            onCancel = {this.handleCloseModal}
            maskClosable={false}
            >
                <Form onSubmit={this.handleSubmit}>
                    <Row style={{marginTop:-10}}>
                        <Col span={15}>
                            <Form.Item {...formItemLayout} label="手机号">
                                {
                                    getFieldDecorator('mobilePhone',{
                                        rules:[
                                            // {
                                            //     pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号码格式',
                                            // },
                                            {
                                                required: true, message: '请输入员工手机号',
                                            }
                                        ]
                                    })(
                                        <Input
                                        onBlur={this.handleSearchByPhone}
                                        />
                                    )
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{marginTop:-10}}>
                        <Col span={15}>
                            <Form.Item {...formItemLayout} label="姓名">
                                {
                                    getFieldDecorator('name',{
                                        initialValue:name,
                                        rules:[{
                                            required: true, message: '请输入员工姓名',
                                        }]
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{marginTop:-10}}>
                        <Col span={15}>
                            <Form.Item label="隶属部门" {...formItemLayout}>
                                {
                                    getFieldDecorator('departmentId',{
                                        rules:[
                                        {
                                            required:true,message:"请选择部门"
                                        }
                                    ]
                                    })(
                                        <Select
                                        placeholder="请选择部门"
                                        style={{width:150}}
                                        onChange={this.handleChangeDepartment}
                                        >
                                            {
                                                Object.keys(departmentMap).map(item=>{
                                                    return <Option key={item} value={item}>{departmentMap[item]}</Option>
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </Form.Item>
                            </Col>
                            <Col span={8}>
                            <Form.Item {...formItemLayout}>
                                {
                                getFieldDecorator('position',{
                                    rules:[
                                    {
                                        required:true,message:"请选择岗位"
                                    }
                                ]
                                })(
                                    <Select
                                    placeholder="请选择岗位"
                                    style={{width:150}}
                                    >
                                        {
                                            Object.keys(searchPositionMap).map(item=>{
                                                return <Option key={item} value={item}>{searchPositionMap[item]}</Option>
                                            })
                                        }
                                    </Select>
                                )
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={15}>
                            <Form.Item {...formItemLayout} label="入职时间">
                            {
                                getFieldDecorator('entryTime',{
                                    rules:[
                                        {
                                            required: true, message: '请选择入职时间',
                                        },
                                    ]
                                })(
                                    <DatePicker
                                    />
                                )
                            }
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={15}>
                            <Form.Item {...formItemLayout} label="账号状态">
                            {
                                getFieldDecorator('status',{
                                    initialValue: +status?status:'1',
                                    rules:[
                                        {
                                            required: true, message: '请选择账号状态',
                                        },
                                    ]
                                })(
                                    <RadioGroup>
                                        <Radio value={"1"}>启用</Radio>
                                        <Radio value={"0"}>禁用</Radio>
                                    </RadioGroup>
                                )
                            }
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Row type="flex" justify="center">
                            <Button style={{marginRight:20}} onClick={this.handleCloseModal}>取消</Button>
                            <Button type="primary" htmlType="submit" loading={buttonLoading}>
                                保存
                            </Button>
                        </Row>
                    </Form.Item>   
                </Form>
            </Modal>
        </PageHeaderLayout>
        );
    }
}
