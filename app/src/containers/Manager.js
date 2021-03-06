import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import { spacing, typography } from 'material-ui/styles';
import { white, grey600, grey900 } from 'material-ui/styles/colors';
import { customgrey, bartextcolor } from '../theme-colors';
import { Link } from 'react-router-dom';
import {Tabs, Tab} from 'material-ui/Tabs';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import SearchBox from '../components/header/SearchBox';
import LeftBar from '../components/leftbar/LeftBar';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowDown from 'material-ui/svg-icons/navigation/expand-more';
import ThemeDefault from '../theme-default';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import IconMenu from 'material-ui/IconMenu';
import AppBar from 'material-ui/AppBar';
import Assessment from 'material-ui/svg-icons/action/assessment';
import PermIdentity from 'material-ui/svg-icons/action/perm-identity';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import NewEvent from '../components/event/NewEvent';
import EventsGridList from '../components/event/EventsGridList';
import EditEvent from '../components/event/EditEvent';
import EventTabs from '../components/event/EventTabs';
import EditSliderImage from '../components/slider/EditSliderImage';
import EditAdmission from '../components/admission/EditAdmission';
import EditQuestionTopic from '../components/question-topic/EditQuestionTopic';
import EditMediaSource from '../components/media-source/EditMediaSource';
import EditPoll from '../components/poll/EditPoll';
import EditPollEntry from '../components/poll/EditPollEntry';
import EditAuction from '../components/auction/EditAuction';
import EditQuiz from '../components/quiz/EditQuiz';
import EditQuizEntry from '../components/quiz/EditQuizEntry';
import Media from '../components/media/Media';
import NewMedia from '../components/media/NewMedia';
import Users from '../components/user/Users';
import NewUser from '../components/user/NewUser';
import EditUser from '../components/user/EditUser';
import Donations from '../components/donation/Donations';
import DesignOptions from '../components/design-option/DesignOptions';
import EventLocationList from '../components/event-location/EventLocationList';
import NewEventLocation from '../components/event-location/NewEventLocation';
import EditEventLocation from '../components/event-location/EditEventLocation';
import Profile from '../components/profile/Profile';
import { setBackground, setLogo, setPrimaryColor } from '../utils';
import axios from 'axios';
import './Manager.css';

const config = require('./../config.json');
const utils = require('./../utils.js');
var user, principal = {};
const styles = {
  menuItem: {
    color: bartextcolor,
    fontSize: 14
  },
  logoContainer: {
    height: 56,
    overflow: 'hidden',
  },
  logo: {
    width: 110,
    marginTop: 15,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
    height: 32,
    padding: 0
  },
  inkBarStyle: {
      height: 5,
      background: '#2196F3'
  },
  tabs: {
      width: 900,
      height: 55,
  },
  button: {
      marginLeft:10
  },
  tabItemContainerStyle: {
      height: 54,
      background: '#ffffff'
  },
  text: {
      fontSize: 15
  },
  tab: {
      textTransform: 'none'
  },
  userMenu: {
      position: 'absolute',
      boxShadow: 'none',
      padding: 0,
      top: 10,
      right: 0
  }
};
const data = {
    menus: [
        {text: 'Overview', icon: <Assessment/>, link: '/manager/event'},
        {text: 'New event', icon: <PermIdentity/>, link: '/manager/event/new'},
        {text: 'Event Templates', icon: <Assessment/>, link: '/manager/template'},
        {text: 'New Event Template', icon: <PermIdentity/>, link: '/manager/template/new'},
        /* {text: 'Event locations', icon: <PermIdentity/>, link: '/manager/event_location'}, */
        {text: 'Donations', icon: <PermIdentity/>, link: '/manager/donations'},
        {text: 'Users', icon: <PermIdentity/>, link: '/manager/users'},
        {text: 'Media', icon: <PermIdentity/>, link: '/manager/media'},
        {text: 'Design options', icon: <PermIdentity/>, link: '/manager/design_options'}
    ]
};

class Manager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      url: config.baseAPI_URL + '/principal',
    };
  }

  componentWillMount() {
    if (!utils.IsManager()) {
      this.props.history.push('/');
    }

    if (localStorage.getItem('alantu-user')) {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }

    if (user && user.principal_id) {
      this._getPrincipal(user.principal_id);
    } else {
      this.props.history.push('/login');
    }
  }

  _getPrincipal = (id) => {
    axios.get(this.state.url + '/' + id).then(res => {
      principal = res.data;
      setBackground(config.baseURL + principal.background);
      setLogo(config.baseURL + principal.logo);
      setPrimaryColor(principal.primary_color);
    }).catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleToggle = () => {
    this.setState({ open: !this.state.open });
  }

  _handleClose = () => {
    if (this.state.open) {
      this.setState({ open: false });
    }
  }

  _handleRedirect(e) {
    if (e.currentTarget) {
      this.props.history.push(e.currentTarget.dataset.url);
    } else if (e.props && e.props['data-url']) {
      this.props.history.push(e.props['data-url']);
    }
    
    this.setState({ open: false });
  }

  _logout = (e) => {
    localStorage.clear();
    this.props.history.push('/login');
  }

  _handleError(err) {
    if (err.toString() === 'Error: Request failed with status code 401') {
      this._logout();
    }

    if (!err) {
      err = new Error('Invalid data');
    }

    this.setState({
      error: err
    });

    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          <AppBar title="Manager"
                  className="app-bar"
                  children={
                    <div className="manager-header-bar-left">
                      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                        <Tabs inkBarStyle={styles.inkBarStyle}
                              tabItemContainerStyle={styles.tabItemContainerStyle}
                              style={styles.tabs}>
                          <Tab style={styles.tab}
                               data-url="/manager/event"
                               onActive={this._handleRedirect.bind(this)}
                               label="Events"></Tab>
                          <Tab style={styles.tab}
                               data-url="/manager/template"
                               onActive={this._handleRedirect.bind(this)}
                               label="Event Templates"></Tab>
                          <Tab style={styles.tab}
                               data-url="/manager/users"
                               onActive={this._handleRedirect.bind(this)}
                               label="Users"></Tab>
                          <Tab style={styles.tab}
                               data-url="/manager/donations"
                               onActive={this._handleRedirect.bind(this)}
                               label="Donations"></Tab>
                          <Tab style={styles.tab}
                               data-url="/manager/media"
                               onActive={this._handleRedirect.bind(this)}
                               label="Media"> </Tab>
                          <Tab style={styles.tab}
                               data-url="/manager/design_options"
                               onActive={this._handleRedirect.bind(this)}
                               label="Design Options"></Tab>
                        </Tabs>
                      </MuiThemeProvider>
{/*                       <FloatingActionButton
                          mini={true}
                          backgroundColor="#2196F3"
                          zDepth={0}
                          style={styles.button}>
                        <ContentAdd />
                      </FloatingActionButton> */}
                    </div>
                  }
                  iconElementRight={
                    <div className="manager-header-bar-right">

                      <div className="manager-header-short-bar-left">
                        <IconMenu
                            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
                          <MenuItem data-url="/manager/event"
                                    onTouchTap={this._handleRedirect.bind(this)}
                                    primaryText="Events" />
                          <MenuItem data-url="/manager/template"
                                    onTouchTap={this._handleRedirect.bind(this)}
                                    primaryText="Event Templates" />
                          <MenuItem data-url="/manager/users"
                                    onTouchTap={this._handleRedirect.bind(this)} 
                                    primaryText="Users" />
                          <MenuItem data-url="/manager/donations"
                                    onTouchTap={this._handleRedirect.bind(this)}
                                    primaryText="Donations" />
                          <MenuItem data-url="/manager/media"
                                    onTouchTap={this._handleRedirect.bind(this)} 
                                    primaryText="Media" />
                          <MenuItem data-url="/manager/design_options"
                                    onTouchTap={this._handleRedirect.bind(this)} 
                                    primaryText="Design Options" />
                        </IconMenu>
                      </div>

                      <SearchBox />
                      <p style={styles.text}>User</p>
                      <IconButton >
                        <ArrowDown color="black"/>
                      </IconButton>
                      <IconMenu color={grey900}
                                iconButtonElement={
                                  <FloatingActionButton
                                      mini={true}
                                      backgroundColor="#ffffff"
                                      zDepth={0}>
                                    <Avatar>R</Avatar>
                                  </FloatingActionButton>
                                }
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                        <MenuItem primaryText="Profile" data-url="/manager/profile" onTouchTap={this._handleRedirect.bind(this)}/>
                        <MenuItem primaryText="Sign out" onClick={this._logout}/>
                      </IconMenu>
                    </div>
                  }
                  onLeftIconButtonTouchTap={this._handleToggle}
                  onTouchTap={this._handleClose}/>
          <LeftBar  navDrawerOpen={true}
                    menus={data.menus}
                    username="User"/>
          <div className="manager-container">
            <Switch>
              <Route exact path={`${this.props.match.path}`} component={EventsGridList} />
              <Route exact path={`${this.props.match.path}/event`}>
                <EventsGridList isTemplate={false} key={this.state.reloadEventList}/>
              </Route>
              <Route exact path={`${this.props.match.path}/event/new`}>
                <NewEvent isTemplate={false}/>
              </Route>
              <Route exact path={`${this.props.match.path}/event/edit/:eventId`}>
                <EditEvent isTemplate={false}/>
              </Route>
              <Route exact path={`${this.props.match.path}/event/edit/:eventId/detail`}>
                <EventTabs isTemplate={false} tabIndex={this.state.tabIndex}/>
              </Route>
              <Route exact path={`${this.props.match.path}/event/edit/:eventId/image/:imageId`}>
                <EditSliderImage isTemplate={false}/>
              </Route>
              <Route exact path={`${this.props.match.path}/event/edit/:eventId/admission/:admissionId`}>
                <EditAdmission isTemplate={false}/>
              </Route>
              <Route exact path={`${this.props.match.path}/event/edit/:eventId/poll/:pollId`}>
                <EditPoll isTemplate={false}/>
              </Route>
              <Route exact path={`${this.props.match.path}/event/edit/:eventId/poll/:pollId/poll_entry/:pollEntryId`}>
                <EditPollEntry isTemplate={false}/>
              </Route>
              <Route exact path={`${this.props.match.path}/event/edit/:eventId/question_topic/:questionTopicId`}>
                <EditQuestionTopic isTemplate={false}/>
              </Route>
              <Route exact path={`${this.props.match.path}/event/edit/:eventId/event_guest/:eventGuestId`}>
                <EditMediaSource isTemplate={false}/>
              </Route>
              {/* <Route exact path={`${this.props.match.path}/event/edit/:eventId/auction/:auctionId`} component={EditAuction} /> */}
              <Route exact path={`${this.props.match.path}/event/edit/:eventId/quiz/:quizId`}>
                <EditQuiz isTemplate={false}/>
              </Route>
              <Route exact path={`${this.props.match.path}/event/edit/:eventId/quiz/:quizId/quiz_entry/:quizEntryId`}>
                <EditQuizEntry isTemplate={false}/>
              </Route>
              <Route exact path={`${this.props.match.path}/template`}>
                <EventsGridList isTemplate={true} key={this.state.reloadTemplateList}/>
              </Route>
              <Route exact path={`${this.props.match.path}/template/new`}>
                <NewEvent isTemplate={true}/>
              </Route>
              <Route exact path={`${this.props.match.path}/template/edit/:eventId`}>
                <EditEvent isTemplate={true}/>
              </Route>
              <Route exact path={`${this.props.match.path}/template/edit/:eventId/detail`}>
                <EventTabs isTemplate={true} tabIndex={this.state.tabIndex}/>
              </Route>
              <Route exact path={`${this.props.match.path}/template/edit/:eventId/image/:imageId`}>
                <EditSliderImage isTemplate={true}/>
              </Route>
              <Route exact path={`${this.props.match.path}/template/edit/:eventId/admission/:admissionId`}>
                <EditAdmission isTemplate={true}/>
              </Route>
              <Route exact path={`${this.props.match.path}/template/edit/:eventId/poll/:pollId`}>
                <EditPoll isTemplate={true}/>
              </Route>
              <Route exact path={`${this.props.match.path}/template/edit/:eventId/poll/:pollId/poll_entry/:pollEntryId`}>
                <EditPollEntry isTemplate={true}/>
              </Route>
              <Route exact path={`${this.props.match.path}/template/edit/:eventId/question_topic/:questionTopicId`}>
                <EditQuestionTopic isTemplate={true}/>
              </Route>
              <Route exact path={`${this.props.match.path}/template/edit/:eventId/event_guest/:eventGuestId`}>
                <EditMediaSource isTemplate={true}/>
              </Route>
              {/* <Route exact path={`${this.props.match.path}/template/edit/:eventId/auction/:auctionId`} component={EditAuction} /> */}
              <Route exact path={`${this.props.match.path}/template/edit/:eventId/quiz/:quizId`}>
                <EditQuiz isTemplate={true}/>
              </Route>
              <Route exact path={`${this.props.match.path}/template/edit/:eventId/quiz/:quizId/quiz_entry/:quizEntryId`}>
                <EditQuizEntry isTemplate={true}/>
              </Route>
              <Route exact path={`${this.props.match.path}/event_location`} component={EventLocationList} />
              <Route exact path={`${this.props.match.path}/event_location/new`} component={NewEventLocation} />
              <Route exact path={`${this.props.match.path}/event_location/edit/:eventLocationId`} component={EditEventLocation} />
              <Route exact path={`${this.props.match.path}/media`} component={Media} />
              <Route exact path={`${this.props.match.path}/media/new`} component={NewMedia} />
              <Route exact path={`${this.props.match.path}/users`} component={Users} />
              <Route exact path={`${this.props.match.path}/users/new`} component={NewUser} />
              <Route exact path={`${this.props.match.path}/users/edit/:userId`} component={EditUser} />
              <Route exact path={`${this.props.match.path}/donations`} component={Donations} />
              <Route exact path={`${this.props.match.path}/design_options`} component={DesignOptions} />
              <Route exact path={`${this.props.match.path}/profile`} component={Profile} />
            </Switch>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(Manager);
