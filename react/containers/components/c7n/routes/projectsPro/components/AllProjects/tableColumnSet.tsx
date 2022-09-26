import {
  CheckBox, Icon, Modal, Button, DataSet,
} from 'choerodon-ui/pro';
import React, {
  useState, useEffect, useImperativeHandle, useMemo,
} from 'react';

import {
  Droppable, DragDropContext, DropResult, Draggable, DraggingStyle, NotDraggingStyle,
  // @ts-ignore
} from 'react-beautiful-dnd';
import { usePersistFn } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { cloneDeep, orderBy, remove } from 'lodash';

const modalkey = Modal.key();

export interface IColumnSetConfig {
  name: string,
  label: string,
  isSelected: boolean,
  sort: number
  width?: number
  minWidth?: number
}

export interface IRemoteColumnSetConfig {
  columnCode: string,
  display: boolean,
  sort: number
  width: number
}

export interface IProps {
  columnsConfig: IColumnSetConfig[]
  handleOk: (columnsData: IColumnSetConfig[]) => boolean
  cRef: any
  tableDs: DataSet
}
// TODO: 有时间优化一下
const grid = 0;
// DraggingStyle | NotDraggingStyle | undefined
const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: 'none',
  margin: `${grid}px 0 `,
  ...draggableStyle,
} as const);

const Content: React.FC<any> = observer((props) => {
  const { modal, columnsConfig, handleOk } = props;
  const [columns, setColumns] = useState<any>([]);
  useEffect(() => {
    setColumns(columnsConfig);
  }, [columnsConfig]);

  // DropResult
  const onDragEnd = usePersistFn((result: any) => {
    // console.log(result, 'result');
    if (result.source && result.destination) {
      const { source: { index: sourceIndex }, destination: { index: destinationIndex } } = result;
      const [moved] = columns.splice(sourceIndex, 1) ?? [];
      if (moved) {
        columns.splice(destinationIndex, 0, moved);
      }
      // console.log(columns);
      setColumns([...columns]);
    }
  });

  const handleCheckChange = (value: boolean, index: number) => {
    const cloneColumns = cloneDeep(columns);
    cloneColumns[index].isSelected = value;
    setColumns(cloneColumns);
  };

  modal.handleOk(() => handleOk(columns));

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
              {columns.map((item: any, index: any) =>
              //   const selected = selectedKeys.includes(item.code);
              // eslint-disable-next-line implicit-arrow-linebreak
              // eslint-disable-next-line indent
        // eslint-disable-next-line
        (
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
          // eslint-disable-next-line
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
    handleOk, columnsConfig, tableDs, cRef,
  } = props;

  useImperativeHandle(cRef, () => ({
    initData,
  }));

  const initData = (remoteData:IRemoteColumnSetConfig[] | null, defaultData:IColumnSetConfig[]) => {
    if (remoteData) {
      let columnArr:any = [];
      const newArr:any = [];

      defaultData.forEach((defaultItem) => { // 新增
        const foundIndex = remoteData.findIndex((i) => i.columnCode === defaultItem.name);
        if (foundIndex === -1) {
          newArr.push(defaultItem);
        }
      });

      remove(remoteData, (i) => { // 删除
        const found = defaultData.find((defaultItem) => defaultItem.name === i.columnCode);
        if (!found) {
          return true;
        }
        return false;
      });

      const exceptDeleteArr = remoteData;
      exceptDeleteArr.forEach((i) => {
        columnArr.push({
          name: i.columnCode,
          isSelected: i.display,
          label: tableDs?.getField(i.columnCode)?.get('label'),
          order: i.sort,
        });

        const found = defaultData.find((defaultItem) => defaultItem.name === i.columnCode);

        // console.log(found);

        if (!i.width && found) { // 如果远程没有数据(为0) default有，用default的
          // eslint-disable-next-line no-param-reassign
          console.log(i);
          console.log(found.width);
          i.width = found.width || 0;
        }
      });
      columnArr = orderBy(columnArr.concat(newArr), ['order']);
      console.log(columnArr);
      return columnArr;
    }
    return defaultData;
  };

  const openEditColumnModal = () => {
    Modal.open({
      key: modalkey,
      title: '列表显示设置',
      drawer: true,
      style: {
        width: 380,
      },
      children: <Content columnsConfig={columnsConfig} handleOk={handleOk} />,
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
