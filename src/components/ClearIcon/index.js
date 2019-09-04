import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import globalStyles from '../../assets/style/global.less';
export default class ClearIcon extends PureComponent {
    render() {
        const { handleClear } = this.props;
        return <Icon
        type="close-circle"
        theme="filled"
        className={globalStyles.clearIcon}
        onClick={handleClear}
        />
    }
}
