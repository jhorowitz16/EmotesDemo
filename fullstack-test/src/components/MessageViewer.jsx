import classnames from "classnames";
import formatRelative from "date-fns/formatRelative";
import React from "react";
import { useChannelStore } from "../stores/channels";
import { useMessageStore } from "../stores/messages";
import { useUserStore } from "../stores/users";
import MessageEditor from "./MessageEditor";
import styles from "./MessageViewer.module.scss";

const Message = ({ content, createdAt, id, userId, channelId }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const user = useUserStore(state =>
    state.users.find(user => user.id === userId)
  );
  const activeUserId = useUserStore(state => state.activeUserId);
  const dateInstance = React.useMemo(() => new Date(createdAt), [createdAt]);

  return (
    <div className={styles.message}>
      <div className={styles.metadata}>
        {user == null ? null : (
          <span className={styles.username}>{user.username}</span>
        )}
        <span className={styles.timestamp}>
          {formatRelative(dateInstance, new Date())}
        </span>
      </div>
      {isEditing ? (
        <MessageEditor
          channelId={channelId}
          id={id}
          content={content}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        content
      )}
      {userId === activeUserId && !isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className={styles.editButton}
        >
          Edit
        </button>
      ) : null}
    </div>
  );
};

const MessageViewer = () => {
  const allMessages = useMessageStore(state => state.messages);
  const activeChannelId = useChannelStore(state => state.activeChannelId);
  const messagesForActiveChannel = React.useMemo(
    () => allMessages.filter(message => message.channelId === activeChannelId),
    [activeChannelId, allMessages]
  );
  const isEmpty = messagesForActiveChannel.length === 0;

  return (
    <div
      className={classnames(styles.wrapper, { [styles.wrapperEmpty]: isEmpty })}
    >
      {isEmpty ? (
        <div className={styles.empty}>
          No messages{" "}
          <span aria-label="Sad face" role="img">
            😢
          </span>
        </div>
      ) : (
        messagesForActiveChannel.map(message => (
          <Message
            channelId={activeChannelId}
            key={message.id}
            id={message.id}
            content={message.content}
            createdAt={message.createdAt}
            userId={message.userId}
          />
        ))
      )}
    </div>
  );
};

export default MessageViewer;
