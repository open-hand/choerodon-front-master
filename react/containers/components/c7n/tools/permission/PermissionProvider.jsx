import { Component } from 'react';
import PropTypes from 'prop-types';
import { flatten } from 'lodash';
import axios from '../axios';
import { FAILURE, SUCCESS } from './PermissionStatus';

const DELAY = 500;

class PermissionProvider extends Component {
  delayId = 0;

  permissions = new Map();

  queue = new Set();

  handlers = new Set();

  getChildContext() {
    return {
      permission: this,
    };
  }

  fetch() {
    const handlers = Array.from(this.handlers);
    const totalData = Array.from(this.queue).map(item => JSON.parse(item));
    const projectData = totalData.filter(item => item.resourceType === 'project');
    const otherData = totalData.filter(item => item.resourceType !== 'project');
    const request = [];
    // 项目层和其他层分开请求
    if (projectData.length > 0) {
      request.push(axios({
        method: 'post',
        url: '/iam/choerodon/v1/permissions/menus/check-permissions',
        data: projectData.map(item => item.code),
        params: {
          projectId: projectData[0].projectId,
        },
      }));
    }
    if (otherData.length > 0) {
      request.push(axios({
        method: 'post',
        url: '/iam/choerodon/v1/permissions/menus/check-permissions',
        data: otherData.map(item => item.code),
      }));
    }

    Promise.all(request).then((res) => {
      const data = flatten(res);
      data.forEach(
        ({ code, approve }, index) => {
          const item = totalData[index];
          const { resourceType, organizationId, projectId } = item;
          if (resourceType) {
            const key = JSON.stringify(
              this.judgeService(code, resourceType, organizationId, projectId),
            );
            this.permissions.set(key, approve ? SUCCESS : FAILURE);
          }
        },
      );
      handlers.forEach(([props, handler]) => this.check(props, handler, true));
    });
  }

  start() {
    if (this.delayId) {
      clearTimeout(this.delayId);
    }
    this.delayId = setTimeout(() => {
      this.fetch();
      this.queue.clear();
      this.handlers.clear();
    }, DELAY);
  }

  check(props, handler, flag) {
    if (!props.service || props.service.length === 0) {
      handler(SUCCESS);
    } else {
      const queue = new Set();
      if (
        this.judgeServices(props).every(item => {
          if (item) {
            const key = JSON.stringify(item);
            const status = this.permissions.get(key);
            if (status === SUCCESS) {
              handler(status);
              return false;
            } else if (status !== FAILURE) {
              this.queue.add(key);
              queue.add(key);
            }
          }
          return true;
        })
      ) {
        if (queue.size > 0 && !flag) {
          this.handlers.add([props, handler]);
          this.start();
        } else {
          handler(FAILURE);
        }
      }
    }
  }

  judgeServices({ service, type, organizationId, projectId }) {
    return service.map(code => this.judgeService(code, type, organizationId, projectId));
  }

  judgeService(code, type, organizationId, projectId) {
    switch (type) {
      case 'organization':
        return {
          code,
          organizationId,
          resourceType: type,
        };
      case 'project':
        return {
          code,
          organizationId,
          projectId,
          resourceType: type,
        };
      case 'site':
        return {
          code,
          resourceType: type,
        };
      default:
        return null;
    }
  }

  render() {
    return this.props.children;
  }
}
PermissionProvider.childContextTypes = {
  permission: PropTypes.object,
};
export default PermissionProvider;
