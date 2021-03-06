import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import Header from '../components/header/Header';
import LeftBar from '../components/leftbar/LeftBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Principal from '../components/principal/Principal';
import NewPrincipal from '../components/principal/NewPrincipal';
import EditPrincipal from '../components/principal/EditPrincipal';
import PrincipalManagers from '../components/principal/PrincipalManagers';
import ThemeDefault from '../theme-default';
import withWidth, {LARGE, SMALL} from 'material-ui/utils/withWidth';
import Assessment from 'material-ui/svg-icons/action/assessment';
import GridOn from 'material-ui/svg-icons/image/grid-on';
import ImageExposurePlus1 from 'material-ui/svg-icons/image/exposure-plus-1';
import PermIdentity from 'material-ui/svg-icons/action/perm-identity';
import Web from 'material-ui/svg-icons/av/web';
import './Root.css'

const utils = require('../utils.js');
const data = {
  menus: [
    { text: 'Overview', icon: <Assessment />, link: '/root/principal' },
    { text: 'New Principal', icon: <PermIdentity />, link: '/root/principal/new' }
  ]
};

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = { open: true };
  }

  componentWillMount() {
    if (!utils.IsRoot()) {
      this.props.history.push('/');
    }
  }

  _handleToggle = (e) => {
    this.setState({ open: !this.state.open });
  }

  _handleClose = () => {
    if (this.state.open) {
      this.setState({ open: false });
    }
  }

  _logout = (e) => {
    localStorage.clear();
    this.props.history.push('/login');
  }

  _handleRedirect(e) {
    this.props.history.push(e.currentTarget.dataset.url);
    this.setState({ open: false });
  }

  render() {
    const paddingLeftDrawerOpen = 300;
    const styles = {
      header: {}
    };

    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          <Header styles={styles.header}
                  handleChangeRequestNavDrawer={this._handleToggle.bind(this)} />
          <LeftBar navDrawerOpen={this.state.open}
                  menus={data.menus}
                  username="Root" />
          <div className="root-container">
            <Switch>
              <Route exact path={`${this.props.match.path}`} component={Principal} />
              <Route exact path={`${this.props.match.path}/principal`} component={Principal} />
              <Route exact path={`${this.props.match.path}/principal/new`} component={NewPrincipal} />
              <Route exact path={`${this.props.match.path}/principal/edit/:principalId`} component={EditPrincipal} />
              <Route exact path={`${this.props.match.path}/principal/:principalId/manager`} component={PrincipalManagers} />
            </Switch>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(Root);
