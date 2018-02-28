import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import CardContainer from '../Card/CardContainer';
import ListTitleInput from './ListTitleInput';
import NewCardInput from './NewCardInput';
import { listStyle, listTitleStyle, newCardButtonStyle, deleteConfirmation } from './styles/list';
import { cardBackgroundStyle } from '../Card/styles/card';

/**
 * List component that shows cards that belong to the list.
 * List title element turns into an input when clicked
 * Button that adds a new card to the list
 */
class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listTitleFocused: false,
      newCardFormVisible: false,
      showDeleteConfirmation: false,
    };
  }

  toggleTitleFocus = () => {
    this.setState({ listTitleFocused: !this.state.listTitleFocused });
  }

  toggleNewCardForm = () => {
    this.setState({ newCardFormVisible: !this.state.newCardFormVisible });
  }

  toggleDeleteConfirmation = () => {
    const showDeleteConfirmation = !this.state.showDeleteConfirmation;
    this.setState({ showDeleteConfirmation });
  }

  render() {
    // See if the dnd `provided` props can be lifted into the Board component
    return (
      <div
        className={`list ${listStyle} ${this.state.showDeleteConfirmation && deleteConfirmation}`}
        ref={this.props.provided.innerRef}
        {...this.props.provided.draggableProps}
        {...this.props.provided.dragHandleProps}
      >
        <div className={`${listTitleStyle} list-title-bar`}>
          {
            !this.state.listTitleFocused ?
              <span
                role="button"
                tabIndex={0}
                className="list-title"
                onClick={this.toggleTitleFocus}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    this.toggleTitleFocus();
                  }
                }}
              >
                {this.props.name}
              </span>
            :
              <ListTitleInput
                onRenameList={this.props.onRenameList}
                listId={this.props.id}
                defaultValue={this.props.name}
                toggleTitleFocus={this.toggleTitleFocus}
                hideInput={this.toggleTitleFocus}
              />
          }
          <span
            role="button"
            tabIndex={0}
            className="list-delete ion-trash-a"
            onClick={() => this.toggleDeleteConfirmation()}
            // onClick={() => this.props.onDeleteList(this.props.boardId, this.props.id)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                // this.props.onDeleteList(this.props.boardId, this.props.id);
                this.toggleDeleteConfirmation();
              }
            }}
          />
        </div>

        <div className="list-delete-confirmation">
          <span className="list-delete-message">Delete this list?</span>
          <button className="list-delete-confirm" onClick={() => this.props.onDeleteList(this.props.boardId, this.props.id)}>Delete</button>
          <button className="list-delete-cancel" onClick={() => this.toggleDeleteConfirmation()}>Cancel</button>
        </div>

        {!this.state.newCardFormVisible ?
          <span
            role="button"
            tabIndex={0}
            className={`${newCardButtonStyle} new-card-button`}
            onClick={this.toggleNewCardForm}
            onKeyPress={e => e.key === 'Enter' && this.toggleNewCardForm()}
          >
            Add new card...
          </span> :
          <NewCardInput
            classes={`${cardBackgroundStyle}`}
            listId={this.props.id}
            onAddCard={this.props.onAddCard}
            toggleVisibility={this.toggleNewCardForm}
          />
        }

        <Droppable droppableId={this.props.id} direction="vertical" type="CARD">
          {providedDrop => (
            <div className="cards" ref={providedDrop.innerRef}>
              {this.props.cardIds.map((cardId, index) => (
                <Draggable key={cardId} index={index} draggableId={cardId} type="CARD">
                  {providedDrag => (
                    <div>
                      <CardContainer
                        provided={providedDrag}
                        listId={this.props.id}
                        cardId={cardId}
                      />
                      {providedDrag.placeholder}
                    </div>
                  )}
                </Draggable>
              ))}
              {providedDrop.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

List.propTypes = {
  /** ID of list */
  id: PropTypes.string.isRequired,
  /** Name of the list */
  name: PropTypes.string.isRequired,
  /** IDs of cards that belong to this list */
  cardIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** ID of board that the list belongs to */
  boardId: PropTypes.string.isRequired,
  onRenameList: PropTypes.func.isRequired,
  onDeleteList: PropTypes.func.isRequired,
  onAddCard: PropTypes.func.isRequired,
  provided: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default List;
