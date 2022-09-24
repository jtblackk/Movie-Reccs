import React, { Component } from "react";
import { Form, Button, Col, Row, Container } from "react-bootstrap";


class PreferenceSlider extends Component {

	render() {

		const emotions = ['joy'];
		return (
			<>
				<Container>
					<div>
					<Row  md={2} style={{ margin: "1px 0", height: "27px" }}>
							<Col className="d-flex" md={{ span: 2, offset: 1 }} style={{ height: "36px", padding: "0" }}>
								{/* <p style={{ margin: "auto 0", textAlign: "left" }}>{emotion}</p> */}
								
							</Col> 
							{/* <Col></Col> */}
							<Col md={{ span: 6, offset: 3 }} style={{margin: "auto 0 0 18px"}}>
								{/* <Button variant="ersToggle">Low</Button> */}
								{/* <Form.Label></Form.Label> */}
								<p>Move the slider to indicate your preferred movie</p>
							</Col>
						</Row>
						<Row  md={2} style={{ margin: "1px 0", height: "27px" }}>
							<Col className="d-flex" md={{ span: 2, offset: 1 }} style={{ height: "36px", padding: "0" }}>
								
							</Col> 
							{/* <Col></Col> */}
							<Col md={{ span: 6 }} style={{margin: "auto 0 0 18px"}}>
								{/* <Button variant="ersToggle">Low</Button> */}
								{/* <Form.Label></Form.Label> */}
								<Form.Range value={this.props.value}onChange={(e)=>this.props.changeHandler(e.target.value)} />
							</Col>
						</Row>
							
						
					</div>
					<div className='d-flex'>
						<Button variant="ersControl" style={{ margin: "2em auto 0" }}>
							Reset
						</Button>
					</div>
				</Container>
			</>
		)
	}
}

export default PreferenceSlider;