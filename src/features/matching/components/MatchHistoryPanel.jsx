import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const HistoryGroup = ({ title, users, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`matching-history-group ${isOpen ? 'is-open' : ''}`}>
      <button type="button" onClick={() => setIsOpen((open) => !open)}>
        <span>{title}</span>
        <ChevronDown size={16} />
      </button>

      <div className="matching-history-list">
        {users.length > 0 ? (
          users.map((user) => (
            <div className="matching-history-user" key={user.id}>
              <img src={user.avatar} alt={user.name} />
              <span>
                <strong>{user.name}</strong>
                <small>{user.area}</small>
              </span>
            </div>
          ))
        ) : (
          <p>Chưa có dữ liệu</p>
        )}
      </div>
    </div>
  );
};

const MatchHistoryPanel = ({ matchHistory, skippedUsers }) => {
  return (
    <aside className="matching-history-panel">
      <h1>Lịch sử ghép bạn</h1>
      <HistoryGroup title="Lịch sử Match" users={matchHistory} />
      <HistoryGroup title="Đã bỏ qua" users={skippedUsers} />
    </aside>
  );
};

export default MatchHistoryPanel;
