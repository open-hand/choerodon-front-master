import React from 'react';
import { Button, Col, Icon, Modal, Row } from 'choerodon-ui';
import PropTypes from 'prop-types';

const Remove = ({ open = false, handleCancel, handleConfirm }) => (
  <Modal
    visible={open || false}
    width={400}
    onCancel={handleCancel}
    wrapClassName="vertical-center-modal remove"
    footer={(
      <div>
        <Button
          onClick={handleCancel}
          className="color3"
          height={36}
          text="取消"
        />
        <Button
          onClick={handleConfirm}
          className="color3"
          style={{ marginLeft: '8px' }}
          height={36}
          text="删除"
        />
      </div>
    )}
  >
    <Row>
      <Col span={24}>
        <Col span={2}>
          <a style={{ fontSize: 20, color: '#ffc07b' }}>
            <Icon type="question-circle-o" />
          </a>
        </Col>
        <Col span={22}>
          <h2>确认删除</h2>
        </Col>
      </Col>
    </Row>
    <Row>
      <Col offset={2}>
        <div style={{ marginTop: 10 }}>
          <span>当你点击删除后，该条数据将被永久删除，不可恢复!</span>
        </div>
      </Col>
    </Row>
  </Modal>
);

Remove.propTypes = {
  open: PropTypes.bool,
};

export default Remove;
