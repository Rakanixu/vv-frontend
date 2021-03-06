import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './NewUser.css';

const moment = require('moment');
const config = require('../../config.json');
const styles = {
  fit: {
    overflow: 'hidden',
    maxHeight: 400
  },
  paperLeft: {
    padding: 20,
    overflow: 'auto',
    width: '66%',
    float: 'left',
    minWidth: 220,
    marginRight: 40,
    height: 'min-content'
  },
  paperRight: {
    padding: 20,
    overflow: 'auto',
    width: '33%',
    float: 'left',
    minWidth: 150,
    height: 'min-content'
  }
};
var user = {};

class NewUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      avatar: {}
    };
  }

  componentWillMount() {
    if (localStorage.getItem('alantu-user')) {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }
  }

  _handleTextFieldChange(e) {
    var state = {}
    state[e.target.dataset.val] = e.target.value;
    this.setState(state);
    this.setState({ error: null });
  }

  _onAvatarChange = (pictures) => {
    this.setState({ avatar: pictures });
  }

  _handleRoleChange = (e, index, val) => {
    this.setState({
      role_id: val
    });
  }

  _handleNewUser(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);

    if (this.state.password !== this.state.password_confirmation ||
      this.state.password === undefined || this.state.password === '' ||
      this.state.password_confirmation === undefined || this.state.password_confirmation === '' ||
      this.state.email === undefined || this.state.email === '') {
      this._handleError();
      return;
    }

    this._createUser()
    .then(function(res) {
      this.props.history.push('/manager/users');
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _createUser() {
    var avatar;

    for (var i in this.state.avatar) {
      avatar = this.state.avatar[i];
      break;
    }

    try {
      avatar = dataURItoBlob(avatar);
    } catch (err) {}

    var now = moment(new Date()).utc().format();
    var data = new FormData();
    data.append('principal_id', user.principal_id);
    data.append('role_id', this.state.role_id);
    data.append('username', this.state.username);
    data.append('email', this.state.email);
    data.append('password', this.state.password);
    data.append('created_at', now);
    data.append('updated_at', now);
    data.append('avatar', avatar, 'avatar');

    return axios.post(config.baseAPI_URL + '/user', data);
  }

  _handleError(err) {
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
      <div className="container">
        <div className="inner-container">
          <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />
          <form className="new-user-form">
            <Paper style={styles.paperLeft}>
              <TextField floatingLabelText="Username"
                        data-val="username"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Email"
                        data-val="email"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Password"
                        type="password"
                        data-val="password"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Password confirmation"
                        type="password"
                        data-val="password_confirmation"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />

              <SelectField floatingLabelText="Select role"
                          fullWidth={true}
                          value={this.state.role_id}
                          onChange={this._handleRoleChange}>
                {Object.keys(config.roles).map((role, i) => (
                  <MenuItem key={i+1} value={i+1} primaryText={role} />
                ))}
              </SelectField>

              <RaisedButton label="Save User"
                          className="right margin-bottom-medium margin-top-medium"
                          primary={true}
                          onTouchTap={this._handleNewUser.bind(this)} />
            </Paper>

            <Paper style={styles.paperRight}>
              <div className="fit">
                <UploadPreview title="Avatar" label="Add" onChange={this._onAvatarChange} style={styles.fit}/>
              </div>
            </Paper>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(NewUser);
