import React, {Component, Fragment} from 'react';
import {render} from 'react-dom';
import {css} from 'react-emotion';
import uuidv4 from 'uuid/v4';
import PropTypes from 'prop-types';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';

import ListContainer from '../containers/ListContainer';

/**
 * This component displays a board that is in charge of the list components
 * Contains input to rename the board
 */
class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNewListInput: false,
      newListValue: '',
    }
  }

  toggleNewListInput = () => {
    this.setState({showNewListInput: !this.state.showNewListInput});
  }

  dragEnd = (result) => {
    // If the list was dragged and dropped in its orignal place, do nothing
    if (!result.destination) return;

    console.log(result);
    if (result.type === "LIST") {
      this.props.onRearrangeList(this.props.id, result.source.index, result.destination.index);
    }

    if (result.type === "CARD") {
      console.log('rearrange the cards, please');
      this.props.onRearrangeCard(result.source.droppableId, result.destination.droppableId, result.source.index, result.destination.index);
    }
  }

  render() {
    let input;
  
    return (
      <Fragment>
        <div id="board-header" className={`${boardHeaderStyle}`}>
            <span id="board-title" className={`${boardTitleStyle}`}>{this.props.name}</span>
            <span id="add-list-btn"
            className={`${addListBtnStyle}
              ${this.state.showNewListInput ? 'new-list-form-open' : ''}
              ${!this.state.newListValue ? 'new-list-form-empty' : ''}
            `} 
            onClick={e => {
              if (input && input.value.trim()) {
                this.props.onAddList(this.props.id, input.value.trim())
                input.value='';
              }
              
              this.toggleNewListInput();
            }}>
              <form id="new-list-form"
              className={`${this.state.showNewListInput ? 'open' : 'closed'}`}
              onSubmit={e => {
                e.preventDefault();
                if (!input.value.trim()) {
                  return;
                }
    
                this.props.onAddList(this.props.id, input.value.trim());
                input.value='';

                this.toggleNewListInput();
              }}>
                <input placeholder="New list name"
                autoFocus={true}
                ref={node => {
                  input = node;
                }}
                onClick={e => {e.stopPropagation()}}
                onChange={e => this.setState({newListValue: input.value.trim()})}
                />
              </form>

              <span className="icon ion-plus-round"></span>
            </span>
        </div>
        
        <DragDropContext onDragEnd={this.dragEnd}>
          <Droppable droppableId="lists" direction="horizontal" type="LIST">
            {(provided, snapshot) => (
              <div id="lists" className={`${listsStyle}`} ref={provided.innerRef}>
                {this.props.listIds.map((listId, index) => (
                  <Draggable key={listId} index={index} draggableId={listId} type="LIST">
                    {(provided, snapshot) => (
                      <div>
                        <ListContainer provided={provided} boardId={this.props.id} listId={listId}/>
                        {provided.placeholder}
                      </div>
                    )}
                  </Draggable>
                ))}
            </div>
            )}
          </Droppable>
        </DragDropContext>
      </Fragment>
    );
  }
};

Board.propTypes = {
  /** ID of board */
  id: PropTypes.string.isRequired,
  /** Name of the board */
  name: PropTypes.string.isRequired,
  /** IDs of the lists that belong to the board */
  listIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** Callback to add list to the board */
  onAddList: PropTypes.func.isRequired,
  /** Callback to rename board */
  onRenameBoard: PropTypes.func.isRequired,
}

const boardContainerStyle = css`
  background-color: whitesmoke;
  min-height: 100vh;
  max-height: 100vh;
  max-width: fit-content;
  display: grid
  grid-template-rows: 7vh 93vh;
  grid-template-columns: 100vw;
  overflow: hidden;
`;

const boardHeaderStyle = css`
  display: flex;
  align-items: center;
  background-color: white;
  position: sticky;
  left: 0px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 2.5px;
  padding-bottom: 2.5px;
  box-shadow: 0px 1px 7px 3px #0000001f;
  height: 40px;
`;

const boardTitleStyle = css`
  font-size: 2em;
  float: left;
`;

const addListBtnStyle = css`
  position: absolute;
  right: 0px;
  padding: inherit;
  margin-left: auto;
  font-size: 1.15em;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 7px;
  @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
    padding-right: 0px;
  }

  &.new-list-form-open {
    width: 33%;
    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
      width: 100%
    }
  }

  .text {
    margin-right: 8px;
    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
      display: none;
    }
  }

  .icon {
    transition: transform 0.25s ease;

    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
      margin: auto 25px auto 25px;
    }
  }

  &.new-list-form-open {
    .icon {
      padding: 0px;
      transform: rotate(0deg);
    }

    &.new-list-form-empty {
      .icon {
        transform: rotate(135deg);
      }
    }
  }

  #new-list-form {
    float: left;
    margin-bottom: 0;
    height: 100%
    display: flex;
    font-size: 1.5em;
    padding: inherit;
    padding-left: 0px;
    margin-left: auto;
    margin-right: 0px;
    transition: visibility 0s linear 0s, width 0.25s ease;

    &.closed {
      width: 0%;
      visibility: hidden;
      transition-delay: 0.25s, 0s;
    }

    &.open {
      width: 100%;
      visibility: visible;
    }

    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
      &.open {
        width: 100%;
      }

      margin-right: 0px;
      margin-left: auto;
    }

    input {
      font-size: 1em;
      width: 100%;
      padding-left: 7px;
      border-right: 1px solid #0000001a;
      border-bottom: none;
      border-left: 1px solid #0000001a;
      border-top: none;
    }

    &.closed input {
      border: none;
    }
  }
`;

const listsStyle = css`
  display: flex;
  margin-left: 7px;
  margin-right: 7px;
  padding-top: 15px;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: flex-start;
  height: calc(100vh - 60px);

  @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
    font-size: 1.5em;
  }
`;

export default Board;