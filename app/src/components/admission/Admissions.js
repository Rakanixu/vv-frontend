import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import IconSelection from '../image/IconSelection';
import axios from 'axios';
import './Admissions.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');

var styles = {
  fit: {
    overflow: 'hidden',
    maxHeight: 400
  },
  paperLeft: {
    padding: 20,
    overflow: 'auto',
    width: '50%',
    float: 'left',
    minWidth: 220,
    marginRight: 40,
    height: 'min-content'
  },
  paperRight: {
    padding: 20,
    overflow: 'auto',
    width: '50%',
    float: 'left',
    minWidth: 150,
    height: 'min-content'
  }
};

class Admissions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      count: 0,
      icon: {},
      url: config.baseAPI_URL + '/event/',
      media: []
    };
  }

  componentWillMount() {
    axios.get(config.baseAPI_URL + '/media').then(res => {
      this.setState({ media: res.data });
    }).catch(err => {
      this._handleError(err);
    });
  }

  _handleTextFieldChange(e) {
    var state = {}
    state[e.target.dataset.val] = e.target.value;
    this.setState(state);
    this.setState({ error: null });
  }

  _iconChange(img) {
    this.setState({ icon: img });
  }

  _handleNewAdmission(e) {
    this._createAdmission()
    .then(function(res) {
      var count = this.state.count;
      count++;

      this.setState({
        error: null,
        icon: {},
        count: count,
        title: '',
        subtitle: '',
        price: '',
        description: ''
      });

      if (this.props.onSave) {
        this.props.onSave();
      }
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _createAdmission() {
    if (this.state.title === undefined || this.state.title === '' ||
      this.state.price === undefined || this.state.price === '') {
      return new Promise(function(resolve, reject) { reject(); });
    }

    var data = new FormData();
    data.append('title', this.state.title);
    data.append('subtitle', this.state.subtitle || '');
    data.append('price', this.state.price);
    data.append('description', this.state.description || '');
    data.append('icon', this.state.icon);

    return axios.post(this.state.url + this.props.eventId + '/admission', data);
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
      <div>
        <ErrorReporting open={this.state.error !== null}
                        error={this.state.error} />

        <div className={this.props.showNoEditListing ? "container new-admission-container" : "new-admission-container" } >
          <div className="title">
            <h1>New Admission</h1>
          </div>

          <form className="new-admission-form">
            <Paper style={styles.paperLeft}>
              <TextField floatingLabelText="Title"
                        data-val="title"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Subtitle"
                        data-val="subtitle"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Price ($ USD)"
                        data-val="price"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Description"
                        data-val="description"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />

              <div className="overflow">
                <RaisedButton label="Save Admission"
                              className="right margin-top-medium margin-left-medium" 
                              primary={true}
                              onTouchTap={this._handleNewAdmission.bind(this)} />
              </div> 
            </Paper>          

            <Paper style={styles.paperRight}>
              <IconSelection onChange={this._iconChange.bind(this)} hideDefaultImageButton={true}/>
            </Paper> 
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Admissions);
