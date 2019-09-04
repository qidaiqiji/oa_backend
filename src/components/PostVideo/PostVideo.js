import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { Modal, Input, Select, Row, message, Pagination, Checkbox } from 'antd';
import { connect } from 'dva';
import icon from '../../../public/icon_selected.png';
const { Search } = Input;
import globalStyles from '../../assets/style/global.less';
@connect(state => ({
    resourcePool: state.resourcePool,
}))
export default class PostVideo extends React.Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'resourcePool/getConfig',
        });
        // dispatch({
        //     type: 'resourcePool/getVideoList',
        // });
    }
    handleTriggerSelect = (videoId) => {
        const { dispatch, resourcePool } = this.props;
        const { videoList } = resourcePool;

        videoList.map(item => {
            item.isSelect = false;
            if (+item.videoId === +videoId) {
                item.isSelect = true;
            }
        });
        let selectedVideo = videoList.filter(item => {
            return item.isSelect === true;
        })
        dispatch({
            type: 'resourcePool/updatePageReducer',
            payload: {
                videoList,
                selectedVideo,
            }
        });
    }
    onChangeCurPage(e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'resourcePool/getVideoList',
            payload: {
                page: e,
            }
        });

    }
    handleSearch = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'resourcePool/getVideoList',
            payload: {
                title: e,
            }
        });
    }
    render() {
        const { config } = this.props;
        const {
            resourcePool: {
                videoList,
                totalVideo,
                page,
                pageSizeVideo,
            } } = this.props;
        return (
            <Modal
                visible={config.visible}
                title="素材库上传"
                style={{ height: 800, overflow: 'auto', paddingBottom: 0 }}
                width={1400}
                onOk={config.confirm}
                onCancel={config.cancel}
            >
                <Search
                    placeholder="请输入视频名称"
                    className={globalStyles['input-sift']}
                    onSearch={this.handleSearch}
                />
                <Row style={{ marginTop: 10 }}>
                    <div className={styles.container}>
                        {
                            videoList.map(item => {
                                return <div className={styles.videoBox} onClick={this.handleTriggerSelect.bind(this, item.videoId)}>
                                    <video
                                        style={{ height: '228px', overflow: 'hidden' }}
                                        src={item.url} controls
                                        className={item.isSelect ? styles.active : ''}
                                    ></video>
                                    <div>
                                        {item.title}
                                    </div>
                                    <a className={styles.selected}>
                                        <Checkbox
                                            checked={item.isSelect}
                                            // onChange={this.handleTriggerSelect.bind(this, item.videoId)}
                                        ></Checkbox>
                                    </a>
                                </div>
                            })
                        }
                    </div>
                </Row>
                <div style={{ textAlign: 'right', paddingRight: '20px' }}>
                    {totalVideo > 0 ? (
                        <Pagination
                            // showSizeChanger
                            //   onShowSizeChange={onShowSizeChange} 
                            defaultCurrent={1}
                            total={totalVideo}
                            current={page}
                            pageSize={pageSizeVideo}
                            onChange={this.onChangeCurPage.bind(this)}
                        />) : ''}
                </div>
            </Modal>
        )
    }
} 
