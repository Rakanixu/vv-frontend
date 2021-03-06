import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Delete from 'material-ui/svg-icons/action/delete';
import axios from 'axios';
import ErrorReporting from 'material-ui-error-reporting';
import './QuizEntryList.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
const styles = {
  alignLeft: {
    textAlign: 'left'
  },
  image: {
    margin: 0,
    padding: 0
  },
  narrow: {
    width: 40,
    cursor: 'pointer'
  },
  narrowCenter: {
    width: 30,
    marginLeft: 10,
    cursor: 'pointer'
  }
};

class QuizEntryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quizId: this.props.match.params.quizId,
      tableHeight: window.innerHeight - 125,
      error: null,
      url: config.baseAPI_URL + '/quiz/',
      quiz_entries: []
    };
  }

  componentWillMount() {
    this._getQuizEntries(this.props.match.params.quizId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.quizId && nextProps.quizId >= 0) {
      this.setState({ quizId: nextProps.quizId });
      this._getQuizEntries(nextProps.quizId);
    }
  }

  _getType() {
    return (this.props.isTemplate ? 'template' : 'event');
  }

  _getQuizEntries(quizId) {
    axios.get(this.state.url + quizId + '/quiz_entry').then(res => {
      this.setState({ quiz_entries: res.data });
    }).catch(err => {
      this._handleError(err);
    });
  }

  _edit(e) {
    this.props.history.push('/manager/' + this._getType() + '/edit/' + this.props.eventId + '/quiz/' + this.state.quizId + '/quiz_entry/' + e.currentTarget.parentNode.dataset.id);
  }

  _delete(e) {
    axios.delete(this.state.url + this.state.quizId + '/quiz_entry/' + e.currentTarget.parentNode.dataset.id).then(function(res) {
      this._getQuizEntries(this.state.quizId);
    }.bind(this)).catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleError(err) {
    this.setState({ error: err });
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);
  }

  render() {
    return (
      <div>
        <ErrorReporting open={this.state.error !== null}
          error={this.state.error} />

        <Table fixedHeader={true} height={'"' + this.state.tableHeight.toString() + '"'}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={styles.alignLeft}>Question</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Answer one</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft} className="column-fix-left-margin">Answer two</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft} className="column-fix-left-margin">Answer three</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft} className="column-fix-left-margin">Answer four</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft} className="column-fix-left-margin">Right solution</TableHeaderColumn>
              { !this.props.noEdit ?
              <TableHeaderColumn style={styles.narrow}></TableHeaderColumn>
              : null }
              <TableHeaderColumn style={styles.narrow}></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.quiz_entries.map((question_entry, i) =>
              <TableRow key={i} data-id={question_entry.id}>
                <TableRowColumn style={styles.alignLeft}>{question_entry.question}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{question_entry.answer_one}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{question_entry.answer_two}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{question_entry.answer_three}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{question_entry.answer_four}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{question_entry.right_solution}</TableRowColumn>
                { !this.props.noEdit ?
                <TableRowColumn style={styles.narrowCenter} onTouchTap={this._edit.bind(this)}><ModeEdit/></TableRowColumn>
                : null }
                <TableRowColumn style={styles.narrowCenter} onTouchTap={this._delete.bind(this)}><Delete/></TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default withRouter(QuizEntryList);
