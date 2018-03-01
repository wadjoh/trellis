import React from 'react';
import { Link } from 'react-router-dom';
import uuidv4 from 'uuid/v4';
import PropTypes from 'prop-types';

import { boardListStyle, boardWithBackgroundStyle } from './styles/boardList';
import BackgroundPickerContainer from '../BackgroundPicker/BackgroundPickerContainer';
import * as backgrounds from '../BackgroundPicker/styles/backgrounds';

/**
 * This component displays the saved boards
 * There is an input element to add new boards
 */
const BoardList = ({
  boards,
  onAddBoardSubmit,
  onDeleteBoard,
  // onRenameBoard,
}) => {
  let input;

  return (
    <div id="board-list" className={`${boardListStyle}`}>
      <div id="header">
        <span id="site-title">Trellis</span>
        <span id="header-links">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.github.com/hooskers/trellis"
          >
            <span className="ion-social-github" />
          </a>
        </span>
      </div>
      <span id="get-started-msg">Add a board to get started:</span>
      <form
        id="new-board-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.value.trim()) {
            return;
          }

          onAddBoardSubmit(uuidv4(), input.value.trim());
          input.value = '';
        }}
      >
        <input
          id="new-board-input"
          placeholder="New board name"
          autoComplete="off"
          ref={(node) => {
            input = node;
          }}
        />
        <button id="new-board-submit" type="submit">Add board</button>
      </form>

      {Object.values(boards).map(board => (
        <div
          className={`board ${boardWithBackgroundStyle(backgrounds[board.background])}`}
          key={board.id}
        >
          <div className="board-info-container">
            <div className="background-picker">
              <BackgroundPickerContainer boardId={board.id} />
            </div>
            <Link
              href={`board/${board.id}`}
              to={`board/${board.id}`}
              className="board-link"
            >
              {board.name}
              <span
                role="button"
                tabIndex={0}
                className="delete-board ion-trash-a"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDeleteBoard(board.id);
                }}
                onKeyPress={e => e.key === 'Enter' && onDeleteBoard(board.id)}
              />
            </Link>
          </div>
        </div>
        ))}
    </div>
  );
};

BoardList.propTypes = {
  /** Object containing the boards */
  boards: PropTypes.shape({}).isRequired,
  /** Callback to add a board */
  onAddBoardSubmit: PropTypes.func.isRequired,
  /** Callback to delete a board */
  onDeleteBoard: PropTypes.func.isRequired,
  /** Callback to rename a board */
  // onRenameBoard: PropTypes.func.isRequired,
};

export default BoardList;
