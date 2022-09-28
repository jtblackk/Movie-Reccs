import { API } from "../utils/constants";
import axios from "axios";
import React, { Component } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import MovieGridItem from './movieGridItem';
import PreferenceSlider from "./PreferenceSlider";


class MovieGrid extends Component {
	itemsPerPage = 2;

	constructor(props) {
		super(props);
		this.state = {
			movies: [],
			visited: [],
			currentPage: 1,
			ratingHistory: [],
			hoverHistory: [],
			actionHistory: [],
			number_ratings_left: 10,
			slider_rating: 50,
		}
		this.renderNext = this.renderNextSet.bind(this);
		this.renderPrev = this.renderPrevSet.bind(this);
	}

	componentDidMount() {
		this.getMovies();
	}

	getMovies() {
		let curr = this.state.currentPage;
		let movies_ = this.state.movies;
		let userid = this.props.userid;
		let pageid = this.props.pageid;
		let subset = this.props.subset != null ? this.props.subset : 'rssa';
		// We prefetch the next page; every query is two pages of items
		axios
			.post(API + 'movies', {
				limit: this.itemsPerPage * 2,
				page: curr,
				userid: userid,
				pageid: pageid,
				subset: subset
			})
			.then(response => {
				this.setState({
					movies: movies_.concat(response.data)
				})
			})
			.catch(error => {
				console.log(error);
			});
	}

	renderNextSet() {
		// console.log("Next Button Clicked");
		let curr = this.state.currentPage;
		let actionHistory = [...this.state.actionHistory];
		curr += 1;
		if (curr % 2 === 0) {
			this.getMovies();
		}
		let action = {
			target_label: 'gallery next',
			target_type: 'button',
			action_type: 'click',
			timestamp: new Date().toUTCString()
		}
		actionHistory.push(action);
		this.setState({
			currentPage: curr,
			actionHistory: actionHistory
		});
		this.props.actionHandler(actionHistory);
	}

	renderPrevSet() {
		// console.log("Previous Button Clicked");
		let curr = this.state.currentPage;
		if (curr > 0) {
			let actionHistory = [...this.state.actionHistory];
			curr -= 1;
			let action = {
				target_label: 'gallery prev',
				target_type: 'button',
				action_type: 'click',
				timestamp: new Date().toUTCString()
			}
			actionHistory.push(action);
			this.setState({
				currentPage: curr,
				actionHistory: actionHistory
			});
			this.props.actionHandler(actionHistory);
		}
	}

	changeRating = (newRating, movieid) => {
		let level = this.state.currentPage;
		let movieLst = [...this.state.movies];
		let vstdLst = [...this.state.visited];
		let ratedItm = movieLst.map(movie => (
			movie.movie_id === movieid ? {
				...movie, rating: newRating
			} : movie
		));
		let ratingHistory = [...this.state.ratingHistory];
		let rated = {
			item_id: movieid,
			rating: newRating,
			rating_date: new Date().toUTCString(),
			loc: "gallery",
			level: level
		};
		ratingHistory.push(rated);
		let isNew = !vstdLst.some(item => item.item_id === movieid);
		if (isNew) {
			vstdLst.push(rated);
		} else {
			vstdLst = vstdLst.map(movie => (
				movie.item_id === movieid ? {
					...movie, rating: newRating,
					rating_date: new Date().toUTCString()
				} : movie
			));
		}
		this.setState({
			movies: ratedItm,
			visited: vstdLst,
			ratingHistory: ratingHistory
		});
		this.props.ratingHandler(vstdLst, isNew, ratingHistory);
	}

	trackHover = (evt, movieid, action) => {
		let level = this.state.currentPage;
		let history = [...this.state.hoverHistory];
		history.push({
			'item_id': movieid,
			time: new Date().toUTCString(),
			action: action,
			loc: "gallery",
			level: level

		});
		this.setState({
			hoverHistory: history
		});
		this.props.hoverHandler(history);
	}

	change_ratings_and_render_next = (slider_position) => {
		// console.log(preferred_item)
		// console.log(this.state.currentPage)

		let index_first_movie_on_page = (this.state.currentPage - 1)*this.itemsPerPage
		let current_selections = [this.state.movies[index_first_movie_on_page], this.state.movies[index_first_movie_on_page + 1]]
		// console.log(current_selections)

		let rating_item_1 = 3
		let rating_item_2 = 3

		if(slider_position <= 20){
			rating_item_1 = 5
			rating_item_2 = 1

		}
		else if(slider_position <= 40){
			rating_item_1 = 4
			rating_item_2 = 2
			
		}
		else if(slider_position <= 60){
			rating_item_1 = 3
			rating_item_2 = 3
			
		}
		else if(slider_position < 80){
			rating_item_1 = 2
			rating_item_2 = 4
		}
		else {
			rating_item_1 = 1
			rating_item_2 = 5
		}

		//console.log(current_selections[0])
		this.changeRating(rating_item_1, current_selections[0].id)
		this.changeRating(rating_item_2, current_selections[1].id)
		this.state.number_ratings_left -= 1

		// reset slider position
		this.setState({slider_rating: 50})

		this.renderNextSet()
	}

	handleSliderChange = (new_value) =>
	{
		this.setState({slider_rating: new_value})
	}
	render() {
		let startIdx = (this.state.currentPage - 1) * this.itemsPerPage;
		let itemsInCache = this.state.movies.length;
		if (itemsInCache > 0) {
			if(this.state.number_ratings_left > 0){
				return (
					<div>
						<div className="grid-layout" style={{ width: "fit-content", margin: "0 auto", display: "flex" }}>
							{/* <div style={{ paddingTop: "234px", marginRight: "18px" }}>
								<Button id="gallery-left-btn" disabled={startIdx === 0} variant="primary" style={{ width: "54px", height: "270px" }} onClick={this.renderPrev}>
									&lt;
								</Button>
							</div> */}
							{((startIdx + this.itemsPerPage) <= itemsInCache) ?
								<div className="grid-container">
									{this.state.movies.slice(startIdx, startIdx + this.itemsPerPage).map(currentMovie => (
										<MovieGridItem key={"TN_" + currentMovie.id} movieItem={currentMovie} hoverTracker={this.trackHover} />
									))}
								</div>
								: <div style={{ minWidth: "918px", minHeight: "656px" }}>
									<Spinner animation="border" role="status" style={{ margin: "18% 50%", width: "54px", height: "54px" }} />
								</div>
							}
							{/* <div style={{ paddingTop: "234px", marginLeft: "18px" }}>
								<Button id="gallery-right-btn" variant="primary" style={{ width: "54px", height: "270px" }} onClick={this.renderNext}>
									&gt;
								</Button>
							</div> */}
						</div>
						<PreferenceSlider value={this.state.slider_rating} changeHandler ={this.handleSliderChange} confirmRating={this.change_ratings_and_render_next} ></PreferenceSlider>
					</div>
				);
			}
			
			
		} else {
			return (
				<div style={{ minWidth: "300px", minHeight: "656px" }}>
					<Spinner animation="border" role="status" style={{ margin: "18% 50%", width: "54px", height: "54px" }} />
				</div>
			);
		}
	}
}

export default MovieGrid;