import React from 'react';
import { Avatar, List } from 'antd';
import classNames from 'classnames';
import styles from './NoticeList.less';
import { Link } from 'dva/router';

export default function NoticeList({
  data = [], onClick, onClear, title, locale, emptyText, emptyImage,
}) {
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        {emptyImage ? (
          <img src={emptyImage} alt="not found" />
        ) : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }
  // const loadMore = <div style={{height:40,textAlign:'center',lineHeight:'40px'}}>
  //       <Link to="/message/message-list">查看更多信息</Link>
  //   </div>
  return (
    <div>
      <List 
      className={styles.list}
      
      >
        {data.map((item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          
          return (
            <List.Item className={itemCls} key={item.key || i} onClick={() => onClick(item)}>
              <List.Item.Meta
                className={styles.meta}
                avatar={<Avatar shape="circle" src={item.headImgUrl} /> }
                title={
                  <div className={styles.title}>
                    <Link to={`/message/message-list/message-detail/${item.id}`} className={styles.listLink}>{item.title}</Link>
                    <div className={styles.extra}>{
                      item.tag.map(tag=>{
                        return <span className={styles.listTag} style={{background:tag.bgColor,color:tag.color,border:`1px solid ${tag.borderColor}`}}>{tag.name}</span>
                      })
                    }</div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description} title={item.description}>
                        <div><span style={{display:'inline-block',marginRight:20}}>{item.createBy}</span></div>
                    </div>
                    <div className={styles.datetime}>{item.createTime}</div>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>
      <div className={styles.clear}>
          <Link to="/message/message-list">查看更多信息</Link>
      </div>
    </div>
  );
}
