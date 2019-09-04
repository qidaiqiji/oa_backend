import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Tabs, Icon, Select, Avatar, List } from 'antd';
import PageHeaderLayout from '../layouts/PageHeaderLayout';
import logo from '../assets/iocn_send.png';
import styles from './Dashboard.less';
import globalStyles from '../assets/style/global.less';
import NoticeIcon from '../components/NoticeIcon';
const TabPane = Tabs.TabPane;
@connect(state => ({
  dashboard: state.dashboard,
  user: state.user,
}))
export default class Dashboard extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/getInfo',
    })
    dispatch({
      type: 'dashboard/getConfig',
    })
  }
  handleChangeByDepartment=(value)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/searchByDepart',
      payload:{
        departmentId:value,
      }
    })
  }
  render() {
      const {
        dashboard:{
          infoDetail,
          departmentListMap,
          cardLoading,
        },
        user
      } = this.props;
      const myDate = new Date();
      const year = myDate.getFullYear();
      const month = myDate.getMonth()+1;
      const date = myDate.getDate();
      const day = myDate.getDay();
      const week = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
      const pageHeaderContent =<Row type="flex" className={styles.pageHeaderContent}>
            <div className={styles.avatar}>
              <Avatar size="large" src={infoDetail.headImgUrl} />
            </div>
            <div className={styles.content}>
              <div className={styles.contentTitle}>
                {`${user.name}，${infoDetail.slogan}`}
              </div>
              <div>
                {`${infoDetail.position} | ${infoDetail.department}`}
              </div>
            </div>
          <Col span={6} justify="end" className={styles.calendar}>
                <div className={styles.data}>
                    <span>{date}</span>
                </div> 
                <div className={styles.time}>
                    <div className={styles.day}>{week[day]}</div>
                    <div className={styles.nowTime}>{`${year}-${month}`}</div>
                </div> 
          </Col>

      </Row>
      const gridStyle = {
        width: '33%',
        textAlign: 'center',
      };
      
      const loadMore = <div style={{height:40,textAlign:'center',lineHeight:'40px'}}>
          <Link to="/message/message-list">查看更多信息</Link>
      </div>
      
    return (
      <PageHeaderLayout 
      content={pageHeaderContent}
      >
        <Row gutter={24}>
          <Col 
          xl={16} lg={24} md={24} sm={24} xs={24}
          >
            <Card 
            title="待办事项"
            bordered={false}
            bodyStyle={{ padding: 0 }}
            >
              <Card.Grid style={gridStyle}>
                  <div className={styles.cardTitle}>
                    <img src={logo} />
                    我的待办信息
                  </div>
                  <div className={styles.count}>
                    <Link to="/message/message-list/2" style={{color:'#000'}}>{+infoDetail.toDoNum>0?infoDetail.toDoNum:0}</Link>
                  </div>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                  <div className={styles.cardTitle}>
                    <img src={logo} />
                    七天内未读信息
                  </div>
                  <div className={styles.count}>
                    <Link to="/message/message-list/1" style={{color:'#000'}}>{+infoDetail.weekUnreadNum>0?infoDetail.weekUnreadNum:0}</Link>
                  </div>
              </Card.Grid>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24, padding:'0 40px'}}
              bodyStyle={{ padding: 0 }}
              loading={cardLoading}
            >
             <Tabs>
                <TabPane
                tab={`业务（${infoDetail.businessList.length}）`}
                key="1"
                >
                  <Select
                  placeholder="所有部门"
                  className={globalStyles['select-sift']}
                  onChange={this.handleChangeByDepartment}
                  >
                    <Select.Option value="" key="">
                        全部
                    </Select.Option>
                    {
                      Object.keys(departmentListMap).map(item=>{
                        return <Select.Option
                        value={item}
                        key={item}
                        >
                          {departmentListMap[item]}
                        </Select.Option>
                      })
                    }
                  </Select>
                  <List
                  dataSource={infoDetail.businessList}
                  loadMore={loadMore}
                  renderItem={item => (
                    <List.Item>
                        <List.Item.Meta 
                        className={styles.globalMeta}
                        avatar={<Avatar src={item.headImgUrl} shape="circle"/>}
                        title={<div className={styles.listTitle}>
                          <Link to={`/message/message-list/message-detail/${item.id}`} className={styles.listLink}>{item.title}</Link>
                          {
                            item.tag.map(tag=>{
                              return <span className={styles.listTag} style={{background:tag.bgColor,color:tag.color,border:`1px solid ${tag.borderColor}`}}>{tag.name}</span>
                            })
                          }
                        </div>}
                        description={<div><span style={{display:'inline-block',marginRight:20}}>{item.createBy}</span><span>{item.createTime}</span></div>}
                        />
                    </List.Item>
                  )}
                  >
                  </List>
                </TabPane>
                <TabPane
                // tab={`系统（${infoDetail.systemList.length}）`}
                tab={`系统（0）`}
                key="2"
                >
                  <List
                  dataSource={infoDetail.systemList}
                  // loadMore={loadMore}
                  // renderItem={item => (
                  //   <List.Item>
                  //       <List.Item.Meta 
                  //       avatar={<Avatar src={logo} shape="circle"/>}
                  //       title={<a href="https://ant.design">{item.title}</a>}
                  //       description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  //       />
                  //   </List.Item>
                  // )}
                  >
                  </List>
                </TabPane>
             </Tabs>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}

