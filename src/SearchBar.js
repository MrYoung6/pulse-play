import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state= {term: ""};
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search (e) {
        e.preventDefault()
        this.props.onSearch(this.state.term);
    }

    handleTermChange(e) {
        this.setState({term: e.target.value})
    }

    preventDefault(e) {
        e.preventDefault()
        console.log(e)
        
    }

    render() {
    return (
        <div className="SearchBar">
            <input className='search' type='text' placeholder='Enter a Song, Album, or Artist' onChange={(e) => this.handleTermChange(e)}/>
            <button className="SearchButton" onSubmit={(e)=> this.preventDefault(e)} onClick={(e) => this.search(e)}>SEARCH</button>
        </div>
    )
}
}

export default SearchBar;