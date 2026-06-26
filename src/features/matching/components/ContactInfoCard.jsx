import { Mail, Phone } from 'lucide-react';
import { SOCIAL_PLATFORMS } from '../models/matchingModels';

const ContactInfoCard = ({ user }) => {
  if (!user) return null;

  const contact = user.contact || user;
  const socials = contact.socials || contact || user;

  return (
    <aside className="matching-contact-card matching-panel-pop">
      <h2>Thông tin liên hệ</h2>

      <div className="matching-contact-person">
        <img src={user.avatar} alt={user.name} />
        <strong>{user.name}</strong>
        <span>Tham gia ngày: {user.joinedAt}</span>
      </div>

      <div className="matching-contact-card-lines">
        <a href={`tel:${contact.phone}`} className="matching-contact-chip">
          <Phone size={19} />
          <span>{contact.phone}</span>
        </a>
        <a href={`mailto:${contact.email}`} className="matching-contact-chip">
          <Mail size={19} />
          <span>{contact.email}</span>
        </a>
      </div>

      <div className="matching-contact-socials">
        {SOCIAL_PLATFORMS.filter((platform) => socials[platform.id]).map((platform) => (
          <a
            key={platform.id}
            className={`matching-social-tile matching-social-${platform.id}`}
            href={socials[platform.id]}
            target="_blank"
            rel="noreferrer"
            aria-label={platform.label}
          >
            <span>{platform.iconLabel}</span>
          </a>
        ))}
      </div>
    </aside>
  );
};

export default ContactInfoCard;
