import {
  CheckBox, DataSet, Form, Icon,
} from 'choerodon-ui/pro';
import React, { useMemo, useState } from 'react';

import {
  Droppable, DragDropContext, DropResult, Draggable, DraggingStyle, NotDraggingStyle,
  // @ts-ignore
} from 'react-beautiful-dnd';
import { usePersistFn } from 'ahooks';
import { observer } from 'mobx-react-lite';

export interface IProps {

}

const grid = 0;
// DraggingStyle | NotDraggingStyle | undefined
const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: 'none',
  margin: `${grid}px 0 `,
  ...draggableStyle,
} as const);

const Index:React.FC<IProps> = (props) => {
  // @ts-ignore
  const { modal } = props;
  const [columns, setColumns] = useState([
    {
      name: 'a',
      label: '编号',
      isSelected: false,
    },
    {
      name: 'b',
      label: '优先级',
      isSelected: true,
    },
    {
      name: 'c',
      label: '经办人',
      isSelected: false,
    },
  ]);

  const formDs = useMemo(() => {
    const ds = new DataSet({
      autoCreate: true,
    });
    // ds.loadData([recordData?.toData()]);
    const data = [
      {
        name: 'a',
        label: '编号',
        isSelected: false,
      },
      {
        name: 'b',
        label: '优先级',
        isSelected: true,
      },
      {
        name: 'c',
        label: '经办人',
        isSelected: false,
      },
    ];
    // data.forEach((item:any) => {
    //   ds.addField(item.name, { type: 'boolean' });
    // });
    return ds;
  }, []);

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
  return (
    <Form dataSet={formDs}>
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
                  // <ColumnItem
                  //   renderItem={renderItem}
                  //   tooltip={tooltip}
                  //   selected={selected}
                  //   onSelectChange={onSelectChange}
                  //   key={item.code}
                  //   data={item}
                  //   index={index}
                  // />
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
                              {item.label}
                            </div>
                            <div>
                              <CheckBox checked={item.isSelected} />
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
    </Form>
  );
};

export default observer(Index);
