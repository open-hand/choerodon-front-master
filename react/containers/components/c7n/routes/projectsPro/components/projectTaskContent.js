/* eslint-disable */
import React from "react";
import { Icon, Tag } from "choerodon-ui";
import { Tooltip } from "choerodon-ui/pro";
import { TimePopover } from "@choerodon/components";
import TimeAgo from "timeago-react";
import { throttle } from "lodash";
import { getRandomBackground } from "@/utils";
import { useProjectsProStore } from "../stores";
import { startProjChange } from "./AllProjects/table";
import "./projectTaskContent.less";
import moment from "moment";
import { inject } from "mobx-react";

export const renderCategoriesTags = arr => {
  let title = "";
  arr.forEach(i => {
    title += `${i.name}，`;
  });
  return (
    <Tooltip title={title.substring(0, title.length - 1)}>
      {arr.map((item, index) => {
        if (index <= 1) {
          return (
            <Tag
              key={item.name}
              className="categories-tag"
              color="rgba(15, 19, 88, 0.06)"
            >
              {item.name}
            </Tag>
          );
        } else if (index === 2) {
          return <span style={{ cursor: "pointer" }}>...</span>;
        }
      })}
    </Tooltip>
  );
};

const Index = props => {
  const {
    data,
    alltrue,
    lastVisitTime,
    AppState: {
      currentMenuType: { organizationId }
    }
  } = props;
  const { ProjectsProUseStore, projectListDataSet } = useProjectsProStore();
  if (alltrue) {
    data.starFlag = true;
  }
  const unix = String(moment(data.creationDate).unix());

  const handleStarClick = throttle(
    async projectData => {
      if (projectData.enabled) {
        await startProjChange(
          projectData.id,
          !projectData.starFlag,
          organizationId,
          ProjectsProUseStore
        );
        if (projectListDataSet?.toData().length) {
          const tableCorrespondIndex = projectListDataSet
            .toData()
            .findIndex(i => i.id === projectData.id);
          if (tableCorrespondIndex !== -1) {
            projectListDataSet
              .get(tableCorrespondIndex)
              .set("starFlag", !projectData.starFlag);
          }
        }
      }
    },
    2000,
    {
      leading: true,
      trailing: false
    }
  );

  return (
    <div>
      <div className="projectBlock-items-content">
        <div
          className="projectBlock-items-content-icon"
          style={{
            backgroundImage: data.imageUrl
              ? `url("${data.imageUrl}")`
              : getRandomBackground(unix.substring(unix.length - 3))
          }}
        >
          {!data.imageUrl && data.name && data.name.slice(0, 1)}
        </div>
        <div className="projectBlock-rightContent">
          <div className="projectBlock-first">
            <p className="projectBlock-items-content-center-title">
              <Tooltip title={data.name} placement="top">
                {data.name}
              </Tooltip>
            </p>
            <Icon
              type={data.starFlag ? "stars" : "star_border"}
              style={{
                color: data.starFlag ? "#faad14" : "rgba(15, 19, 88, 0.45)",
                fontSize: "20px"
              }}
              onClick={e => {
                e.stopPropagation();
                handleStarClick(data);
              }}
            />
          </div>
          <div className="projectBlock-second">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 5,
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Tooltip title={data.code && data.code.toUpperCase()}>
                  <p className="projectBlock-items-content-center-code">
                    {data.code && data.code.toUpperCase()}
                  </p>
                </Tooltip>
                <p
                  className={`projectBlock-items-content-center-status projectBlock-items-content-center-status-${data.enabled}`}
                >
                  {data.enabled ? "启用" : "停用"}
                </p>
              </div>
              <div className="projectBlock-items-content-right-down">
                {lastVisitTime && (
                  <div className="time-div">
                    <TimeAgo datetime={lastVisitTime} locale="zh_CN" />
                    <span>使用</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="projectBlock-items-down">
        <span className="items-label">项目类型：</span>
        {renderCategoriesTags(data?.categories || [])}
      </div>
    </div>
  );
};

export default inject("AppState")(Index);
