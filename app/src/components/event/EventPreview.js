import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import { GridList, GridTile } from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './EventPreview.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
const moment = require('moment');

var user = {};
var styles = {
  fit: {
    overflow: 'hidden',
    maxHeight: 250
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

class EventPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      domain: '',
      inviteWith: '',
      showPreviewImg: true,
      showEventBackground: true,
      principalUrl:  config.baseAPI_URL + '/principal/',
      event: {}
    };
  }

  componentDidMount() {
    if (!JSON.parse(localStorage.getItem('alantu-user'))) {
      this._handleError(new Error('User cannot be retrieved'));
    } else {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }

    this._getPrincipal(user.principal_id).then(function(res) {
      this.setState({ domain: res.data.domain });
      this._getEvent();
    }.bind(this));
  }

  _url() {
    return config.baseAPI_URL + '/' + this._getType() + '/' + this.props.match.params.eventId;
  }

  _getType() {
    return (this.props.isTemplate ? 'template' : 'event');
  }

  _getPrincipal = (id) => {
    return axios.get(this.state.principalUrl + id);
  }

  _handleRedirect() {
    //this.props.history.push('/manager/' + this._getType() + '/edit/' + this.props.match.params.eventId + '/detail');
    this.props.history.push('/manager/event');
  }

  _getEvent() {
    axios.get(this._url()).then(function(res) {
      res.data.date = new Date(res.data.date);
      this.setState({
        event: res.data,
        inviteWith: 'https://' + this.state.domain + '/event/' + res.data.id + '/run',
        eventBackgroundUrlFromGallery: res.data.event_background,
        previewImgUrlFromGallery: res.data.preview_img,
        original_speaker_media: res.data.speaker_media
      });

      window.shareReady();
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
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
        <div>
          <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />

          <div className="title">
            <h1>{this._getType().capitalize()}: {this.state.event.title}</h1>
            <div className="finish-later">
              <RaisedButton label="Finish later"
                            className="right margin-top-medium grey"
                            onTouchTap={this._handleRedirect.bind(this)} />
            </div>
          </div>

          <form className="edit-event-form">
            <Paper style={styles.paperLeft}>
              <TextField floatingLabelText={this._getType().capitalize() + ' title'}
                        className="title"
                        disabled={true}
                        value={this.state.event.title}
                        fullWidth={true} />
              <TextField floatingLabelText={this._getType().capitalize() + ' subtitle'}
                        disabled={true}
                        value={this.state.event.subtitle}
                        fullWidth={true} />
              <TextField floatingLabelText="Notes"
                        disabled={true}
                        value={this.state.event.notes}
                        fullWidth={true} />
              <TextField floatingLabelText="Location"
                        disabled={true}
                        value={this.state.event.location}
                        fullWidth={true} />
              {!this.props.isTemplate ?
              <span>
                <DatePicker hintText="Date"
                          disabled={true}
                          mode="landscape"
                          fullWidth={true}
                          value={this.state.event.date}/>
                <TimePicker hintText="Time"
                          disabled={true}
                          fullWidth={true}
                          value={this.state.event.date}
                          mode="landscape"
                          autoOk={true} />
                <p id="invite-with-label">Invite With</p>
                <hr id="invite-with-hr"/>
                <p id="invite-with-text-select">{this.state.inviteWith}</p>          
                {/* <TextField floatingLabelText="Invite With"
                          className="invite-with"
                          disabled={true}
                          style={{cursor: 'text', userSelect: 'all'}}
                          value={this.state.inviteWith}
                          fullWidth={true} /> */}
                <div id="share" className="event-info-column-share-icons"></div>
              </span>
              : null}
              <SelectField floatingLabelText="Media type"
                          disabled={true}
                          fullWidth={true}
                          value={this.state.event.speaker_media_type}>
                {config.name_guest_media_type.map((type, i) => (
                  <MenuItem key={i} value={type.id} primaryText={type.name} />
                ))}
              </SelectField>
              { this.state.event.speaker_media_type === 1 ?
                <div>
                  <div ref="galleryPreviewImg" className="margin-bottom-medium">
                    { this.state.event.speaker_media ? <img src={config.baseURL + this.state.event.speaker_media} alt="preview"/> : null }
                  </div>
                </div>
                :
                <TextField floatingLabelText="Speaker media"
                          disabled={true}
                          value={this.state.event.speaker_media}
                          fullWidth={true} />
              }
              <div className="checkbox">
                <Checkbox ref="checkbox"
                        checked={this.state.event.login_required}
                        disabled={true}
                        label="Login required?"/>
              </div>
            </Paper>

            <Paper style={styles.paperRight}>
              <label className="load-img-label">Preview Image</label>
              <div ref="galleryPreviewImg" className="margin-bottom-medium">
              { this.state.showPreviewImg ? <img src={config.baseURL + this.state.previewImgUrlFromGallery} alt="preview"/> : null }
              </div>

              <label className="load-img-label margin-top-medium block">Background Image</label>
              <div ref="galleryEventBackground" className="margin-bottom-medium">
              { this.state.showEventBackground ? <img src={config.baseURL + this.state.eventBackgroundUrlFromGallery} alt="preview"/> : null }
              </div>
            </Paper>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(EventPreview);
