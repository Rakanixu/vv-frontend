import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import {GridList, GridTile} from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './EditQuiz.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
var styles = {
  paper: {
    padding: 20,
    overflow: 'auto',
    height: 'min-content',
    width: '100%'
  }
};

class EditQuiz extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      url: config.baseAPI_URL + '/event/' + this.props.match.params.eventId + '/quiz/' + this.props.match.params.quizId,
      quiz: {}
    };
  }

  componentDidMount() {
    this._getQuiz();
  }

  _getQuiz() {
    axios.get(this.state.url).then(function(res) {
      this.setState({ quiz: res.data });
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleTextFieldChange(e) {
    this.state.quiz[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _handleEditQuiz(e) {
    this._editQuiz()
    .then(function(res) {
      this.props.history.push({
        pathname: '/manager/event/edit/' + this.props.match.params.eventId + '/detail',
        query: {
          showTabs: true,
          index: 6
        }
      });
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _editQuiz() {
    if (this.state.quiz.name === undefined || this.state.quiz.name === '' ||
      this.state.quiz.description === undefined || this.state.quiz.description === '') {
      return new Promise(function(resolve, reject) { reject(); });
    }

    var data = new FormData();
    data.append('name', this.state.quiz.name);
    data.append('description', this.state.quiz.description);

    return axios.put(this.state.url, data);
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

          <form className="edit-quiz">
            <Paper style={styles.paper}>
              <TextField floatingLabelText="Name"
                        data-val="name"
                        value={this.state.quiz.name}
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Description"
                        data-val="description"
                        value={this.state.quiz.description}
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />

              <RaisedButton label="Edit"
                            className="right margin-top-medium" 
                            primary={true} 
                            onTouchTap={this._handleEditQuiz.bind(this)} />
            </Paper>   
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(EditQuiz);
