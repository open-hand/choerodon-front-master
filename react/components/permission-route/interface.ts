import {
  RouteProps,
} from 'react-router-dom';

interface PermissionRouteProps extends RouteProps {
  service?: string[] | ((type: 'project' | 'organization' | 'site') => string[]),
  enabledRouteChangedAjaxBlock?: boolean,
}

export {
  PermissionRouteProps,
};
