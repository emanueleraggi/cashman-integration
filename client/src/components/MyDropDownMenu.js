import React, { Component } from 'react';
import { render } from 'react-dom';


export class MyDropDown extends Component {
    constructor(props) {
        super(props);
        this.expanded=false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState !== this.state) {
            return true;
        }
        return !this.props.map && nextProps.map
    }
    
    componentDidMount() {
        this._render()
    }

    componentDidUpdate(prevProps, prevState) {
        this._render()
    }

    showCheckboxes = (e) => {
        let checkboxes = document.getElementById("checkboxes");
        let boxAll = document.getElementById("All"); // ID: {type.name}

        if (!this.expanded) {
            this.props.shipTypes.forEach((type) =>{
                let currentBox =  document.getElementById(type.name);
                currentBox.checked = false;
            })
            boxAll.checked = false;
            checkboxes.style.display = "block";
            this.expanded = true;
        } else {
            checkboxes.style.display = "none";
            this.expanded = false; 
        }
    }

    changeAllCheckBox = (e) => {
        let boxAll = document.getElementById("All");
        this.props.shipTypes.forEach((type) =>{
            let currentBox =  document.getElementById(type.name);
            currentBox.checked = boxAll.checked;
        });
    }

    getCheckedOption = (event) => {
        let boxAll = document.getElementById("All");

        if (boxAll.checked === true) {
            this.props.shipTypes.forEach((type) =>{
                let currentBox =  document.getElementById(type.name);
                currentBox.checked = true;
            })
            this.props.changeFilteredShips('All');
        } else {
            let options = [];
            this.props.shipTypes.forEach((type) =>{
                let currentBox =  document.getElementById(type.name);
                if (currentBox.checked === true) {
                    options.push(type.name)
                }
            })
            this.props.changeFilteredShips(options);
        }
    }

    _render() {
        const { props } = this
        if (!props.map || !props.controlPosition) return null;
        render(
            <form ref={
                el => {
                    if (!this.renderedOnce) {
                        this.el = el
                        props.map.controls[props.controlPosition].push(el)
                    } else if (el && this.el && el !== this.el) {
                        this.el.innerHTML = '';
                        [].slice.call(el.childNodes).forEach(child => this.el.appendChild(child))
                    }
                    this.renderedOnce = true
                }}>
                  <div class="multiselect">
                      <div class="selectBox" onClick={this.showCheckboxes}>
                        <select className="mydropdown">
                          <option selected hidden>All</option>
                        </select>
                        {/* <div class="overSelect"></div> */}
                      </div>
                      <div id="checkboxes" onClick={this.getCheckedOption}>
                          <label for="All">
                              <input type="checkbox" id="All" onClick={this.changeAllCheckBox}/>
                              All
                          </label>
                          {this.props.shipTypes.map((type) => {
                                return (
                                    <lable for={type.name}>
                                        <input type="checkbox" id={type.name}/>
                                        {type.name}
                                        <br />
                                    </lable>
                                    
                                )
                          })}
                      </div>
                  </div>
                {/* <select className="mydropdown">
                    <option value='All'>All</option>
                    {this.props.shipTypes.map((type) => {
                        return (
                        <option
                            className={this.props.activeShipTypes.includes(type) ? 'active' : ''}
                            key={type.images.sys.id}
                            value={type.name}
                        >
                            {type.name}
                        </option>
                        );
                    })}
                </select> */}

            </form>,
            document.createElement('div')
        )
    }

    render() {
        return <noscript/>
    }
}