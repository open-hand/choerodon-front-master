import { Component } from 'react';
import PropTypes from 'prop-types';
import {
  flatten, groupBy, forEach, isEmpty, map,
} from 'lodash';
import axios from '@/components/axios';
import { FAILURE, SUCCESS } from '../../stores/CONSTANTS';
import { PermissionProps } from '../../interface';

const DELAY = 500;

/**
 * Permission组件的provider，提供context收集全局check-permission请求
 * @class PermissionProvider
 * @extends {Component}
 */
class PermissionProvider extends Component {
  delayId:any = 0;

  permissions = new Map();

  queue = new Set();

  handlers = new Set();

  // eslint-disable-next-line react/static-property-placement
  static childContextTypes: { permission: PropTypes.Requireable<object>; };

  getChildContext() {
    return {
      permission: this,
    } as {
      permission: any
    };
  }

  fetch() {
    const handlers = Array.from(this.handlers);
    const totalData = Array.from(this.queue).map((item:string) => JSON.parse(item));
    const dataByType = groupBy(totalData, 'resourceType');
    const request:any[] = [];
    if (dataByType) {
      forEach(dataByType, (value, key) => {
        if (!isEmpty(value)) {
          const params:{
            projectId?:string | number
            tenantId:string | number
          } = { tenantId: key === 'site' ? 0 : value[0]?.organizationId };
          if (key === 'project') {
            params.projectId = value[0]?.projectId;
          }
          if (!params?.projectId) {
            delete params.projectId;
          }
          request.push(axios({
            method: 'post',
            url: '/iam/choerodon/v1/permissions/menus/check-permissions',
            data: map(value, 'code'),
            params,
          }));
        }
      });
    }

    Promise.all(request).then((res) => {
      const data = flatten(res);
      data.forEach(
        ({ code, approve }, index) => {
          const item = totalData[index];
          const { resourceType, organizationId, projectId } = item;
          if (resourceType) {
            const key = JSON.stringify(
              this.judgeService({
                code, type: resourceType, organizationId, projectId,
              }),
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

  check(props:PermissionProps, handler:CallableFunction, flag?:boolean) {
    if (!props.service || props.service.length === 0) {
      handler(SUCCESS);
    } else {
      const queue = new Set();
      if (
        this.judgeServices(props).every((item) => {
          if (item) {
            const key = JSON.stringify(item);
            const status = this.permissions.get(key);
            if (status === SUCCESS) {
              handler(status);
              return false;
            } if (status !== FAILURE) {
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

  judgeServices({
    service, type, organizationId, projectId,
  }: Pick<PermissionProps, 'service' | 'type' | 'projectId' | 'organizationId'>) {
    return service?.map((code) => this.judgeService({
      code, type, organizationId, projectId,
    })) || [];
  }

  judgeService(
    {
      code,
      type,
      organizationId,
      projectId,
    }:any,
  ) {
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
  // eslint-disable-next-line react/forbid-prop-types
  permission: PropTypes.object,
};
export default PermissionProvider;
