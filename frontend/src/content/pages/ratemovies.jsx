import axios from "axios";
import { Steps } from "intro.js-react";
import 'intro.js/introjs.css';
import { Component } from 'react';
import { Button, Container, Spinner } from 'react-bootstrap';
import { Navigate } from "react-router-dom";
import withRouter from "../hooks/withRouter";
import { API } from "../utils/constants";
import MovieGrid from "../widgets/movieGrid";

class RatingPage extends Component {

    moviesRatingCount = 10;

    constructor(props) {
        super(props);
        this.rateMoviesHandler = this.rateMovies.bind(this);
        this.hoverTrackingHandler = this.trackHover.bind(this);
        this.actionTrackingHandler = this.updateActionHistory.bind(this);

        this.state = {
            raterDateTime: undefined,
            userid: this.props.router.location.state.userid,
            pageid: 1,
            stepsEnabled: true,
            initialStep: 0,
            steps: [
                {
                    element: ".jumbotron",
                    intro: "Move the slider to indicate your movie preferences."
                },
                {
                    element: "#gallery-right-btn",
                    intro: "Click the confirm button to confirm your rating and move on to the next rating.",
                    position: "left"
                },
                {
                    element: ".rankHolder",
                    intro: "You must rate " + this.moviesRatingCount + " pairs to proceed."
                },
                {
                    element: ".next-button",
                    intro: "Once you have rated enough movies, you can click here to continue."
                }
            ],
            count: 0,
            ratedLst: [],
            updateSuccess: false,
            loading: false
        };
        this.updateSurvey = this.updateSurveyResponse.bind(this);
    }

    componentDidMount() {
        this.setState({
            raterDateTime: new Date()
        });
    }

    updateSurveyResponse() {
        this.setState({
            loading: true
        });

        let raterDateTime = this.state.raterDateTime;
        let raterEndTime = new Date();
        let pageid = this.state.pageid;
        let userid = this.state.userid;
        let ratedLst = this.state.ratedLst;
        let ratingHistory = this.state.ratingHistory;
        let hoverHistory = this.state.hoverHistory;
        let actionHistory = this.state.actionHistory;

        axios.put(API + 'add_survey_response', {
            pageid: pageid,
            userid: userid,
            starttime: raterDateTime.toUTCString(),
            endtime: raterEndTime.toUTCString(),
            response: {
                ratings: ratedLst,
                rating_history: ratingHistory,
                hover_history: hoverHistory,
                action_history: actionHistory
            }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        updateSuccess: true,
                        loading: false
                    });
                    this.props.progressUpdater(10);
                }
            })
    }

    rateMovies(ratedLst, isNew, ratingHistory) {
        this.setState({
            count: isNew ? this.state.count + 1 : this.state.count,
            ratedLst: ratedLst,
            ratingHistory: ratingHistory
        });
    }

    trackHover(hoverHistory) {
        this.setState({
            hoverHistory: hoverHistory
        });
    }

    onBeforeChange = nextStepIndex => {
        if (nextStepIndex === 1) {
            this.steps.updateStepElement(nextStepIndex);
        }
    }

    updateActionHistory(actionHistory) {
        this.setState({
            actionHistory: actionHistory
        })
    }

    onExit = () => {
        this.setState(() => ({ stepsEnabled: false }));
    };

    render() {
        let userid = this.state.userid;
        let ratings = this.state.ratedLst;
        let pageid = this.state.pageid;
        const dest = this.props.dest;
        if (this.state.updateSuccess) {
            return (
                <Navigate to={dest} state={
                    {
                        userid: userid,
                        ratings: ratings,
                        pageid: pageid
                    }
                }
                />
            );
        }

        const {
            stepsEnabled,
            steps,
            initialStep,
        } = this.state;
        let disabled = this.state.count < this.moviesRatingCount;
        let buttonVariant = disabled ? 'secondary' : 'primary';

        return (
            <>
                <Steps
                    enabled={stepsEnabled}
                    steps={steps}
                    initialStep={initialStep}
                    onExit={this.onExit}
                    options={{
                        showStepNumbers: true,
                        scrollToElement: true,
                        hideNext: false,
                        nextToDone: true
                    }}
                    ref={steps => (this.steps = steps)}
                    onBeforeChange={this.onBeforeChange}
                />
                <div className="jumbotron">
                    <h1 className="header">Indicate your preferences</h1>
                    <p>Use the slider below to indicate how much you prefer 
                        one movie over the other. For example, if you strongly 
                        prefer one, move the slider to one of the extremes.
                        If you moderately prefer one, move the slider to the 
                        one you prefer, but not to the extremes. If you have 
                        no preference, movie the slider to the center.
                    </p>
                    
                </div>
                <Container>
                    <MovieGrid ratingHandler={this.rateMoviesHandler} userid={userid} pageid={pageid}
                        hoverHandler={this.hoverTrackingHandler} actionHandler={this.actionTrackingHandler} />
                </Container>
                <div className="jumbotron jumbotron-footer" style={{ display: "flex" }}>
                    <div className="rankHolder">
                        <span> Ratings left: </span>
                        <span><i>{this.moviesRatingCount - this.state.count}</i></span>
                        {/* <span><i>of {this.moviesRatingCount}</i></span> */}
                    </div>
                    <Button variant={buttonVariant} size="lg" style={{ height: "fit-content", marginTop: "1em" }}
                        className="next-button footer-btn" disabled={disabled && !this.state.loading}
                        onClick={this.updateSurvey}>
                        {!this.state.loading ? 'Next'
                            :
                            <>
                                <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Loading...
                            </>
                        }
                    </Button>
                </div>
            </>
        );
    }
}

export default withRouter(RatingPage);