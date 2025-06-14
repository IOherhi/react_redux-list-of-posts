import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { User } from '../types/User';
import { RootState } from '../app/store';
import { setUsers } from '../slisers/users';
import { getUsers } from '../api/users';
import { setUser } from '../slisers/user';
import { useAppDispatch, useAppSelector } from '../app/hooks';

type Props = {
  value: User | null;
};

export const UserSelector: React.FC<Props> = ({
  // `value` and `onChange` are traditional names for the form field
  // `selectedUser` represents what actually stored here
  value: selectedUser,
}) => {
  // `users` are loaded from the API, so for the performance reasons
  // we load them once in the `UsersContext` when the `App` is opened
  // and now we can easily reuse the `UserSelector` in any form
  const users = useAppSelector((state: RootState) => state.users);
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    getUsers().then(response => {
      dispatch(setUsers(response));
    });
  }, [dispatch]);

  useEffect(() => {
    if (!expanded) {
      return;
    }

    // we save a link to remove the listener later
    const handleDocumentClick = () => {
      // we close the Dropdown on any click (inside or outside)
      // So there is not need to check if we clicked inside the list
      setExpanded(false);
    };

    document.addEventListener('click', handleDocumentClick);

    // eslint-disable-next-line consistent-return
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
    // we don't want to listening for outside clicks
    // when the Dopdown is closed
  }, [expanded, users]);

  return (
    <div
      data-cy="UserSelector"
      className={classNames('dropdown', { 'is-active': expanded })}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={e => {
            e.stopPropagation();
            setExpanded(current => !current);
          }}
        >
          <span>{selectedUser?.name || 'Choose a user'}</span>

          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {users.map(user => (
            <a
              key={user.id}
              href={`#user-${user.id}`}
              onClick={() => {
                dispatch(setUser(user));
              }}
              className={classNames('dropdown-item', {
                'is-active': user.id === selectedUser?.id,
              })}
            >
              {user.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
