import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Nav from'./Nav.js';
import SliderImage from './SliderImage';
import SliderImageList from './SliderImageList';
import Admissions from './Admissions';
import AdmissionsList from './AdmissionsList';
import Polls from './Polls';
import PollsList from './PollsList';
import QuestionTopic from './QuestionTopic';
import QuestionTopicList from './QuestionTopicList';
import EventGuestsList from './EventGuestList';
import EventGuests from './EventGuests';
import Auction from './Auction';
import AuctionList from './AuctionList';
import Quiz from './Quiz';
import QuizList from './QuizList';
import QuizEntry from './QuizEntry';
import QuizEntryList from './QuizEntryList';
import ActivitySettings from './ActivitySettings';
import './EventTabs.css';

axios.defaults.withCredentials = true; 

const config = require('./../config.json');

class EventTabs extends Component {
  constructor(props) {
    super(props);

    const time = new Date().getTime();
    this.state = {
      tabs: [
        {
          handleActive: this.handleTabChange.bind(this, 0),
          title: 'Slider'
        },
        {
          handleActive: this.handleTabChange.bind(this, 1),
          title: 'Admissions'
        },
        {
          handleActive: this.handleTabChange.bind(this, 2),
          title: 'Polls'
        },
        {
          handleActive: this.handleTabChange.bind(this, 3),
          title: 'Question Topics'
        },
        {
          handleActive: this.handleTabChange.bind(this, 4),
          title: 'Event Guests'
        },
        {
          handleActive: this.handleTabChange.bind(this, 5),
          title: 'Auctions'
        },
        {
          handleActive: this.handleTabChange.bind(this, 6),
          title: 'Quizzes'
        },
        {
          handleActive: this.handleTabChange.bind(this, 7),
          title: 'Quiz Entries'
        },
        {
          handleActive: this.handleTabChange.bind(this, 8),
          title: 'Activity Settings'
        }
      ],
      show: [true, false, false, false, false, false, false, false, false],
      reloadSliderImageList: time + 'A',
      reloadAdmissionsList: time + 'B',
      reloadPollsList: time + 'C',
      reloadQuestionTopicList: time + 'D',
      reloadEventGuestsList: time + 'E',
      reloadAuctionList: time + 'F',
      reloadQuizList: time + 'G',
      reloadQuizEntryList: time + 'F',
      url: config.baseAPI_URL + '/event/' + this.props.eventId
    };
  }

  componentWillMount() {
    this.handleTabChange(this.props.tabIndex ? this.props.tabIndex : 0);
  }

  componentDidMount() {
    axios.get(this.state.url).then(res => {
      this.setState({ events: res.data });
    }).catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  handleTabChange = (index) => {
    var show = [];
    for (var i = 0; i < this.state.tabs.length; i++) {
      if (i === index) {
        show.push(true);
      } else {
        show.push(false);
      }
    }
    this.setState({ show: show });
  }

  onDone = () => {
    this.props.history.push('/manager/event');
  }

  onSave = (key) => {
    var state = {};
    state[key] = new Date().getTime();
    this.setState(state)
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
        <Nav tabs={this.state.tabs} tabIndex={this.props.tabIndex}/>
        { this.state.show[0] ? 
          <div>
            <SliderImageList key={this.state.reloadSliderImageList} eventId={this.props.eventId}/>
            <SliderImage onDone={this.onDone} onSave={this.onSave.bind(this, 'reloadSliderImageList')} eventId={this.props.eventId} noFit={true}/>
          </div>
          : null }
        { this.state.show[1] ? 
          <div>
            <AdmissionsList key={this.state.reloadAdmissionsList} eventId={this.props.eventId}/>  
            <Admissions onDone={this.onDone} onSave={this.onSave.bind(this, 'reloadAdmissionsList')} eventId={this.props.eventId} noFit={true}/>
          </div>
          : null }
        { this.state.show[2] ? 
          <div>
            <PollsList key={this.state.reloadPollsList} eventId={this.props.eventId}/>  
            <Polls onDone={this.onDone} onSave={this.onSave.bind(this, 'reloadPollsList')} eventId={this.props.eventId} noFit={true}/> 
          </div>
          : null }
        { this.state.show[3] ? 
          <div>
            <QuestionTopicList key={this.state.reloadQuestionTopicList} eventId={this.props.eventId}/>  
            <QuestionTopic onDone={this.onDone} onSave={this.onSave.bind(this, 'reloadQuestionTopicList')} eventId={this.props.eventId} noFit={true}/> 
          </div>  
          : null } 
        { this.state.show[4] ? 
          <div>
            <EventGuestsList key={this.state.reloadEventGuestsList} eventId={this.props.eventId}/>  
            <EventGuests onDone={this.onDone} onSave={this.onSave.bind(this, 'reloadEventGuestsList')} eventId={this.props.eventId} noFit={true}/> 
          </div>
          : null }
        { this.state.show[5] ? 
          <div>
            <AuctionList key={this.state.reloadAuctionList} eventId={this.props.eventId}/>  
            <Auction onDone={this.onDone} onSave={this.onSave.bind(this, 'reloadAuctionList')} eventId={this.props.eventId} noFit={true}/> 
          </div>
          : null }
        { this.state.show[6] ? 
          <div>
            <QuizList key={this.state.reloadQuizList} eventId={this.props.eventId}/>  
            <Quiz onDone={this.onDone} onSave={this.onSave.bind(this, 'reloadQuizList')} eventId={this.props.eventId} noFit={true}/> 
          </div>
          : null }
        { this.state.show[7] ? 
          <div>
            <QuizEntryList key={this.state.reloadQuizEntryList} eventId={this.props.eventId}/>  
            <QuizEntry onDone={this.onDone} onSave={this.onSave.bind(this, 'reloadQuizEntryList')} eventId={this.props.eventId} noFit={true}/> 
          </div>
          : null }     
        { this.state.show[8] ? 
          <div>
            <ActivitySettings onDone={this.onDone} eventId={this.props.eventId} noFit={true}/> 
          </div>
          : null }     
      </div>
    );
  }
}

export default withRouter(EventTabs);
