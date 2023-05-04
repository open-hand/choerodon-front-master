/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/require-default-props */
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Action,
  axios,
  Choerodon,
} from '@choerodon/master';
import {
  Modal,
} from 'choerodon-ui/pro';
import { Tag, message } from 'choerodon-ui';
import { DataSet, Record } from '@/interface';
import iconSvg from '@/images/icon.svg';
import DeleteModal from './components/delete-modal';
import './index.less';

interface IProps{
  siderDs:DataSet,
  // 外部的操作操作函数
  actionFunction:(id:string)=>void,
  // 三个点是否显示
  isAction?:boolean,
  // 是否可以拖动列表
  isDrag?:boolean,
  deleteDs?:DataSet,
}
const Index:React.FC<IProps> = (props:IProps) => {
  const {
    siderDs,
    actionFunction,
    isAction = false,
    isDrag = false,
    deleteDs = null,
  } = props;
  const prefix = 'c7ncd-cooperation-project-template';
  const [curent, setCurrent] = useState(0);
  useEffect(() => {
    actionFunction(siderDs?.get(curent)?.get('id'));
  }, [curent]);
  const handleOnclick = (item:any, index:number) => {
    setCurrent(index);
  };
  const getStyle = () => ({
    background: '#f5f6fa',
    borderLeft: '2px solid #686FFF',
    color: '#5365ea',
  });
  const getActionData = (item:any) => [{
    service: [''],
    text: '删除',
    action: () => handleDelete(item),
  }];
  const handleDelete = async (item:any) => {
    // 先在这里校验，有参数之后再弹出弹窗
    // 并且这里需要设置查询参数，请求下拉框数据
    const { name, count } = item;
    deleteDs?.setQueryParameter('id', item?.id);
    deleteDs?.query();
    Modal.open({
      key: Modal.key(),
      title: '删除项目模板分类',
      children: <DeleteModal
        name={name}
        count={count}
        prefix={prefix}
        deleteDs={deleteDs}
      />,
      okText: '删除',
      style: { width: '600px' },
      onCancel: () => {
        deleteDs?.reset();
      },
      onOk: async () => {
        const res = await deleteDs?.validate();
        if (res !== false && deleteDs && deleteDs?.length > 0) {
          return true;
        }
        message.error('必须选择一个新的项目模板分类！');
        return false;
      },
    });
  };
  return (
    <div
      className={`${prefix}-sider-list-table`}
    >
      {
      siderDs.length > 0 && siderDs.toData().map((item:any, index:number) => (
        <div
          className={`${prefix}-sider-list-table-item`}
          onClick={() => handleOnclick(item, index)}
          style={index === curent ? getStyle() : {}}
        >
          <div className={`${prefix}-sider-list-table-item-img`}><img src={iconSvg} width={16} height={16} alt="" /></div>
          <div className={`${prefix}-sider-list-table-item-name`}>
            {item?.name}
            <span>
              (
              {item?.count}
              )
            </span>
          </div>
          {item?.is_sys_flag ? <Tag color="blue">预定义</Tag> : <span />}
          {isAction && !item?.is_sys_flag ? <Action data={getActionData(item)} /> : ''}
        </div>
      ))
    }

    </div>
  );
};
export default observer(Index);
