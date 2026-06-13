import { CircleCheck, MapPin, X } from 'lucide-react';

const MatchingCard = ({ user, isSkipping, onSkip, onShowContact }) => {
  if (!user) return null;

  return (
    <article className={`matching-user-card ${isSkipping ? 'is-skipping' : ''}`}>
      <div className="matching-card-deck">
        <div className="matching-user-card-inner">
          <img className="matching-user-image" src={user.avatar} alt={user.name} />

          <div className="matching-user-body">
            <h2>{user.name}</h2>
            <p className="matching-user-location">
              <MapPin size={15} />
              {user.area}
            </p>
            <p className="matching-user-description">{user.description}</p>

            <div className="matching-user-meta">
              <span>
                <CircleCheck size={14} />
                Thói quen: {user.habits}.
              </span>
              <span>
                <CircleCheck size={14} />
                Ngân sách: {user.budget}.
              </span>
            </div>

            <div className="matching-user-actions">
              <button className="matching-skip-button" type="button" onClick={onSkip} aria-label="Bỏ qua">
                <X size={20} />
              </button>
              <button className="matching-contact-button" type="button" onClick={onShowContact}>
                Xem thông tin liên hệ
              </button>
            </div>
          </div>
        </div>
      </div>

      <button className="matching-block-button" type="button" onClick={onSkip}>
        Chặn người này
      </button>
    </article>
  );
};

export default MatchingCard;
