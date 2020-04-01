import React, { Component } from 'react';
import 'react-dates/initialize';
import 'react-dates/libs/css/_datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';

class DatePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startDate: null,
			endDate: null
		};
	}

	alertStartDate = () => {
		alert(this.state.startDate);
	};

	alertEndDate = () => {
		alert(this.state.endDate);
	};

	render() {
		return (
			<div className="calendar">
				<DateRangePicker
					startDate={this.state.startDate}
					startDateId="my start date"
					endDate={this.state.endDate}
					endDateId="my end date"
					onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
					focusedInput={(focusedInput) => this.setState({ focusedInput })}
				/>
				<br />
				<br />
				<button onClick={this.alertStartDate}>Set Start Date</button>
				<button onClick={this.alertEndDate}>Set End Date</button>
			</div>
		);
	}
}

export default DatePicker;
