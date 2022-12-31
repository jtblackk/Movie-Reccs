import React, { Component } from "react";
import { Form, Button, Col, Row, Container } from "react-bootstrap";


class PreferenceSlider extends Component {

	render() {
		const emotions = ['joy'];
		return (
			<Container>
				<div>
					<Row  md={2} style={{ margin: "1px 0", height: "27px" } }>
						<Col className="d-flex" md={{ span: 1, offset: 1 }} style={{ height: "36px", padding: "0" }}>

						</Col> 
						<Col md={{ span: 8 }} align="center" style={{margin: "auto 0 0 0px"}}>
							<Form.Range value={this.props.value}onChange={(e)=>this.props.changeHandler(e.target.value)} />
						</Col>
					</Row>


				</div>
				<div className='d-flex'>
					<Button style={{ margin: "1em auto 0"}} onClick = {()=>this.props.confirmRating(this.props.value)} >
						Confirm rating
					</Button>
				</div>
			</Container>
		)
	}
}

export default PreferenceSlider;
