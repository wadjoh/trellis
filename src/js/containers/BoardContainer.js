import React, {Component} from 'react';
import {render} from 'react-dom';
import {css} from 'react-emotion';
import {connect} from 'react-redux';

import {addList, rearrangeList, rearrangeCard, renameBoard, displayBoard} from '../actions.js';
import Board from '../components/Board';

const mapStateToProps = (state, ownProps) => ({
  ...state.boards[ownProps.match.params.id],
});

const mapDispatchToProps = {
  onAddList: addList,
  onRenameBoard: renameBoard,
  onDisplayBoard: displayBoard,
  onRearrangeList: rearrangeList,
  onRearrangeCard: rearrangeCard,
};

const BoardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Board);

export default BoardContainer;