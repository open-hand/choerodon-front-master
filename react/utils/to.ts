import queryString from 'querystring';
import { find } from 'lodash';
import { History } from 'history';
import HeaderStore from '@/containers/stores/c7n/HeaderStore';
import AppState from '@/containers/stores/c7n/AppState';
import { projectsApi } from '@/apis/Projects';
import { error } from './log';

let history: History | null;

function setHistory(newHistory: History) {
  history = newHistory;
}
interface IProject {
  id: number
  name: string
  category: 'GENERAL' | 'PROGRAM'
  organizationId: number
}

interface IOrg {
  id: number
  name: string
}
type Path = string;
type ProjectLocationDescriptor = {
  type: 'project'
  id?: number
  name?: string
  category?: 'GENERAL' | 'PROGRAM'
  organizationId?: number
  params?: {
    [param: string]: string
  }
}
type OrgLocationDescriptor = {
  type: 'org'
  id?: number
  name?: string
  organizationId?: number
  params?: {
    [param: string]: string
  }
}
type SiteLocationDescriptor = {
  type: 'site'
  organizationId?: number
  params?: {
    [param: string]: string
  }
}
type LocationDescriptor =
  ProjectLocationDescriptor |
  OrgLocationDescriptor |
  SiteLocationDescriptor;
const defaultDescriptor: ProjectLocationDescriptor = {
  type: 'project',
};
type IParams = NodeJS.Dict<string | number | boolean | ReadonlyArray<string> |
  ReadonlyArray<number> | ReadonlyArray<boolean> | null>

// eslint-disable-next-line max-len
function getParams(path: Path, descriptor: LocationDescriptor = defaultDescriptor): IParams | null | Promise<IParams | null> {
  const { type = 'project', params: otherParams } = descriptor;
  let params;
  switch (type) {
    case 'project': {
      const { id } = descriptor as ProjectLocationDescriptor;

      if (!id) {
        const {
          id: projectId, name, category, organizationId,
        } = AppState.currentMenuType;
        params = {
          type: 'project',
          id: String(projectId),
          name,
          category,
          organizationId: String(organizationId),
        };
      } else {
        return projectsApi.loadBasicInfo(String(id)).then((targetProject: IProject) => {
          if (!targetProject) {
            error('链接错误，未找到目标项目，请检查参数', path, descriptor);
            return null;
          }
          const {
            name,
            category,
            organizationId,
          } = targetProject;
          params = {
            type: 'project',
            id: String(id),
            name,
            category,
            organizationId: String(organizationId),
          };

          const asyncTotalParams = {
            ...params,
            ...otherParams,
          };
          return asyncTotalParams;
        });
      }
      break;
    }
    case 'org': {
      const { id } = descriptor as OrgLocationDescriptor;
      if (!id) {
        const {
          id: orgId, name,
        } = AppState.currentMenuType;
        params = {
          type: 'organization',
          id: String(orgId),
          name,
          organizationId: String(orgId),
        };
      } else {
        const orgs: IOrg[] = HeaderStore.getOrgData;
        const targetOrg = find(orgs, (v) => String(v.id) === String(id));
        if (!targetOrg) {
          error('链接错误，未找到目标组织，请检查参数', path, descriptor);
          return null;
        }
        const {
          name,
        } = targetOrg;
        params = {
          type: 'organization',
          id: String(id),
          name,
          organizationId: String(id),
        };
      }
      break;
    }
    case 'site': {
      const {
        organizationId =
        AppState.currentMenuType.organizationId,
      } = descriptor as SiteLocationDescriptor;
      const orgs: IOrg[] = HeaderStore.getOrgData;
      const targetOrg = find(orgs, (v) => String(v.id) === String(organizationId));
      if (!targetOrg) {
        error('链接错误，未找到目标组织，请检查参数', path, descriptor);
        return null;
      }
      params = {
        type: 'site',
        organizationId: String(organizationId),
      };
      break;
    }
    default: {
      error('链接错误，请检查参数', path, descriptor);
      return null;
    }
  }
  const totalParams = {
    ...params,
    ...otherParams,
  };
  return totalParams;
}

const linkTo = (path: Path, descriptor: LocationDescriptor = defaultDescriptor, options: { blank?: boolean } = {}) => {
  new Promise<IParams | null>((resolve) => {
    const params = getParams(path, descriptor);
    resolve(params);
  }).then((params) => {
    if (!params) {
      return;
    }
    const search = queryString.stringify(params);
    if (options.blank) {
      window.open(`/#${path}?${search}`);
      return;
    }
    if (!history) {
      error('跳转失败，未设置history');
      return;
    }
    history.push({
      pathname: path,
      search,
    });
  });
};
const linkUrl = (path: Path, descriptor: LocationDescriptor = defaultDescriptor) => {
  const { id } = descriptor as ProjectLocationDescriptor;
  id && error('链接url获取包含非本项目id,请检查参数,去除id', path, descriptor);
  const params = getParams(path, descriptor) as IParams;
  if (!params) {
    return path;
  }
  const search = queryString.stringify(params);
  return `${path}?${search}`;
};
/**
 * 跳转链接异步获取
 * @param path
 * @param descriptor
 */
async function linkUrlAsyn(path: Path, descriptor: LocationDescriptor = defaultDescriptor) {
  const { id } = descriptor as ProjectLocationDescriptor;
  if (!id) {
    return linkUrl(path, descriptor);
  }
  const params = await (getParams(path, descriptor) as Promise<IParams | null>);
  if (!params) {
    return path;
  }
  const search = queryString.stringify(params);
  return `${path}?${search}`;
}
export {
  linkUrl, linkUrlAsyn, linkTo, setHistory,
};
