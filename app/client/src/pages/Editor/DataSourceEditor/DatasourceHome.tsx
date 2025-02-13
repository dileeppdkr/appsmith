import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { initialize } from "redux-form";
import { Card, Spinner } from "@blueprintjs/core";
import { getDBPlugins, getPluginImages } from "selectors/entitiesSelector";
import history from "utils/history";
import { Plugin } from "api/PluginApi";
import { DATASOURCE_DB_FORM } from "constants/forms";
import { createDatasourceFromForm } from "actions/datasourceActions";
import { AppState } from "reducers";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { getCurrentApplication } from "selectors/applicationSelectors";
import CenteredWrapper from "components/designSystems/appsmith/CenteredWrapper";
import { ApplicationPayload } from "constants/ReduxActionConstants";
import { QUERY_EDITOR_URL_WITH_SELECTED_PAGE_ID } from "constants/routes";
import BackButton from "./BackButton";

const DatasourceHomePage = styled.div`
  padding: 20px;
  margin-left: 10px;
  max-height: 95vh;
  overflow: auto;
  padding-bottom: 50px;
  .textBtn {
    font-size: 14px;
    justify-content: center;
    text-align: center;
    letter-spacing: -0.17px;
    color: #2e3d49;
    font-weight: 500;
    text-decoration: none !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const StyledContainer = styled.div`
  flex: 1;
  padding-top: 12px;
  padding-bottom: 12px;

  .sectionHeadings {
    font-weight: 500;
    font-size: 16px;
  }
`;

const CardsWrapper = styled.div`
  flex: 1;
  display: -webkit-box;
  flex-wrap: wrap;
  -webkit-box-pack: start !important;
  justify-content: center;
  text-align: center;
  min-width: 140px;
  border-radius: 4px;
`;

const DatasourceCardsContainer = styled.div`
  flex: 1;
  display: inline-flex;
  flex-wrap: wrap;
  margin-left: -10px;
  justify-content: flex-start;
  text-align: center;
  min-width: 150px;
  border-radius: 4px;

  .eachDatasourceCard {
    margin: 10px;
    width: 140px;
    height: 110px;
    padding-bottom: 0px;
    cursor: pointer;
  }
  .dataSourceImage {
    height: 52px;
    width: auto;
    margin-top: -5px;
    max-width: 100%;
    margin-bottom: 2px;
  }
`;

const LoadingContainer = styled(CenteredWrapper)`
  height: 50%;
`;

interface DatasourceHomeScreenProps {
  isSaving: boolean;
  pageId: string;
  applicationId: string;
  location: {
    search: string;
  };
  history: {
    replace: (data: string) => void;
    push: (data: string) => void;
  };
}

interface ReduxDispatchProps {
  initializeForm: (data: Record<string, any>) => void;
  createDatasource: (data: any) => void;
}

interface ReduxStateProps {
  plugins: Plugin[];
  currentApplication?: ApplicationPayload;
  pluginImages: Record<string, string>;
}

type Props = ReduxStateProps & DatasourceHomeScreenProps & ReduxDispatchProps;

class DatasourceHomeScreen extends React.Component<Props> {
  goToCreateDatasource = (pluginId: string, pluginName: string) => {
    const { currentApplication } = this.props;

    AnalyticsUtil.logEvent("CREATE_DATA_SOURCE_CLICK", {
      appName: currentApplication?.name,
      plugin: pluginName,
    });

    this.props.createDatasource({
      pluginId,
    });
  };

  render() {
    const {
      plugins,
      isSaving,
      pluginImages,
      applicationId,
      pageId,
    } = this.props;

    return (
      <DatasourceHomePage>
        <BackButton
          onClick={() =>
            history.push(
              QUERY_EDITOR_URL_WITH_SELECTED_PAGE_ID(
                applicationId,
                pageId,
                pageId,
              ),
            )
          }
        />
        <StyledContainer>
          <p className="sectionHeadings">Select Datasource Type</p>
        </StyledContainer>
        <CardsWrapper>
          {isSaving ? (
            <LoadingContainer>
              <Spinner size={30} />
            </LoadingContainer>
          ) : (
            <DatasourceCardsContainer>
              {plugins.map((plugin) => {
                return (
                  <Card
                    className="eachDatasourceCard"
                    interactive={false}
                    key={plugin.id}
                    onClick={() =>
                      this.goToCreateDatasource(plugin.id, plugin.name)
                    }
                  >
                    <img
                      alt="Datasource"
                      className="dataSourceImage"
                      src={pluginImages[plugin.id]}
                    />
                    <p className="t--plugin-name textBtn">{plugin.name}</p>
                  </Card>
                );
              })}
            </DatasourceCardsContainer>
          )}
        </CardsWrapper>
      </DatasourceHomePage>
    );
  }
}

const mapStateToProps = (state: AppState): ReduxStateProps => {
  return {
    pluginImages: getPluginImages(state),
    plugins: getDBPlugins(state),
    currentApplication: getCurrentApplication(state),
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    initializeForm: (data: Record<string, any>) =>
      dispatch(initialize(DATASOURCE_DB_FORM, data)),
    createDatasource: (data: any) => dispatch(createDatasourceFromForm(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DatasourceHomeScreen);
