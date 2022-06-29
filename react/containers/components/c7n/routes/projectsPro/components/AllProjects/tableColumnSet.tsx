import {
  CheckBox, Form, Icon, DataSet,
} from 'choerodon-ui/pro';
import React, { useState, useEffect } from 'react';

import {
  Droppable, DragDropContext, DropResult, Draggable, DraggingStyle, NotDraggingStyle,
  // @ts-ignore
} from 'react-beautiful-dnd';
import { usePersistFn } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { cloneDeep } from 'lodash';
import { IColumnSetConfig } from './customQuerybar';

export interface IProps {
  columnsConfig: IColumnSetConfig[]
  handleOk: (columnsData:IColumnSetConfig[])=> boolean
  tableDs: DataSet
}

const grid = 0;
// DraggingStyle | NotDraggingStyle | undefined
const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: 'none',
  margin: `${grid}px 0 `,
  ...draggableStyle,
} as const);

const Index:React.FC<IProps> = (props) => {
  const {
    // @ts-ignore
    modal, columnsConfig, handleOk, tableDs,
  } = props;
  const [columns, setColumns] = useState<any>([]);

  useEffect(() => {
    if (columnsConfig[0] && !columnsConfig[0].label) {
      columnsConfig.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.label = tableDs?.getField(item.name)?.get('label');
      });
    }
    setColumns(columnsConfig);
  }, [columnsConfig]);

  // DropResult
  const onDragEnd = usePersistFn((result:any) => {
    console.log(result, 'result');
    if (result.source && result.destination) {
      const { source: { index: sourceIndex }, destination: { index: destinationIndex } } = result;
      const [moved] = columns.splice(sourceIndex, 1) ?? [];
      if (moved) {
        columns.splice(destinationIndex, 0, moved);
      }
      console.log(columns);
      setColumns([...columns]);
    }
  });

  const handleCheckChange = (value:boolean, index:number) => {
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
          {(droppableProvided:any, snapshotDroppable:any) => {
            console.log('');
            return (
              <div
        // className={classNames(styles.card_list)}
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
                style={{
                  width: '100%',
                }}
              >
                {columns.map((item:any, index:any) =>
                //   const selected = selectedKeys.includes(item.code);
                // eslint-disable-next-line implicit-arrow-linebreak
                  (
                    <Draggable
                      index={index}
                      draggableId={item.name}
                      key={item.name}
                    >
                      {(provided:any, snapshot:any) => (
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
                              <CheckBox checked={item.isSelected} onChange={(value:boolean) => { handleCheckChange(value, index); }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {droppableProvided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default observer(Index);
