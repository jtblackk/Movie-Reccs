import React, { Component } from 'react';
import StarRatings from 'react-star-ratings';

const defaultMovieIco = require("../res/default_movie_icon.svg");

class MovieGridItem extends Component {

	render() {

		let currentMovie = this.props.movieItem;
		let changeRating = this.props.ratingCallback;

		let containerClass = currentMovie.rating > 0 ? 'container-visited' : '';
		let starDivClass = currentMovie.rating > 0 ? 'star-div-rated' : 'star-div';

		return (
			<div id={"TN_" + currentMovie.movie_id} 
				onMouseEnter={(evt) => this.props.hoverTracker(evt, currentMovie.movie_id, 'enter')}
				onMouseLeave={(evt) => this.props.hoverTracker(evt, currentMovie.movie_id, 'leave')}
				className={"grid-item " + containerClass} style={{
					backgroundImage: "url(" + currentMovie.poster + "), url('" + defaultMovieIco + "')",
				}}>
				<div className="overlay" onClick={changeRating}>
					<div className={starDivClass}>
						<p>{currentMovie.description}</p>
					</div> 
				</div>
				<div className="grid-item-label" style={{ position: "absolute" }}>
					{currentMovie.title + " (" + currentMovie.year + ")"}
				</div>
			</div>
		);
	}
}

export default MovieGridItem;
