/* eslint-disable react/require-default-props */
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
import { cloneDeep, orderBy } from 'lodash';
import { userSelectArr } from '../../create-project/untils/getCustomFieldDsProps';

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
  minWidth?: number
  isUser?: boolean
}

export interface IRemoteColumnSetConfig {
  columnCode: string,
  display: boolean,
  sort: number
  width: number
}

export interface ICustomFieldItem {
  fieldCode: string
  fieldName: string
  fieldType: string
}

export interface IProps {
  columnsSetConfig: IColumnSetConfig[]
  handleOk: (columnsData: IColumnSetConfig[]) => boolean
  alawaysDisplayCodes?: string[]
}
// TODO: 有时间优化一下
const grid = 0;
// DraggingStyle | NotDraggingStyle | undefined
const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: 'none',
  margin: `${grid}px 0 `,
  ...draggableStyle,
} as const);

export const initColumnSetData = (remoteData: IRemoteColumnSetConfig[] | null, defaultData: IColumnSetConfig[], customFields: any, tableDs: DataSet) => {
  const columnArr: IColumnSetConfig[] = [];

  if (remoteData) {
    defaultData.forEach((defaultItem) => {
      const found = remoteData.find((remoteItem) => remoteItem.columnCode === defaultItem.name);
      let width = 0;
      if (found) { // 如果远程没有width数据(为0) default有，用default的
        if (!found.width && defaultItem.width) {
          width = defaultItem.width;
        } else {
          width = found.width;
        }
      }
      columnArr.push({
        name: defaultItem.name,
        isSelected: found ? found.display : defaultItem.isSelected,
        label: tableDs?.getField(defaultItem.name)?.get('label'),
        order: found ? found.sort : 100 + defaultItem.order, // 编辑过了 新增的放到最后
        width,
      });
    });

    customFields.forEach((customItem: ICustomFieldItem, index: number) => {
      const found = remoteData.find((remoteItem) => remoteItem.columnCode === customItem.fieldCode);
      columnArr.push({
        name: customItem.fieldCode,
        isSelected: found ? found.display : false,
        label: tableDs?.getField(customItem.fieldCode)?.get('label'),
        order: found ? found.sort : 100 + index,
        width: found?.width || 0,
        isUser: userSelectArr.includes(customItem.fieldType),
      });
    });

    return orderBy(columnArr, ['order']);
  }

  // 还没编辑过的时候,把远程数据放到最后默认不选中

  if (customFields.length) {
    customFields.forEach((item: any, index: any) => {
      columnArr.push({
        name: item.fieldCode,
        isSelected: false,
        label: item.fieldName,
        order: 100 + index,
      });
    });
  }
  return orderBy(columnArr.concat(defaultData), ['order']);
};

const Content: React.FC<any> = observer((props) => {
  const {
    modal, columnsSetConfig, handleOk, alawaysDisplayCodes,
  } = props;
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
              {columnsSet.map((item: any, index: any) => {
                if (alawaysDisplayCodes.includes(item.name)) {
                  return '';
                }
                return (
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
                );
              })}
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
    handleOk, columnsSetConfig, alawaysDisplayCodes = [],
  } = props;

  const openEditColumnModal = () => {
    Modal.open({
      key: modalkey,
      title: '列表显示设置',
      drawer: true,
      style: {
        width: 380,
      },
      children: <Content columnsSetConfig={columnsSetConfig} handleOk={handleOk} alawaysDisplayCodes={alawaysDisplayCodes} />,
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
