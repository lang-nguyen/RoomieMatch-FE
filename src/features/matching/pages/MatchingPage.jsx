import { ChevronDown, Pencil, Send, X } from 'lucide-react';
import { useState } from 'react';
import ContactInfoCard from '../components/ContactInfoCard';
import ContactInfoForm from '../components/ContactInfoForm';
import MatchHistoryPanel from '../components/MatchHistoryPanel';
import MatchingCard from '../components/MatchingCard';
import MatchingProfileForm from '../components/MatchingProfileForm';
import MatchingSuccessCard from '../components/MatchingSuccessCard';
import NoMatchingCard from '../components/NoMatchingCard';
import RotatingMatchingDeck from '../components/RotatingMatchingDeck';
import { useMatchingFlow } from '../hooks/useMatchingFlow';
import { MATCHING_STEPS } from '../models/matchingModels';
import './MatchingPage.css';

const MatchingPage = () => {
  const matching = useMatchingFlow();
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [editingSection, setEditingSection] = useState('');
  const [selectedHistoryContact, setSelectedHistoryContact] = useState(null);

  const openEditSection = (section) => {
    setEditingSection(section);
    setIsEditMenuOpen(false);
    matching.setShowContactCard(false);
    setSelectedHistoryContact(null);
  };

  const closeEditSection = () => {
    setEditingSection('');
  };

  if (matching.isLoading) {
    return (
      <main className="matching-page">
        <div className="matching-loading">Đang tải Matching AI...</div>
      </main>
    );
  }

  if (matching.step === MATCHING_STEPS.SUCCESS) {
    return (
      <main className="matching-page matching-page-centered">
        <MatchingSuccessCard onStart={matching.startMatching} />
      </main>
    );
  }

  if (matching.step === MATCHING_STEPS.MATCHING) {
    return (
      <main className="matching-page matching-workspace">
        <div className="matching-edit-controls">
          <button
            className={`matching-edit-trigger ${isEditMenuOpen ? 'is-active' : ''}`}
            type="button"
            onClick={() => setIsEditMenuOpen((isOpen) => !isOpen)}
          >
            <span className="matching-edit-icon-wrap">
              <Pencil size={16} />
            </span>
            <span className="matching-edit-label">Chỉnh sửa</span>
            <ChevronDown className="matching-edit-chevron" size={15} />
          </button>

          {isEditMenuOpen && (
            <div className="matching-edit-menu matching-panel-pop">
              <button type="button" onClick={() => openEditSection('contact')}>
                <Send size={18} />
                Chỉnh sửa hồ sơ liên hệ
              </button>
              <button type="button" onClick={() => openEditSection('profile')}>
                <Send size={18} />
                Chỉnh sửa hồ sơ tìm bạn
              </button>
            </div>
          )}
        </div>

        {editingSection && (
          <section className="matching-edit-panel matching-panel-pop">
            <button
              className="matching-edit-close"
              type="button"
              aria-label="Đóng chỉnh sửa"
              onClick={closeEditSection}
            >
              <X size={20} />
            </button>

            {editingSection === 'profile' && (
              <MatchingProfileForm
                initialData={matching.currentProfile}
                onSubmit={async (profile) => {
                  await matching.completeProfile(profile);
                  closeEditSection();
                }}
              />
            )}

            {editingSection === 'contact' && (
              <ContactInfoForm
                currentUser={matching.currentUserContact}
                onSubmit={async (contactInfo) => {
                  await matching.completeContactInfo(contactInfo);
                  closeEditSection();
                }}
              />
            )}
          </section>
        )}

        <MatchHistoryPanel
          matchHistory={matching.matchHistory}
          skippedUsers={matching.skippedUsers}
          onSelectMatch={(user) => {
            setSelectedHistoryContact(user);
            matching.setShowContactCard(false);
            setEditingSection('');
            matching.hideFocusedCard();
          }}
        />

        <section className="matching-card-stage">
          <RotatingMatchingDeck
            users={matching.availableUsers}
            isSelecting={matching.isFlipping}
            onSelect={(selectedOffset) => {
              setSelectedHistoryContact(null);
              matching.setShowContactCard(false);
              matching.revealCard(selectedOffset);
            }}
          />

          {(matching.isRevealed || selectedHistoryContact) && (
            <div
              className="matching-focus-overlay"
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  setSelectedHistoryContact(null);
                  matching.hideFocusedCard();
                }
              }}
            >
              <div
                className={`matching-focus-card ${
                  matching.showContactCard || selectedHistoryContact ? 'is-contact-side' : ''
                }`}
              >
                {selectedHistoryContact ? (
                  <button
                    className="matching-focus-contact-face"
                    type="button"
                    onClick={() => setSelectedHistoryContact(null)}
                    aria-label="Đóng thông tin liên hệ"
                  >
                    <ContactInfoCard user={selectedHistoryContact} />
                  </button>
                ) : matching.activeUser ? (
                  matching.showContactCard ? (
                    <button
                      className="matching-focus-contact-face"
                      type="button"
                      onClick={() => matching.setShowContactCard(false)}
                      aria-label="Quay lại card matching"
                    >
                      <ContactInfoCard user={matching.activeUser} />
                    </button>
                  ) : (
                    <MatchingCard
                      user={matching.activeUser}
                      isSkipping={matching.isSkipping}
                      onSkip={() => {
                        setSelectedHistoryContact(null);
                        matching.skipActiveUser();
                      }}
                      onShowContact={() => {
                        setSelectedHistoryContact(null);
                        matching.showActiveUserContact();
                      }}
                    />
                  )
                ) : (
                  <NoMatchingCard />
                )}
              </div>
            </div>
          )}
        </section>

        <div className="matching-contact-stage" />
      </main>
    );
  }

  return (
    <main className="matching-page matching-onboarding">
      <section className="matching-intro">
        <h1>
          Chào mừng bạn đến với <span>AI Matching</span>
        </h1>
        <p>
          Để hệ thống có thể kết nối bạn với những lựa chọn phù hợp nhất, hãy dành chút thời
          gian tạo hồ sơ cá nhân của mình nhé.
        </p>

        <div className="matching-intro-actions">
          <button
            className={matching.showProfileForm ? 'is-active' : ''}
            type="button"
            onClick={() => {
              matching.setShowProfileForm((isOpen) => !isOpen);
              matching.setShowContactForm(false);
            }}
          >
            <Send size={20} />
            Tạo hồ sơ
          </button>
          <button
            className={matching.showContactForm ? 'is-active' : ''}
            type="button"
            onClick={() => {
              matching.setShowContactForm((isOpen) => !isOpen);
              matching.setShowProfileForm(false);
            }}
          >
            <Send size={20} />
            Thông tin liên hệ
          </button>
        </div>

      </section>

      <section className="matching-form-area">
        {matching.showProfileForm && (
          <MatchingProfileForm initialData={matching.currentProfile} onSubmit={matching.completeProfile} />
        )}
        {matching.showContactForm && (
          <ContactInfoForm currentUser={matching.currentUserContact} onSubmit={matching.completeContactInfo} />
        )}
      </section>
    </main>
  );
};

export default MatchingPage;
