import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { blue600, blue100 } from 'material-ui/styles/colors';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './ActivitySettings.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');

const styles = {
  fit: {
    overflow: 'hidden',
    maxHeight: 400
  },
  toggle: {
    marginBottom: 16,
    fontSize: '1.15em',
    color: 'rgb(158, 158, 158)'
  },
  thumbSwitched: {
    backgroundColor: blue600
  },
  trackOff: {
    backgroundColor: blue100    
  }
};

class QuizEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      count: 0,
      url: config.baseAPI_URL + '/event/' + this.props.eventId,
      event: {}
    };
  }

  componentDidMount() {
    this._getEvent();
  }

  _getEvent() {
    axios.get(this.state.url).then(function(res) {
      this.setState({ event: res.data });
    }.bind(this)).catch(err => {
      this._handleError(err);
    });
  }

  _onToggleChange(e, checked) {
    this.state.event[e.currentTarget.dataset.value] = checked;
    this.setState({ event: this.state.event });

    var data = new URLSearchParams();
    for (var attr in this.state.event) {
      data.append(attr, this.state.event[attr]);
    }

    axios.put(this.state.url, data).catch(function(err) {
      this._getEvent();
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
      <div  key={this.state.count}>
        <ErrorReporting open={this.state.error !== null}
                  error={this.state.error} />

        <form className="activity-settings">
          <Toggle label="Chat highlight"
                  toggled={this.state.event.chat_highlight}
                  data-value="chat_highlight"
                  thumbSwitchedStyle={styles.thumbSwitched}
                  trackSwitchedStyle={styles.trackOff}
                  onToggle={this._onToggleChange.bind(this)}
                  style={styles.toggle}/>
          <Toggle label="Highlight chat with user image"
                  toggled={this.state.event.chat_with_user_image}
                  data-value="chat_with_user_image"
                  thumbSwitchedStyle={styles.thumbSwitched}
                  trackSwitchedStyle={styles.trackOff}
                  onToggle={this._onToggleChange.bind(this)}
                  style={styles.toggle}/>
          <Toggle label="Pose a question"
                  toggled={this.state.event.pose_question}
                  data-value="pose_question"
                  thumbSwitchedStyle={styles.thumbSwitched}
                  trackSwitchedStyle={styles.trackOff}
                  onToggle={this._onToggleChange.bind(this)}
                  style={styles.toggle}/>
          <Toggle label="Chat shown in status bar"
                  toggled={this.state.event.chat_shown_status_bar}
                  data-value="chat_shown_status_bar"
                  thumbSwitchedStyle={styles.thumbSwitched}
                  trackSwitchedStyle={styles.trackOff}
                  onToggle={this._onToggleChange.bind(this)}
                  style={styles.toggle}/>
          <Toggle label="Stage moment with webcam"
                  toggled={this.state.event.stage_moment_webcam}
                  data-value="stage_moment_webcam"
                  thumbSwitchedStyle={styles.thumbSwitched}
                  trackSwitchedStyle={styles.trackOff}
                  onToggle={this._onToggleChange.bind(this)}
                  style={styles.toggle}/>
        </form>
      </div>
    );
  }
}

export default withRouter(QuizEntry);
