/* eslint-disable no-param-reassign */
import {
  CheckBox, Icon, Modal, Button, DataSet,
} from 'choerodon-ui/pro';
import React, {
  useState, useEffect,
} from 'react';
import {
  Droppable, DragDropContext, DropResult, Draggable, DraggingStyle, NotDraggingStyle,
} from 'react-beautiful-dnd';
import { useMemoizedFn } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { cloneDeep, orderBy, remove } from 'lodash';

const modalkey = Modal.key();

export interface IColumnSetConfig {
  name: string,
  label: string,
  /**
   * 是否展示列
   */
  isSelected: boolean,
  order: number
  width?: number
  minWidth?: number,
}

export interface IRemoteColumnSetConfig {
  columnCode: string,
  display: boolean,
  sort: number
  width: number
}

export interface IProps {
  columnsSetConfig: IColumnSetConfig[]
  handleOk: (columnsData: IColumnSetConfig[]) => boolean
}
// TODO: 有时间优化一下
const grid = 0;
// DraggingStyle | NotDraggingStyle | undefined
const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: 'none',
  margin: `${grid}px 0 `,
  ...draggableStyle,
} as const);

export const initColumnSetData = (remoteData:IRemoteColumnSetConfig[] | null, defaultData:IColumnSetConfig[], customFields:any, tableDs:DataSet) => {
  const columnArr:IColumnSetConfig[] = [];
  if (remoteData) {
    console.log(remoteData, 'remoteData');
    const newlocalFieldsArr:IColumnSetConfig[] = [];

    defaultData.forEach((defaultItem) => { // 本地新增系统字段
      const foundIndex = remoteData.findIndex((i) => i.columnCode === defaultItem.name);
      if (foundIndex === -1) {
        newlocalFieldsArr.push(defaultItem);
      }
    });
    // TODO 需要一个字段来说明是不是系统字段 那么保存的时候也要存一下这个东西
    // 加了之后放开下面的注释
    // 如果是自定义字段 应该怎么给width

    // remove(remoteData, (i) => { // 本地删除系统字段
    //   const found = defaultData.find((defaultItem) => defaultItem.name === i.columnCode);
    //   return !found;
    // });

    const exceptDeleteArr = remoteData;

    exceptDeleteArr.forEach((i) => {
      const found = defaultData.find((defaultItem) => defaultItem.name === i.columnCode);
      if (!i.width && found) { // 如果远程没有width数据(为0) default有，用default的
        i.width = found.width || 0;
      }
      columnArr.push({
        name: i.columnCode,
        isSelected: i.display,
        label: tableDs?.getField(i.columnCode)?.get('label'), // TODO 存数据的时候给一个label字段,后端需要返回来
        order: i.sort,
        width: i.width,
      });
    });

    const returnArr = columnArr.concat(newlocalFieldsArr);

    const newCustomFieldsArr:IColumnSetConfig[] = []; // 相较于上次保存新增的自定义字段
    customFields.forEach((customItem:any, index:number) => {
      const found = returnArr.find((returnItem) => returnItem.name === customItem.code);
      if (!found) {
        newCustomFieldsArr.push({
          name: customItem.code,
          isSelected: false,
          label: customItem.name,
          order: 100 + index,
        });
      }
    });
    return orderBy(returnArr.concat(newCustomFieldsArr), ['order']);
  }

  // 还没编辑过的时候,把远程数据放到最后默认不选中

  if (customFields.length) {
    customFields.forEach((item:any, index:any) => {
      columnArr.push({
        name: item.code,
        isSelected: false,
        label: item.name,
        order: 100 + index,
      });
    });
  }
  return orderBy(columnArr.concat(defaultData), ['order']);
};

const Content: React.FC<any> = observer((props) => {
  const { modal, columnsSetConfig, handleOk } = props;
  const [columnsSet, setColumnsSet] = useState<any>([]);
  useEffect(() => {
    setColumnsSet(columnsSetConfig);
  }, [columnsSetConfig]);

  // DropResult
  const onDragEnd = useMemoizedFn((result: any) => {
    if (result.source && result.destination) {
      const { source: { index: sourceIndex }, destination: { index: destinationIndex } } = result;
      const [moved] = columnsSet.splice(sourceIndex, 1) ?? [];
      if (moved) {
        columnsSet.splice(destinationIndex, 0, moved);
      }
      setColumnsSet([...columnsSet]);
    }
  });

  const handleCheckChange = (value: boolean, index: number) => {
    const cloneColumns = cloneDeep(columnsSet);
    cloneColumns[index].isSelected = value;
    setColumnsSet(cloneColumns);
  };

  modal.handleOk(() => handleOk(columnsSet));

  return (
    <div>
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <Droppable droppableId="list" direction="vertical" type="status_drop">
          {(droppableProvided: any, snapshotDroppable: any) => (
            <div
        // className={classNames(styles.card_list)}
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              style={{
                width: '100%',
              }}
            >
              {columnsSet.map((item: any, index: any) => (
                <Draggable
                  index={index}
                  draggableId={item.name}
                  key={item.name}
                >
                  {(provided: any, snapshot: any) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                      )}
                    >
                      <div style={{
                        height: 37,
                        borderBottom: '1px solid #D9E6F2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 10px',
                      }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        >
                          <Icon type="baseline-drag_indicator" style={{ marginRight: '10px' }} />
                          <span>{item.label}</span>
                        </div>
                        <div>
                          <CheckBox checked={item.isSelected} onChange={(value: boolean) => { handleCheckChange(value, index); }} />
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
});

const Index: React.FC<IProps> = (props) => {
  const {
    // @ts-ignore
    handleOk, columnsSetConfig,
  } = props;

  const openEditColumnModal = () => {
    Modal.open({
      key: modalkey,
      title: '列表显示设置',
      drawer: true,
      style: {
        width: 380,
      },
      children: <Content columnsSetConfig={columnsSetConfig} handleOk={handleOk} />,
      bodyStyle: {
        paddingTop: 10,
      },
    });
  };

  return (
    <Button icon="view_column" onClick={openEditColumnModal} />
  );
};

export default observer(Index);
