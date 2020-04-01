import React, { Component } from 'react';

export default class SearchVessel extends Component {
	render() {
		const { value, handleSubmit, handleChange } = this.props;

		return (
			<React.Fragment>
				<div className="container">
					<div className="row">
						<div className="col-10 mx-auto col-md-8 mt-5 text-center">
							<h4 className="text-slanted text-capitalize">Search for Vessel</h4>
							<form className="mt-4" onSubmit={handleSubmit}>
								<label htmlFor="search" className="text-capitalize">
									type vessel separated by comma
								</label>
								<div className="input-group">
									<input
										type="text"
										name="search"
										placeholder="Type name of vessel here"
										className="form-control"
										value={value}
										onChange={handleChange}
									/>
									<div className="input-group-append">
										<button type="submit" className="input-group-text bg-primary text-white">
											<i className="fas fa-search" />
											search
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}
