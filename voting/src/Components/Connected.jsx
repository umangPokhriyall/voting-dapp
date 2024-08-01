import React from 'react'
import PropTypes from 'prop-types';

function Connected(props) {
  return (
    <div className="connected-container">
            <h1 className="connected-header">You are connected to metamask</h1>
            <p className="connected-account">Metamask Account: {props.account}</p>
            <p className="connected-account">Remaining Time: {props.remainingTime}</p>
                {props.canVote ? 
            <div>
                <input type="number" placeholder='Enter candidate index' value={props.number} onChange={props.handleNumberChange}/>
                <button className="login-button" onClick={props.voteFunction}>Vote</button> 
            </div>
                : <h1>You have already voted</h1>
              }
            <table id="myTable" className="candidates-table">
                <thead>
                <tr>
                    <th>Index</th>
                    <th>Candidate name</th>
                    <th>Candidate votes</th>
                </tr>
                </thead>
                <tbody>
                {props.candidates.map((candidate, index) => (
                    <tr key={index}>
                    <td>{candidate.index}</td>
                    <td>{candidate.name}</td>
                    <td>{candidate.voteCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
  )
}
Connected.propTypes = {
    handleNumberChange: PropTypes.func.isRequired,
    voteFunction: PropTypes.func.isRequired,
    account: PropTypes.string,
    remainingTime: PropTypes.number,
    number: PropTypes.string,
    canVote: PropTypes.bool,
    candidates: PropTypes.arrayOf(
        PropTypes.shape({
          index: PropTypes.number,
          name: PropTypes.string,
          voteCount: PropTypes.string,
        })
      ).isRequired,

  };

export default Connected;
